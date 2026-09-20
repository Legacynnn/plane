# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Module imports
from plane.db.models import ModelAssignment

from .errors import ModelUnavailable, NoModelAssigned
from .features import DEFAULT_FEATURE


def resolve_model(feature, workspace=None, agent_id=None):
    features = [feature] if feature == DEFAULT_FEATURE else [feature, DEFAULT_FEATURE]

    for candidate in features:
        assignment = ModelAssignment.resolve(candidate, workspace=workspace, agent_id=agent_id)
        if not assignment:
            continue
        model = assignment.pick()
        if not model:
            raise ModelUnavailable(f"Neither the model nor its fallback can serve {candidate}.")
        return model

    raise NoModelAssigned(f"No model is assigned to {feature}.")
