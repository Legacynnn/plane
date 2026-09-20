# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import pytest
from pydantic_ai.messages import ModelResponse, TextPart
from pydantic_ai.models.function import FunctionModel
from rest_framework import status

from plane.ai import gateway
from plane.ai.features import DEFAULT_FEATURE
from plane.db.models import AIModel, AIProvider, ModelAssignment

URL = "/api/workspaces/{slug}/ai-assistant/"

pytestmark = [pytest.mark.contract, pytest.mark.django_db]


@pytest.fixture
def assigned(db):
    provider = AIProvider.objects.create(slug="openai", name="OpenAI")
    provider.set_api_key("sk-test")
    provider.save()
    model = AIModel.objects.create(
        provider=provider, key="gpt-4o-mini", name="GPT-4o mini", status=AIModel.Status.ACTIVE
    )
    ModelAssignment.objects.create(feature=DEFAULT_FEATURE, model=model)
    return model


@pytest.fixture
def answers(monkeypatch):
    def use(text):
        def fn(messages, info):
            return ModelResponse(parts=[TextPart(text)])

        monkeypatch.setattr(gateway, "build_model", lambda model: FunctionModel(fn))

    return use


def test_answers_through_the_gateway(session_client, workspace, assigned, answers):
    answers("First line\nSecond line")

    response = session_client.post(
        URL.format(slug=workspace.slug), {"task": "Make it formal", "prompt": "hey"}, format="json"
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["response"] == "First line\nSecond line"
    assert response.data["response_html"] == "First line<br/>Second line"


def test_a_missing_task_is_rejected(session_client, workspace, assigned, answers):
    answers("unused")

    response = session_client.post(URL.format(slug=workspace.slug), {"prompt": "hey"}, format="json")

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_an_instance_with_no_model_says_so(session_client, workspace, answers):
    answers("unused")

    response = session_client.post(
        URL.format(slug=workspace.slug), {"task": "Make it formal", "prompt": "hey"}, format="json"
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "LLM provider" in response.data["error"]
