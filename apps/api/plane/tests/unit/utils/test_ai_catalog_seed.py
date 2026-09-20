# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from decimal import Decimal

import pytest

from plane.db.models import AIModel, AIProvider, Markup, ModelPrice
from plane.utils.ai_catalog_seed import DEFAULT_SEED_PATH, seed_ai_catalog

pytestmark = [pytest.mark.unit, pytest.mark.django_db]

SEED = """
markup: "1.0"
providers:
  - slug: openai
    name: OpenAI
    kind: llm
    models:
      - key: gpt-4o-mini
        name: GPT-4o mini
        capabilities: [tools, vision]
        context_window: 128000
        max_output_tokens: 16384
        status: active
        price:
          input_per_mtok: "0.15"
          cached_input_per_mtok: "0.075"
          output_per_mtok: "0.60"
  - slug: jev
    name: Jev
    kind: decision
    cloud_only: true
    models:
      - key: jev-decision
        name: Jev decision
        price:
          per_call: "0.002"
"""


@pytest.fixture
def seed_file(tmp_path):
    path = tmp_path / "catalog.yaml"
    path.write_text(SEED)
    return path


def test_seeds_an_empty_catalog(seed_file):
    assert seed_ai_catalog(seed_file) is True

    openai = AIProvider.objects.get(slug="openai")
    assert openai.kind == AIProvider.Kind.LLM
    assert openai.has_api_key is False

    jev = AIProvider.objects.get(slug="jev")
    assert jev.cloud_only is True

    mini = AIModel.objects.get(provider=openai, key="gpt-4o-mini")
    assert mini.status == AIModel.Status.ACTIVE
    assert mini.capabilities == ["tools", "vision"]
    assert mini.context_window == 128000

    price = ModelPrice.objects.get(model=mini)
    assert price.input_per_mtok == Decimal("0.15")
    assert price.cached_input_per_mtok == Decimal("0.075")
    assert price.effective_to is None

    assert ModelPrice.objects.get(model__key="jev-decision").per_call == Decimal("0.002")
    assert Markup.objects.get(provider__isnull=True).multiplier == Decimal("1")


def test_does_nothing_once_the_catalog_has_a_provider(seed_file):
    AIProvider.objects.create(slug="anthropic", name="Anthropic", kind=AIProvider.Kind.LLM)

    assert seed_ai_catalog(seed_file) is False
    assert list(AIProvider.objects.values_list("slug", flat=True)) == ["anthropic"]
    assert Markup.objects.count() == 0


def test_a_deleted_provider_still_counts_as_booted(seed_file):
    AIProvider.objects.create(slug="anthropic", name="Anthropic", kind=AIProvider.Kind.LLM)
    AIProvider.objects.all().delete()

    assert seed_ai_catalog(seed_file) is False


def test_the_shipped_seed_loads():
    assert DEFAULT_SEED_PATH.exists()
    assert seed_ai_catalog() is True
    assert AIProvider.objects.filter(kind=AIProvider.Kind.LLM).exists()
    assert not AIProvider.objects.exclude(api_key_encrypted="").exists()
