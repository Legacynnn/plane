/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

export type TAppModule = "work" | "wiki" | "ia" | "settings";

const SEGMENT_MODULES = new Set<TAppModule>(["wiki", "ia", "settings"]);

const UNOWNED_SEGMENTS = new Set(["notifications"]);

export const getActiveModule = (pathname: string, workspaceSlug: string): TAppModule | null => {
  const [slug, segment] = pathname.split("/").filter(Boolean);
  if (slug !== workspaceSlug) return null;
  if (!segment) return "work";
  if (UNOWNED_SEGMENTS.has(segment)) return null;
  return SEGMENT_MODULES.has(segment as TAppModule) ? (segment as TAppModule) : "work";
};
