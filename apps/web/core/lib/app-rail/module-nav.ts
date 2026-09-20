/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TAppModule } from "./active-module";

export type TModuleNavItem = {
  key: string;
  path: string;
};

export const WIKI_NAV_ITEMS: TModuleNavItem[] = [
  { key: "pages", path: "" },
  { key: "sources", path: "sources" },
];

export const IA_NAV_ITEMS: TModuleNavItem[] = [
  { key: "threads", path: "threads" },
  { key: "agents", path: "agents" },
  { key: "runs", path: "runs" },
  { key: "review", path: "review" },
  { key: "memory", path: "memory" },
  { key: "usage", path: "usage" },
];

export const getModuleRootHref = (workspaceSlug: string, module: TAppModule): string =>
  module === "work" ? `/${workspaceSlug}` : `/${workspaceSlug}/${module}`;

export const getModuleNavHref = (workspaceSlug: string, module: TAppModule, path: string): string =>
  path ? `/${workspaceSlug}/${module}/${path}` : `/${workspaceSlug}/${module}`;

export const isModuleNavItemActive = (pathname: string, href: string): boolean => {
  const current = pathname.replace(/\/+$/, "");
  const isModuleRoot = href.split("/").filter(Boolean).length === 2;
  return isModuleRoot ? current === href : current === href || current.startsWith(`${href}/`);
};
