# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import pytest

from plane.ai.adoption import adopt_instance_llm_configuration
from plane.ai.features import DEFAULT_FEATURE
from plane.db.models import AIModel, AIProvider, ModelAssignment
from plane.license.models import InstanceConfiguration
from plane.license.utils.encryption import encrypt_data

pytestmark = [pytest.mark.unit, pytest.mark.django_db]


@pytest.fixture
def configured(settings):
    settings.SKIP_ENV_VAR = True

    def configure(**values):
        for key, value in values.items():
            InstanceConfiguration.objects.create(
                key=key,
                value=encrypt_data(value) if key == "LLM_API_KEY" else value,
                category="AI",
                is_encrypted=key == "LLM_API_KEY",
            )

    return configure


@pytest.fixture
def catalog():
    openai = AIProvider.objects.create(slug="openai", name="OpenAI")
    AIProvider.objects.create(slug="anthropic", name="Anthropic")
    return openai


def test_moves_the_instance_key_onto_the_provider(configured, catalog):
    configured(LLM_API_KEY="sk-instance", LLM_PROVIDER="openai", LLM_MODEL="gpt-4o-mini")

    assert adopt_instance_llm_configuration() is True

    catalog.refresh_from_db()
    assert catalog.api_key == "sk-instance"


def test_activates_the_configured_model_and_assigns_it(configured, catalog):
    configured(LLM_API_KEY="sk-instance", LLM_PROVIDER="openai", LLM_MODEL="gpt-4o-mini")

    adopt_instance_llm_configuration()

    model = AIModel.objects.get(provider=catalog, key="gpt-4o-mini")
    assert model.status == AIModel.Status.ACTIVE
    assignment = ModelAssignment.objects.get(feature=DEFAULT_FEATURE)
    assert assignment.scope == ModelAssignment.Scope.INSTANCE
    assert assignment.model == model


def test_activates_a_model_the_seed_left_pending(configured, catalog):
    seeded = AIModel.objects.create(provider=catalog, key="gpt-4o-mini", name="GPT-4o mini")
    configured(LLM_API_KEY="sk-instance", LLM_PROVIDER="openai", LLM_MODEL="gpt-4o-mini")

    adopt_instance_llm_configuration()

    seeded.refresh_from_db()
    assert seeded.status == AIModel.Status.ACTIVE
    assert ModelAssignment.objects.get(feature=DEFAULT_FEATURE).model == seeded


def test_an_unconfigured_instance_is_left_alone(configured, catalog):
    assert adopt_instance_llm_configuration() is False
    assert ModelAssignment.objects.exists() is False


def test_an_unknown_provider_is_left_alone(configured, catalog):
    configured(LLM_API_KEY="sk-instance", LLM_PROVIDER="nowhere", LLM_MODEL="gpt-4o-mini")

    assert adopt_instance_llm_configuration() is False
    assert ModelAssignment.objects.exists() is False


def test_a_provider_that_already_has_a_key_keeps_it(configured, catalog):
    catalog.set_api_key("sk-already-here")
    catalog.save()
    configured(LLM_API_KEY="sk-instance", LLM_PROVIDER="openai", LLM_MODEL="gpt-4o-mini")

    adopt_instance_llm_configuration()

    catalog.refresh_from_db()
    assert catalog.api_key == "sk-already-here"


def test_runs_once(configured, catalog):
    configured(LLM_API_KEY="sk-instance", LLM_PROVIDER="openai", LLM_MODEL="gpt-4o-mini")

    assert adopt_instance_llm_configuration() is True
    assert adopt_instance_llm_configuration() is False
    assert ModelAssignment.objects.count() == 1


def test_overwrite_replaces_the_key_and_repoints_the_assignment(configured, catalog):
    catalog.set_api_key("sk-old")
    catalog.save()
    old = AIModel.objects.create(provider=catalog, key="gpt-4o", name="GPT-4o", status=AIModel.Status.ACTIVE)
    ModelAssignment.objects.create(feature=DEFAULT_FEATURE, scope=ModelAssignment.Scope.INSTANCE, model=old)
    configured(LLM_API_KEY="sk-new", LLM_PROVIDER="openai", LLM_MODEL="gpt-4o-mini")

    assert adopt_instance_llm_configuration(overwrite=True) is True

    catalog.refresh_from_db()
    assert catalog.api_key == "sk-new"
    assert ModelAssignment.objects.get(feature=DEFAULT_FEATURE).model.key == "gpt-4o-mini"


def test_overwrite_with_nothing_new_changes_nothing(configured, catalog):
    configured(LLM_API_KEY="sk-instance", LLM_PROVIDER="openai", LLM_MODEL="gpt-4o-mini")
    adopt_instance_llm_configuration()

    assert adopt_instance_llm_configuration(overwrite=True) is False
