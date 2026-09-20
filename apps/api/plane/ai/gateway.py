# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Python imports
from contextlib import asynccontextmanager

# Third party imports
from asgiref.sync import sync_to_async
from django.utils import timezone
from pydantic_ai import Agent

# Module imports
from plane.db.models import ModelPrice
from plane.utils.exception_logger import log_exception

from .adapters import build_model
from .errors import GatewayError, ProviderCallFailed
from .resolver import resolve_model
from .signals import gateway_call_finished
from .types import GatewayCall, GatewayResult, GatewayUsage


def _prepare(request):
    model = resolve_model(request.feature, workspace=request.workspace, agent_id=request.agent_id)
    agent = Agent(
        build_model(model),
        instructions=request.instructions,
        output_type=request.output_type,
        tools=list(request.tools),
        model_settings=request.model_settings,
    )
    return agent, model


def _finish(request, model, started_at, usage, output, messages):
    call = GatewayCall(
        feature=request.feature,
        model=model,
        price=ModelPrice.effective_at(model, started_at),
        usage=GatewayUsage.from_run_usage(usage),
        started_at=started_at,
        finished_at=timezone.now(),
        workspace_id=request.workspace.id if request.workspace else None,
        agent_id=request.agent_id,
        user_id=request.user_id,
        metadata=request.metadata,
    )
    result = GatewayResult(output=output, call=call, messages=messages)
    gateway_call_finished.send(sender=GatewayResult, result=result)
    return result


def _wrap(error):
    if isinstance(error, GatewayError):
        return error
    log_exception(error)
    return ProviderCallFailed(str(error))


def run_sync(request):
    agent, model = _prepare(request)
    started_at = timezone.now()
    try:
        result = agent.run_sync(request.prompt, message_history=request.message_history)
    except Exception as error:
        raise _wrap(error) from error
    return _finish(request, model, started_at, result.usage, result.output, result.all_messages())


async def run(request):
    agent, model = await sync_to_async(_prepare)(request)
    started_at = timezone.now()
    try:
        result = await agent.run(request.prompt, message_history=request.message_history)
    except Exception as error:
        raise _wrap(error) from error
    return await sync_to_async(_finish)(request, model, started_at, result.usage, result.output, result.all_messages())


@asynccontextmanager
async def stream(request):
    agent, model = await sync_to_async(_prepare)(request)
    started_at = timezone.now()
    try:
        async with agent.run_stream(request.prompt, message_history=request.message_history) as streamed:
            yield streamed
    except Exception as error:
        raise _wrap(error) from error
    await sync_to_async(_finish)(request, model, started_at, streamed.usage, None, streamed.all_messages())
