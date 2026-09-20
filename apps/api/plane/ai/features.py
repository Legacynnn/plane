# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Django imports
from django.db import models

DEFAULT_FEATURE = "default"


class Feature(models.TextChoices):
    DEFAULT = DEFAULT_FEATURE, "Default"
    EDITOR_ASSIST = "editor_assist", "Editor assist"
