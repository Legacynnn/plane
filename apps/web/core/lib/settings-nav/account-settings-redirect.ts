/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { ACCOUNT_SETTINGS_ROOT_HREF, PROFILE_SETTINGS_TABS } from "@plane/constants";
import type { TProfileSettingsTabs } from "@plane/types";

const DEFAULT_ACCOUNT_SETTINGS_TAB: TProfileSettingsTabs = "general";

export const getAccountSettingsTab = (splat: string | undefined): TProfileSettingsTabs => {
  const candidate = (splat ?? "").split("/").find(Boolean);
  return PROFILE_SETTINGS_TABS.includes(candidate as TProfileSettingsTabs)
    ? (candidate as TProfileSettingsTabs)
    : DEFAULT_ACCOUNT_SETTINGS_TAB;
};

export const getAccountSettingsHref = (workspaceSlug: string | undefined, tab: TProfileSettingsTabs): string =>
  workspaceSlug ? `/${workspaceSlug}${ACCOUNT_SETTINGS_ROOT_HREF}/${tab}` : "/";
