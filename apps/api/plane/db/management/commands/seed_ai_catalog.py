# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Django imports
from django.core.management.base import BaseCommand

# Module imports
from plane.ai.adoption import adopt_instance_llm_configuration
from plane.utils.ai_catalog_seed import seed_ai_catalog


class Command(BaseCommand):
    help = "Seed the AI catalog on first boot; does nothing once the catalog has a provider"

    def handle(self, *args, **options):
        if seed_ai_catalog():
            self.stdout.write(self.style.SUCCESS("AI catalog seeded"))
        else:
            self.stdout.write(self.style.WARNING("AI catalog already present, seed skipped"))

        if adopt_instance_llm_configuration():
            self.stdout.write(self.style.SUCCESS("Instance LLM configuration adopted into the catalog"))
