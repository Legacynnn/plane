# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Python import
import os

# Third party import
import requests

from rest_framework import status
from rest_framework.response import Response

# Module import
from plane.ai import Feature, GatewayError, GatewayRequest, ProviderCallFailed, run_sync
from plane.app.permissions import ROLE, allow_permission
from plane.app.serializers import ProjectLiteSerializer, WorkspaceLiteSerializer
from plane.db.models import Project, Workspace
from plane.license.utils.instance_value import get_configuration_value

from ..base import BaseAPIView


def no_model():
    return Response({"error": "LLM provider API key and model are required"}, status=status.HTTP_400_BAD_REQUEST)


def no_task():
    return Response({"error": "Task is required"}, status=status.HTTP_400_BAD_REQUEST)


def call_failed():
    return Response({"error": "An internal error has occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def assist(request, workspace):
    task = request.data.get("task", False)
    if not task:
        return None, no_task()

    text = request.data.get("prompt") or ""
    try:
        result = run_sync(
            GatewayRequest(
                prompt=text or task,
                instructions=task if text else None,
                feature=Feature.EDITOR_ASSIST,
                workspace=workspace,
                user_id=request.user.id,
            )
        )
    except ProviderCallFailed:
        return None, call_failed()
    except GatewayError:
        return None, no_model()

    return result.output, None


class GPTIntegrationEndpoint(BaseAPIView):
    @allow_permission([ROLE.ADMIN, ROLE.MEMBER])
    def post(self, request, slug, project_id):
        workspace = Workspace.objects.get(slug=slug)
        text, error = assist(request, workspace)
        if error:
            return error

        project = Project.objects.get(pk=project_id)

        return Response(
            {
                "response": text,
                "response_html": text.replace("\n", "<br/>"),
                "project_detail": ProjectLiteSerializer(project).data,
                "workspace_detail": WorkspaceLiteSerializer(workspace).data,
            },
            status=status.HTTP_200_OK,
        )


class WorkspaceGPTIntegrationEndpoint(BaseAPIView):
    @allow_permission(allowed_roles=[ROLE.ADMIN, ROLE.MEMBER], level="WORKSPACE")
    def post(self, request, slug):
        text, error = assist(request, Workspace.objects.get(slug=slug))
        if error:
            return error

        return Response(
            {"response": text, "response_html": text.replace("\n", "<br/>")},
            status=status.HTTP_200_OK,
        )


class UnsplashEndpoint(BaseAPIView):
    def get(self, request):
        (UNSPLASH_ACCESS_KEY,) = get_configuration_value(
            [
                {
                    "key": "UNSPLASH_ACCESS_KEY",
                    "default": os.environ.get("UNSPLASH_ACCESS_KEY"),
                }
            ]
        )
        # Check unsplash access key
        if not UNSPLASH_ACCESS_KEY:
            return Response([], status=status.HTTP_200_OK)

        # Query parameters
        query = request.GET.get("query", False)
        page = request.GET.get("page", 1)
        per_page = request.GET.get("per_page", 20)

        url = (
            f"https://api.unsplash.com/search/photos/?client_id={UNSPLASH_ACCESS_KEY}&query={query}&page=${page}&per_page={per_page}"
            if query
            else f"https://api.unsplash.com/photos/?client_id={UNSPLASH_ACCESS_KEY}&page={page}&per_page={per_page}"
        )

        headers = {"Content-Type": "application/json"}

        resp = requests.get(url=url, headers=headers)
        return Response(resp.json(), status=resp.status_code)
