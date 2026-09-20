# Copyright (c) 2023-present Plane Software, Inc. and contributors
# SPDX-License-Identifier: AGPL-3.0-only
# See the LICENSE file for details.

# Python imports
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Sequence
from uuid import UUID

# Module imports
from .features import DEFAULT_FEATURE


@dataclass(frozen=True)
class GatewayUsage:
    requests: int = 0
    input_tokens: int = 0
    cached_input_tokens: int = 0
    cache_write_tokens: int = 0
    output_tokens: int = 0
    reasoning_tokens: int = 0
    tool_calls: int = 0

    @classmethod
    def from_run_usage(cls, usage):
        details = getattr(usage, "details", None) or {}
        return cls(
            requests=getattr(usage, "requests", 0) or 0,
            input_tokens=getattr(usage, "input_tokens", 0) or 0,
            cached_input_tokens=getattr(usage, "cache_read_tokens", 0) or 0,
            cache_write_tokens=getattr(usage, "cache_write_tokens", 0) or 0,
            output_tokens=getattr(usage, "output_tokens", 0) or 0,
            reasoning_tokens=details.get("reasoning_tokens", 0) or 0,
            tool_calls=getattr(usage, "tool_calls", 0) or 0,
        )


@dataclass(frozen=True)
class GatewayRequest:
    prompt: str
    feature: str = DEFAULT_FEATURE
    instructions: str | None = None
    output_type: Any = str
    tools: Sequence[Any] = ()
    message_history: list[Any] | None = None
    model_settings: dict[str, Any] | None = None
    workspace: Any = None
    agent_id: UUID | None = None
    user_id: UUID | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class GatewayCall:
    feature: str
    model: Any
    price: Any
    usage: GatewayUsage
    started_at: datetime
    finished_at: datetime
    workspace_id: UUID | None = None
    agent_id: UUID | None = None
    user_id: UUID | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    @property
    def provider(self):
        return self.model.provider


@dataclass(frozen=True)
class GatewayResult:
    output: Any
    call: GatewayCall
    messages: list[Any] = field(default_factory=list)

    @property
    def usage(self):
        return self.call.usage
