# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import pytest
from pydantic_ai.models.anthropic import AnthropicModel
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.models.openrouter import OpenRouterModel

from plane.ai.adapters import build_model
from plane.ai.errors import ProviderNotConfigured
from plane.db.models import AIModel, AIProvider

pytestmark = [pytest.mark.unit, pytest.mark.django_db]


def make(slug, key, base_url="", api_key="sk-test"):
    provider = AIProvider.objects.create(slug=slug, name=slug, base_url=base_url)
    if api_key:
        provider.set_api_key(api_key)
        provider.save()
    return AIModel.objects.create(provider=provider, key=key, name=key, status=AIModel.Status.ACTIVE)


@pytest.mark.parametrize(
    "slug,key,expected",
    [
        ("openai", "gpt-4o-mini", OpenAIChatModel),
        ("anthropic", "claude-sonnet-4-5", AnthropicModel),
        ("gemini", "gemini-2.5-flash", GoogleModel),
        ("google", "gemini-2.5-flash", GoogleModel),
        ("openrouter", "openai/gpt-4o-mini", OpenRouterModel),
    ],
)
def test_builds_the_model_for_each_provider(slug, key, expected):
    built = build_model(make(slug, key))

    assert isinstance(built, expected)
    assert built.model_name == key


def test_an_unlisted_provider_with_a_base_url_speaks_the_openai_format():
    built = build_model(make("groq", "llama-3.3-70b", base_url="https://api.groq.com/openai/v1"))

    assert isinstance(built, OpenAIChatModel)


def test_a_provider_without_a_key_is_not_callable():
    with pytest.raises(ProviderNotConfigured):
        build_model(make("openai", "gpt-4o-mini", api_key=""))


def test_an_unlisted_provider_without_a_base_url_is_not_callable():
    with pytest.raises(ProviderNotConfigured):
        build_model(make("jev", "jev-latest"))
