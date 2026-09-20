/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { WORKSPACE_SETTINGS_CATEGORY } from "@plane/constants";
import { GROUPED_WORKSPACE_SETTINGS, WORKSPACE_SETTINGS_CATEGORIES } from "@plane/constants";
import type { EUserWorkspaceRoles, TWorkspaceSettingsItem } from "@plane/types";
import { joinUrlPath } from "@plane/utils";

export type TAccessibleWorkspaceSettingsCategory = {
  key: WORKSPACE_SETTINGS_CATEGORY;
  i18n_label: string;
  showLabel: boolean;
  items: TWorkspaceSettingsItem[];
};

const WORKSPACE_SETTINGS_ROOT_HREF = "/settings";

export const getWorkspaceSettingsHref = (workspaceSlug: string, href: string): string =>
  joinUrlPath(workspaceSlug, href);

export const isWorkspaceSettingsItemActive = (pathname: string, workspaceSlug: string, href: string): boolean => {
  const current = pathname.replace(/\/+$/, "");
  const itemHref = getWorkspaceSettingsHref(workspaceSlug, href);
  if (href === WORKSPACE_SETTINGS_ROOT_HREF) return current === itemHref;
  return current === itemHref || current.startsWith(`${itemHref}/`);
};

export const getAccessibleWorkspaceSettings = (
  hasAccess: (access: EUserWorkspaceRoles[]) => boolean
): TAccessibleWorkspaceSettingsCategory[] =>
  WORKSPACE_SETTINGS_CATEGORIES.map((category) => ({
    key: category.key,
    i18n_label: category.i18n_label,
    showLabel: category.showLabel,
    items: GROUPED_WORKSPACE_SETTINGS[category.key].filter((item) => hasAccess(item.access)),
  })).filter((category) => category.items.length > 0);
