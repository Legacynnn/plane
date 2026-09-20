# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import pytest

from plane.db.models import AIModel, AIProvider


@pytest.fixture
def provider(db):
    provider = AIProvider.objects.create(slug="openai", name="OpenAI")
    provider.set_api_key("sk-test")
    provider.save()
    return provider


@pytest.fixture
def model(provider):
    return AIModel.objects.create(
        provider=provider, key="gpt-4o-mini", name="GPT-4o mini", status=AIModel.Status.ACTIVE
    )
