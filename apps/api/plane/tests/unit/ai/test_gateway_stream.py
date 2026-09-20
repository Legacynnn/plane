# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import pytest
from pydantic_ai.models.function import FunctionModel

from plane.ai import gateway
from plane.ai.features import DEFAULT_FEATURE
from plane.ai.signals import gateway_call_finished
from plane.ai.types import GatewayRequest
from plane.db.models import AIModel, AIProvider, ModelAssignment

pytestmark = [pytest.mark.unit, pytest.mark.django_db(transaction=True), pytest.mark.asyncio]


def assign():
    provider = AIProvider.objects.create(slug="openai", name="OpenAI")
    provider.set_api_key("sk-test")
    provider.save()
    model = AIModel.objects.create(
        provider=provider, key="gpt-4o-mini", name="GPT-4o mini", status=AIModel.Status.ACTIVE
    )
    ModelAssignment.objects.create(feature=DEFAULT_FEATURE, model=model)
    return model


async def test_streams_the_text_as_it_arrives_then_reports_usage(monkeypatch):
    from asgiref.sync import sync_to_async

    await sync_to_async(assign)()

    async def stream_fn(messages, info):
        for chunk in ("one ", "two ", "three"):
            yield chunk

    monkeypatch.setattr(gateway, "build_model", lambda model: FunctionModel(stream_function=stream_fn))

    seen = []
    gateway_call_finished.connect(lambda sender, result, **kwargs: seen.append(result), weak=False)

    chunks = []
    try:
        async with gateway.stream(GatewayRequest(prompt="Count")) as streamed:
            async for chunk in streamed.stream_text(delta=True):
                chunks.append(chunk)
    finally:
        gateway_call_finished.receivers = []

    assert "".join(chunks) == "one two three"
    assert seen[0].call.model.key == "gpt-4o-mini"
    assert seen[0].usage.requests >= 1
