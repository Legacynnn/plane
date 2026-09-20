/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { ComponentType } from "react";
import { SettingsOutline } from "@makeplane/propel/icons";
import { PiChatLogo, PlaneNewIcon, WikiIcon } from "@plane/propel/icons";
import type { TAppModule } from "@/lib/app-rail";

export const MODULE_ICONS: Record<TAppModule, ComponentType<{ className?: string }>> = {
  work: PlaneNewIcon,
  wiki: WikiIcon,
  ia: PiChatLogo,
  settings: SettingsOutline,
};
