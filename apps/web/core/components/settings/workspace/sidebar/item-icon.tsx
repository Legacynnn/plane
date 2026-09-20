/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { LucideIcon } from "lucide-react";
import {
  AgentOutline,
  BillingsOutline,
  BuildingOutline,
  CodeOutline,
  ConnectionsOutline,
  ExportOutline,
  KeyOutline,
  MembersOutline,
  PreferencesOutline,
  ScopeOutline,
  ServerOutline,
  UsageOutline,
  WebhooksOutline,
} from "@makeplane/propel/icons";
// plane imports
import type { ISvgIcons } from "@plane/propel/icons";
import type { TWorkspaceSettingsTabs } from "@plane/types";

export const WORKSPACE_SETTINGS_ICONS: Record<TWorkspaceSettingsTabs, LucideIcon | React.FC<ISvgIcons>> = {
  general: BuildingOutline,
  members: MembersOutline,
  export: ExportOutline,
  "billing-and-plans": BillingsOutline,
  connectors: ConnectionsOutline,
  repositories: CodeOutline,
  "code-scopes": ScopeOutline,
  "agent-defaults": AgentOutline,
  "workspace-preferences": PreferencesOutline,
  "workspace-pool": UsageOutline,
  "api-tokens": KeyOutline,
  webhooks: WebhooksOutline,
  "mcp-access": ServerOutline,
};
