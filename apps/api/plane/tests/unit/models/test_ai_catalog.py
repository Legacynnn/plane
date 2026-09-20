# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from datetime import timedelta
from decimal import Decimal
from uuid import uuid4

import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.utils import timezone

from plane.db.models import (
    AIModel,
    AIProvider,
    Markup,
    ModelAssignment,
    ModelPrice,
    Workspace,
)

pytestmark = pytest.mark.django_db


@pytest.fixture
def provider(db):
    return AIProvider.objects.create(slug="openai", name="OpenAI", kind=AIProvider.Kind.LLM)


@pytest.fixture
def model(provider):
    return AIModel.objects.create(provider=provider, key="gpt-4o-mini", name="GPT-4o mini")


@pytest.fixture
def fallback_model(provider):
    return AIModel.objects.create(provider=provider, key="gpt-4o", name="GPT-4o")


@pytest.fixture
def acme(create_user):
    return Workspace.objects.create(name="Acme", slug="acme", id=uuid4(), owner=create_user)


@pytest.mark.unit
class TestAIProvider:
    def test_defaults(self, provider):
        assert provider.enabled is True
        assert provider.cloud_only is False
        assert provider.base_url == ""
        assert provider.has_api_key is False

    def test_api_key_is_stored_encrypted(self, provider):
        provider.set_api_key("sk-secret")
        provider.save()

        stored = AIProvider.objects.get(pk=provider.pk)
        assert stored.api_key_encrypted != "sk-secret"
        assert "sk-secret" not in stored.api_key_encrypted
        assert stored.api_key == "sk-secret"
        assert stored.has_api_key is True

    def test_slug_is_unique_among_live_providers(self, provider):
        with pytest.raises(IntegrityError), transaction.atomic():
            AIProvider.objects.create(slug="openai", name="Other", kind=AIProvider.Kind.LLM)

    def test_slug_is_reusable_after_delete(self, provider):
        provider.delete()
        AIProvider.objects.create(slug="openai", name="OpenAI again", kind=AIProvider.Kind.LLM)

    def test_kinds(self):
        assert set(AIProvider.Kind.values) == {"llm", "decision", "search", "embedding"}


@pytest.mark.unit
class TestAIModel:
    def test_defaults(self, model):
        assert model.status == AIModel.Status.PENDING
        assert model.source == AIModel.Source.MANUAL
        assert model.capabilities == []
        assert model.context_window is None
        assert model.max_output_tokens is None

    def test_key_is_unique_per_provider(self, model, provider):
        with pytest.raises(IntegrityError), transaction.atomic():
            AIModel.objects.create(provider=provider, key="gpt-4o-mini", name="Duplicate")

    def test_same_key_allowed_on_another_provider(self, model):
        other = AIProvider.objects.create(slug="openrouter", name="OpenRouter", kind=AIProvider.Kind.LLM)
        AIModel.objects.create(provider=other, key="gpt-4o-mini", name="GPT-4o mini")

    def test_statuses_and_sources(self):
        assert set(AIModel.Status.values) == {"pending", "active", "deprecated", "disabled"}
        assert set(AIModel.Source.values) == {"models.dev", "litellm", "manual"}


@pytest.mark.unit
class TestModelPrice:
    def test_price_cannot_be_edited_in_place(self, model):
        price = ModelPrice.start(model, input_per_mtok=Decimal("0.15"), output_per_mtok=Decimal("0.60"))
        price.input_per_mtok = Decimal("0.10")
        with pytest.raises(ValidationError):
            price.save()
        assert ModelPrice.objects.get(pk=price.pk).input_per_mtok == Decimal("0.15")

    def test_starting_a_price_closes_the_previous_one(self, model):
        now = timezone.now()
        first = ModelPrice.start(model, effective_from=now - timedelta(days=10), input_per_mtok=Decimal("0.15"))
        second = ModelPrice.start(model, effective_from=now, input_per_mtok=Decimal("0.10"))

        first.refresh_from_db()
        assert first.effective_to == now
        assert second.effective_to is None
        assert ModelPrice.objects.filter(model=model).count() == 2

    def test_effective_at_returns_the_price_charged_then(self, model):
        now = timezone.now()
        first = ModelPrice.start(model, effective_from=now - timedelta(days=10), input_per_mtok=Decimal("0.15"))
        second = ModelPrice.start(model, effective_from=now, input_per_mtok=Decimal("0.10"))

        assert ModelPrice.effective_at(model, now - timedelta(days=5)) == first
        assert ModelPrice.effective_at(model, now) == second
        assert ModelPrice.effective_at(model, now + timedelta(days=5)) == second
        assert ModelPrice.effective_at(model, now - timedelta(days=30)) is None

    def test_a_price_cannot_start_before_the_current_one(self, model):
        now = timezone.now()
        ModelPrice.start(model, effective_from=now, input_per_mtok=Decimal("0.15"))
        with pytest.raises(ValidationError):
            ModelPrice.start(model, effective_from=now - timedelta(days=1), input_per_mtok=Decimal("0.10"))

    def test_price_dimensions(self, model):
        price = ModelPrice.start(
            model,
            input_per_mtok=Decimal("3"),
            cached_input_per_mtok=Decimal("0.3"),
            cache_write_per_mtok=Decimal("3.75"),
            output_per_mtok=Decimal("15"),
            reasoning_per_mtok=Decimal("15"),
            per_call=Decimal("0.005"),
        )
        price.refresh_from_db()
        assert price.cache_write_per_mtok == Decimal("3.75")
        assert price.per_call == Decimal("0.005")
        assert price.currency == "USD"


@pytest.mark.unit
class TestModelAssignment:
    def test_resolution_prefers_agent_then_workspace_then_instance(self, model, fallback_model, acme):
        agent_id = uuid4()
        instance = ModelAssignment.objects.create(
            scope=ModelAssignment.Scope.INSTANCE, feature="assist", model=model, fallback_model=fallback_model
        )
        assert ModelAssignment.resolve("assist", workspace=acme, agent_id=agent_id) == instance

        workspace = ModelAssignment.objects.create(
            scope=ModelAssignment.Scope.WORKSPACE, workspace=acme, feature="assist", model=fallback_model
        )
        assert ModelAssignment.resolve("assist", workspace=acme, agent_id=agent_id) == workspace
        assert ModelAssignment.resolve("assist") == instance

        agent = ModelAssignment.objects.create(
            scope=ModelAssignment.Scope.AGENT, workspace=acme, agent_id=agent_id, feature="assist", model=model
        )
        assert ModelAssignment.resolve("assist", workspace=acme, agent_id=agent_id) == agent
        assert ModelAssignment.resolve("assist", workspace=acme, agent_id=uuid4()) == workspace

    def test_resolution_is_per_feature(self, model):
        ModelAssignment.objects.create(scope=ModelAssignment.Scope.INSTANCE, feature="assist", model=model)
        assert ModelAssignment.resolve("aligner") is None

    def test_one_assignment_per_scope_and_feature(self, model, fallback_model):
        ModelAssignment.objects.create(scope=ModelAssignment.Scope.INSTANCE, feature="assist", model=model)
        with pytest.raises(IntegrityError), transaction.atomic():
            ModelAssignment.objects.create(scope=ModelAssignment.Scope.INSTANCE, feature="assist", model=fallback_model)

    def test_scope_must_match_its_target(self, model, acme):
        with pytest.raises(IntegrityError), transaction.atomic():
            ModelAssignment.objects.create(scope=ModelAssignment.Scope.WORKSPACE, feature="assist", model=model)
        with pytest.raises(IntegrityError), transaction.atomic():
            ModelAssignment.objects.create(
                scope=ModelAssignment.Scope.INSTANCE, workspace=acme, feature="assist", model=model
            )
        with pytest.raises(IntegrityError), transaction.atomic():
            ModelAssignment.objects.create(
                scope=ModelAssignment.Scope.AGENT, workspace=acme, feature="assist", model=model
            )


@pytest.mark.unit
class TestMarkup:
    def test_defaults_to_one_with_no_rows(self, provider):
        assert Markup.for_provider(provider) == Decimal("1")

    def test_provider_markup_overrides_the_instance_default(self, provider):
        other = AIProvider.objects.create(slug="anthropic", name="Anthropic", kind=AIProvider.Kind.LLM)
        Markup.objects.create(multiplier=Decimal("1.2"))
        Markup.objects.create(provider=provider, multiplier=Decimal("1.5"))

        assert Markup.for_provider(provider) == Decimal("1.5")
        assert Markup.for_provider(other) == Decimal("1.2")

    def test_one_instance_default(self):
        Markup.objects.create(multiplier=Decimal("1.2"))
        with pytest.raises(IntegrityError), transaction.atomic():
            Markup.objects.create(multiplier=Decimal("1.3"))

    def test_one_markup_per_provider(self, provider):
        Markup.objects.create(provider=provider, multiplier=Decimal("1.5"))
        with pytest.raises(IntegrityError), transaction.atomic():
            Markup.objects.create(provider=provider, multiplier=Decimal("1.6"))

    def test_multiplier_must_be_positive(self):
        with pytest.raises(IntegrityError), transaction.atomic():
            Markup.objects.create(multiplier=Decimal("0"))
