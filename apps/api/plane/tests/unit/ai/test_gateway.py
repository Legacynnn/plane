# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

from decimal import Decimal

import pytest
from pydantic import BaseModel
from pydantic_ai.messages import ModelResponse, TextPart, ToolCallPart
from pydantic_ai.models.function import FunctionModel
from pydantic_ai.usage import RequestUsage

from plane.ai import gateway
from plane.ai.errors import NoModelAssigned, ProviderCallFailed
from plane.ai.features import DEFAULT_FEATURE, Feature
from plane.ai.signals import gateway_call_finished
from plane.ai.types import GatewayRequest
from plane.db.models import ModelAssignment, ModelPrice

pytestmark = [pytest.mark.unit, pytest.mark.django_db]


@pytest.fixture
def assigned(model):
    ModelAssignment.objects.create(feature=DEFAULT_FEATURE, model=model)
    return model


@pytest.fixture
def speaks(monkeypatch):
    def use(fn):
        monkeypatch.setattr(gateway, "build_model", lambda model: FunctionModel(fn))

    return use


def says(text, **usage):
    def fn(messages, info):
        return ModelResponse(parts=[TextPart(text)], usage=RequestUsage(**usage))

    return fn


def test_returns_what_the_model_said(assigned, speaks):
    speaks(says("Sharpened."))

    result = gateway.run_sync(GatewayRequest(prompt="Sharpen this", feature=Feature.EDITOR_ASSIST))

    assert result.output == "Sharpened."
    assert result.call.model == assigned


def test_reports_the_usage_the_provider_returned(assigned, speaks):
    speaks(says("ok", input_tokens=120, output_tokens=8, cache_read_tokens=100, details={"reasoning_tokens": 31}))

    usage = gateway.run_sync(GatewayRequest(prompt="Hi")).usage

    assert usage.input_tokens == 120
    assert usage.cached_input_tokens == 100
    assert usage.output_tokens == 8
    assert usage.reasoning_tokens == 31


def test_carries_the_price_in_force_at_the_call(assigned, speaks):
    speaks(says("ok"))
    price = ModelPrice.start(assigned, input_per_mtok=Decimal("0.15"), output_per_mtok=Decimal("0.60"))

    assert gateway.run_sync(GatewayRequest(prompt="Hi")).call.price == price


def test_tells_metering_the_call_finished(assigned, speaks):
    speaks(says("ok", input_tokens=5, output_tokens=2))
    seen = []
    gateway_call_finished.connect(lambda sender, result, **kwargs: seen.append(result), weak=False)

    try:
        gateway.run_sync(GatewayRequest(prompt="Hi", feature=Feature.EDITOR_ASSIST))
    finally:
        gateway_call_finished.receivers = []

    assert len(seen) == 1
    assert seen[0].call.feature == Feature.EDITOR_ASSIST
    assert seen[0].usage.input_tokens == 5


def test_returns_structured_output(assigned, speaks):
    class Verdict(BaseModel):
        ready: bool

    def fn(messages, info):
        return ModelResponse(parts=[ToolCallPart(info.output_tools[0].name, {"ready": True})])

    speaks(fn)

    result = gateway.run_sync(GatewayRequest(prompt="Is it ready?", output_type=Verdict))

    assert result.output == Verdict(ready=True)


def test_calls_a_tool_and_answers_with_its_result(assigned, speaks):
    def slug(name: str) -> str:
        return name.lower().replace(" ", "-")

    def fn(messages, info):
        if len(messages) == 1:
            return ModelResponse(parts=[ToolCallPart("slug", {"name": "Model Catalog"})])
        return ModelResponse(parts=[TextPart(messages[-1].parts[0].content)])

    speaks(fn)

    result = gateway.run_sync(GatewayRequest(prompt="Slug it", tools=[slug]))

    assert result.output == "model-catalog"


def test_an_unassigned_feature_never_reaches_a_provider(model, speaks):
    speaks(says("ok"))

    with pytest.raises(NoModelAssigned):
        gateway.run_sync(GatewayRequest(prompt="Hi"))


def test_a_provider_failure_is_wrapped(assigned, speaks):
    def fn(messages, info):
        raise RuntimeError("upstream is down")

    speaks(fn)

    with pytest.raises(ProviderCallFailed):
        gateway.run_sync(GatewayRequest(prompt="Hi"))
