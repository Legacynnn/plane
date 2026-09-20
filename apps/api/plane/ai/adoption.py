# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Python imports
import os

# Django imports
from django.db import transaction

# Module imports
from plane.db.models import AIModel, AIProvider, ModelAssignment
from plane.license.utils.instance_value import get_configuration_value

from .features import DEFAULT_FEATURE

PROVIDER_ALIASES = {"google": "gemini"}
LLM_CONFIGURATION_KEYS = {"LLM_API_KEY", "LLM_PROVIDER", "LLM_MODEL"}


def adopt_instance_llm_configuration(overwrite=False):
    api_key, provider_slug, model_key = get_configuration_value(
        [
            {"key": "LLM_API_KEY", "default": os.environ.get("LLM_API_KEY", "")},
            {"key": "LLM_PROVIDER", "default": os.environ.get("LLM_PROVIDER", "openai")},
            {"key": "LLM_MODEL", "default": os.environ.get("LLM_MODEL", "")},
        ]
    )

    if not api_key or not model_key:
        return False

    slug = PROVIDER_ALIASES.get((provider_slug or "").lower(), (provider_slug or "").lower())
    provider = AIProvider.objects.filter(slug=slug).first()
    if not provider:
        return False

    adopted = False
    with transaction.atomic():
        if not provider.has_api_key or (overwrite and provider.api_key != api_key):
            provider.set_api_key(api_key)
            provider.save(update_fields=["api_key_encrypted", "updated_at"])
            adopted = True

        model, created = AIModel.objects.get_or_create(
            provider=provider, key=model_key, defaults={"name": model_key, "status": AIModel.Status.ACTIVE}
        )
        adopted = adopted or created

        if model.status != AIModel.Status.ACTIVE:
            model.status = AIModel.Status.ACTIVE
            model.save(update_fields=["status", "updated_at"])
            adopted = True

        assignment, assigned = ModelAssignment.objects.get_or_create(
            feature=DEFAULT_FEATURE, scope=ModelAssignment.Scope.INSTANCE, defaults={"model": model}
        )
        adopted = adopted or assigned

        if overwrite and assignment.model_id != model.id:
            assignment.model = model
            assignment.save(update_fields=["model", "updated_at"])
            adopted = True

    return adopted
