/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type React from "react";
import type { LucideIcon } from "lucide-react";
import { KeyOutline, LockOutline, SettingsOutline, SubscribeOutline, UserOutline } from "@makeplane/propel/icons";
import type { ISvgIcons } from "@plane/propel/icons";
import type { TProfileSettingsTabs } from "@plane/types";

export const PROFILE_SETTINGS_ICONS: Record<TProfileSettingsTabs, LucideIcon | React.FC<ISvgIcons>> = {
  general: UserOutline,
  security: LockOutline,
  preferences: SettingsOutline,
  notifications: SubscribeOutline,
  "api-tokens": KeyOutline,
};
