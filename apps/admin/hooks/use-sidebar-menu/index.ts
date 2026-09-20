/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// local imports
import { coreSidebarMenuLinks } from "./core";
import type { TSidebarMenuGroup } from "./types";

export function useSidebarMenu(): TSidebarMenuGroup[] {
  return [
    {
      key: "instance",
      name: "Instance",
      items: [
        coreSidebarMenuLinks.general,
        coreSidebarMenuLinks.email,
        coreSidebarMenuLinks.authentication,
        coreSidebarMenuLinks.workspace,
        coreSidebarMenuLinks.image,
      ],
    },
    {
      key: "ai",
      name: "AI",
      items: [
        coreSidebarMenuLinks.providers,
        coreSidebarMenuLinks["model-catalog"],
        coreSidebarMenuLinks.pricing,
        coreSidebarMenuLinks.usage,
        coreSidebarMenuLinks.evals,
        coreSidebarMenuLinks["feature-flags"],
      ],
    },
  ];
}
