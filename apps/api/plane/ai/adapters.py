# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Third party imports
from pydantic_ai.models.anthropic import AnthropicModel
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.models.openrouter import OpenRouterModel
from pydantic_ai.providers.anthropic import AnthropicProvider
from pydantic_ai.providers.google import GoogleProvider
from pydantic_ai.providers.openai import OpenAIProvider
from pydantic_ai.providers.openrouter import OpenRouterProvider

# Module imports
from .errors import ProviderNotConfigured


def _openai(provider, model_key):
    settings = {"api_key": provider.api_key}
    if provider.base_url:
        settings["base_url"] = provider.base_url
    return OpenAIChatModel(model_key, provider=OpenAIProvider(**settings))


def _anthropic(provider, model_key):
    return AnthropicModel(model_key, provider=AnthropicProvider(api_key=provider.api_key))


def _google(provider, model_key):
    return GoogleModel(model_key, provider=GoogleProvider(api_key=provider.api_key))


def _openrouter(provider, model_key):
    return OpenRouterModel(model_key, provider=OpenRouterProvider(api_key=provider.api_key))


ADAPTERS = {
    "openai": _openai,
    "anthropic": _anthropic,
    "gemini": _google,
    "google": _google,
    "openrouter": _openrouter,
}


def build_model(model):
    provider = model.provider

    if not provider.has_api_key:
        raise ProviderNotConfigured(f"{provider.slug} has no API key.")

    adapter = ADAPTERS.get(provider.slug)
    if adapter:
        return adapter(provider, model.key)

    # An unlisted provider is reachable only when it speaks the OpenAI wire format at a known address.
    if provider.base_url:
        return _openai(provider, model.key)

    raise ProviderNotConfigured(f"{provider.slug} has no adapter and no base URL.")
