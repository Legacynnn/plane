/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// plane imports
import type { TWorkspaceSettingsItem, TWorkspaceSettingsTabs } from "@plane/types";
import { EUserWorkspaceRoles } from "@plane/types";
import { ACCOUNT_SETTINGS_ROOT_HREF } from "./profile";

export enum WORKSPACE_SETTINGS_CATEGORY {
  WORKSPACE = "workspace",
  CONNECTORS = "connectors",
  CODEBASE = "codebase",
  IA = "ia",
  DEVELOPER = "developer",
}

export type TWorkspaceSettingsCategory = {
  key: WORKSPACE_SETTINGS_CATEGORY;
  i18n_label: string;
  showLabel: boolean;
};

export const WORKSPACE_SETTINGS_CATEGORIES: TWorkspaceSettingsCategory[] = [
  { key: WORKSPACE_SETTINGS_CATEGORY.WORKSPACE, i18n_label: "common.workspace", showLabel: true },
  { key: WORKSPACE_SETTINGS_CATEGORY.CONNECTORS, i18n_label: "common.connectors", showLabel: false },
  { key: WORKSPACE_SETTINGS_CATEGORY.CODEBASE, i18n_label: "common.codebase", showLabel: true },
  { key: WORKSPACE_SETTINGS_CATEGORY.IA, i18n_label: "common.ia", showLabel: true },
  { key: WORKSPACE_SETTINGS_CATEGORY.DEVELOPER, i18n_label: "common.developer", showLabel: true },
];

const ADMIN_ONLY = [EUserWorkspaceRoles.ADMIN];
const ADMIN_AND_MEMBER = [EUserWorkspaceRoles.ADMIN, EUserWorkspaceRoles.MEMBER];

export const WORKSPACE_SETTINGS: Record<TWorkspaceSettingsTabs, TWorkspaceSettingsItem> = {
  general: {
    key: "general",
    i18n_label: "workspace_settings.settings.general.title",
    href: `/settings`,
    access: ADMIN_AND_MEMBER,
  },
  members: {
    key: "members",
    i18n_label: "workspace_settings.settings.members.title",
    href: `/settings/members`,
    access: ADMIN_AND_MEMBER,
  },
  "billing-and-plans": {
    key: "billing-and-plans",
    i18n_label: "workspace_settings.settings.billing_and_plans.title",
    href: `/settings/billing`,
    access: ADMIN_ONLY,
  },
  export: {
    key: "export",
    i18n_label: "workspace_settings.settings.exports.title",
    href: `/settings/exports`,
    access: ADMIN_AND_MEMBER,
  },
  connectors: {
    key: "connectors",
    i18n_label: "workspace_settings.settings.connectors.title",
    href: `/settings/connectors`,
    access: ADMIN_ONLY,
  },
  repositories: {
    key: "repositories",
    i18n_label: "workspace_settings.settings.repositories.title",
    href: `/settings/repositories`,
    access: ADMIN_ONLY,
  },
  "code-scopes": {
    key: "code-scopes",
    i18n_label: "workspace_settings.settings.code_scopes.title",
    href: `/settings/code-scopes`,
    access: ADMIN_ONLY,
  },
  "agent-defaults": {
    key: "agent-defaults",
    i18n_label: "workspace_settings.settings.agent_defaults.title",
    href: `/settings/agent-defaults`,
    access: ADMIN_ONLY,
  },
  "workspace-preferences": {
    key: "workspace-preferences",
    i18n_label: "workspace_settings.settings.workspace_preferences.title",
    href: `/settings/preferences`,
    access: ADMIN_ONLY,
  },
  "workspace-pool": {
    key: "workspace-pool",
    i18n_label: "workspace_settings.settings.workspace_pool.title",
    href: `/settings/pool`,
    access: ADMIN_ONLY,
  },
  "api-tokens": {
    key: "api-tokens",
    i18n_label: "workspace_settings.settings.workspace_api_tokens.title",
    href: `/settings/api-tokens`,
    access: ADMIN_ONLY,
  },
  webhooks: {
    key: "webhooks",
    i18n_label: "workspace_settings.settings.webhooks.title",
    href: `/settings/webhooks`,
    access: ADMIN_ONLY,
  },
  "mcp-access": {
    key: "mcp-access",
    i18n_label: "workspace_settings.settings.mcp_access.title",
    href: `/settings/mcp`,
    access: ADMIN_ONLY,
  },
};

export const WORKSPACE_SETTINGS_ACCESS: Record<string, EUserWorkspaceRoles[]> = {
  ...Object.fromEntries(Object.entries(WORKSPACE_SETTINGS).map(([_, { href, access }]) => [href, access])),
  [ACCOUNT_SETTINGS_ROOT_HREF]: [EUserWorkspaceRoles.ADMIN, EUserWorkspaceRoles.MEMBER, EUserWorkspaceRoles.GUEST],
};

export const GROUPED_WORKSPACE_SETTINGS: Record<WORKSPACE_SETTINGS_CATEGORY, TWorkspaceSettingsItem[]> = {
  [WORKSPACE_SETTINGS_CATEGORY.WORKSPACE]: [
    WORKSPACE_SETTINGS["general"],
    WORKSPACE_SETTINGS["members"],
    WORKSPACE_SETTINGS["billing-and-plans"],
    WORKSPACE_SETTINGS["export"],
  ],
  [WORKSPACE_SETTINGS_CATEGORY.CONNECTORS]: [WORKSPACE_SETTINGS["connectors"]],
  [WORKSPACE_SETTINGS_CATEGORY.CODEBASE]: [WORKSPACE_SETTINGS["repositories"], WORKSPACE_SETTINGS["code-scopes"]],
  [WORKSPACE_SETTINGS_CATEGORY.IA]: [
    WORKSPACE_SETTINGS["agent-defaults"],
    WORKSPACE_SETTINGS["workspace-preferences"],
    WORKSPACE_SETTINGS["workspace-pool"],
  ],
  [WORKSPACE_SETTINGS_CATEGORY.DEVELOPER]: [
    WORKSPACE_SETTINGS["api-tokens"],
    WORKSPACE_SETTINGS["webhooks"],
    WORKSPACE_SETTINGS["mcp-access"],
  ],
};
