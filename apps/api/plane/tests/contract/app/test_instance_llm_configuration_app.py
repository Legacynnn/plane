# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import pytest
from django.utils import timezone
from rest_framework import status

from plane.ai.features import DEFAULT_FEATURE
from plane.db.models import AIProvider, ModelAssignment
from plane.license.models import Instance, InstanceAdmin, InstanceConfiguration

URL = "/api/instances/configurations/"


@pytest.fixture
def admin_client(session_client, create_user, settings):
    settings.SKIP_ENV_VAR = True
    instance = Instance.objects.create(
        instance_name="Test", instance_id="test-instance", current_version="0", last_checked_at=timezone.now()
    )
    InstanceAdmin.objects.create(instance=instance, user=create_user, role=20)
    for key in ("LLM_API_KEY", "LLM_PROVIDER", "LLM_MODEL", "EMAIL_HOST"):
        InstanceConfiguration.objects.create(key=key, value="", category="AI", is_encrypted=key == "LLM_API_KEY")
    return session_client


@pytest.mark.contract
@pytest.mark.django_db
class TestInstanceLLMConfiguration:
    def test_a_saved_key_reaches_the_provider_at_once(self, admin_client):
        provider = AIProvider.objects.create(slug="openai", name="OpenAI")

        response = admin_client.patch(
            URL, {"LLM_API_KEY": "sk-saved", "LLM_PROVIDER": "openai", "LLM_MODEL": "gpt-4o-mini"}, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        provider.refresh_from_db()
        assert provider.api_key == "sk-saved"
        assert ModelAssignment.objects.get(feature=DEFAULT_FEATURE).model.key == "gpt-4o-mini"

    def test_a_rotated_key_replaces_the_old_one(self, admin_client):
        provider = AIProvider.objects.create(slug="openai", name="OpenAI")
        admin_client.patch(
            URL, {"LLM_API_KEY": "sk-first", "LLM_PROVIDER": "openai", "LLM_MODEL": "gpt-4o-mini"}, format="json"
        )

        admin_client.patch(URL, {"LLM_API_KEY": "sk-second"}, format="json")

        provider.refresh_from_db()
        assert provider.api_key == "sk-second"

    def test_other_settings_leave_the_catalog_alone(self, admin_client):
        provider = AIProvider.objects.create(slug="openai", name="OpenAI")

        response = admin_client.patch(URL, {"EMAIL_HOST": "smtp.example.com"}, format="json")

        assert response.status_code == status.HTTP_200_OK
        provider.refresh_from_db()
        assert provider.has_api_key is False
