# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Python imports
from decimal import Decimal
from pathlib import Path

# Third party imports
import yaml

# Django imports
from django.db import transaction

# Module imports
from plane.db.models import AIModel, AIProvider, Markup, ModelPrice

DEFAULT_SEED_PATH = Path(__file__).resolve().parent.parent / "seeds" / "data" / "ai_catalog.yaml"


def seed_ai_catalog(path=None):
    if AIProvider.all_objects.exists():
        return False

    seed = yaml.safe_load(Path(path or DEFAULT_SEED_PATH).read_text()) or {}

    with transaction.atomic():
        if "markup" in seed:
            Markup.objects.create(multiplier=Decimal(str(seed["markup"])))

        for provider_seed in seed.get("providers", []):
            models = provider_seed.pop("models", [])
            provider = AIProvider.objects.create(**provider_seed)

            for model_seed in models:
                price = model_seed.pop("price", None)
                model = AIModel.objects.create(provider=provider, **model_seed)
                if price:
                    ModelPrice.start(model, **{field: Decimal(str(value)) for field, value in price.items()})

    return True
