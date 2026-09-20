# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

import pytest

from plane.ai.errors import ModelUnavailable, NoModelAssigned
from plane.ai.features import DEFAULT_FEATURE, Feature
from plane.ai.resolver import resolve_model
from plane.db.models import AIModel, ModelAssignment, Workspace

pytestmark = [pytest.mark.unit, pytest.mark.django_db]


@pytest.fixture
def workspace(create_user):
    return Workspace.objects.create(name="Acme", slug="acme", owner=create_user)


def test_resolves_the_model_assigned_to_the_feature(model):
    ModelAssignment.objects.create(feature=Feature.EDITOR_ASSIST, model=model)

    assert resolve_model(Feature.EDITOR_ASSIST) == model


def test_falls_back_to_the_default_feature(model):
    ModelAssignment.objects.create(feature=DEFAULT_FEATURE, model=model)

    assert resolve_model(Feature.EDITOR_ASSIST) == model


def test_a_workspace_assignment_wins_over_the_instance_one(provider, model, workspace):
    theirs = AIModel.objects.create(provider=provider, key="gpt-4o", name="GPT-4o", status=AIModel.Status.ACTIVE)
    ModelAssignment.objects.create(feature=Feature.EDITOR_ASSIST, model=model)
    ModelAssignment.objects.create(
        feature=Feature.EDITOR_ASSIST, scope=ModelAssignment.Scope.WORKSPACE, workspace=workspace, model=theirs
    )

    assert resolve_model(Feature.EDITOR_ASSIST, workspace=workspace) == theirs


def test_falls_back_to_the_fallback_model_when_the_first_is_disabled(provider, model):
    spare = AIModel.objects.create(provider=provider, key="gpt-4o", name="GPT-4o", status=AIModel.Status.ACTIVE)
    model.status = AIModel.Status.DISABLED
    model.save()
    ModelAssignment.objects.create(feature=Feature.EDITOR_ASSIST, model=model, fallback_model=spare)

    assert resolve_model(Feature.EDITOR_ASSIST) == spare


def test_an_unassigned_feature_raises(model):
    with pytest.raises(NoModelAssigned):
        resolve_model(Feature.EDITOR_ASSIST)


def test_an_assignment_nothing_can_serve_raises(model):
    model.status = AIModel.Status.DEPRECATED
    model.save()
    ModelAssignment.objects.create(feature=Feature.EDITOR_ASSIST, model=model)

    with pytest.raises(ModelUnavailable):
        resolve_model(Feature.EDITOR_ASSIST)
