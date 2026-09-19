/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { describe, expect, it } from "vitest";
import { IA_NAV_ITEMS, WIKI_NAV_ITEMS, getModuleNavHref, isModuleNavItemActive } from "./module-nav";

describe("module nav items", () => {
  it("lists the Wiki sections in order", () => {
    expect(WIKI_NAV_ITEMS.map((item) => item.key)).toEqual(["pages", "sources"]);
  });

  it("lists the IA sections in order", () => {
    expect(IA_NAV_ITEMS.map((item) => item.key)).toEqual(["threads", "agents", "runs", "review", "memory", "usage"]);
  });
});

describe("getModuleNavHref", () => {
  it("points a module root at the module itself", () => {
    expect(getModuleNavHref("acme", "wiki", "")).toBe("/acme/wiki");
  });

  it("appends the section path", () => {
    expect(getModuleNavHref("acme", "ia", "runs")).toBe("/acme/ia/runs");
  });
});

describe("isModuleNavItemActive", () => {
  it("matches the section itself", () => {
    expect(isModuleNavItemActive("/acme/ia/runs", "/acme/ia/runs")).toBe(true);
  });

  it("matches a child of the section", () => {
    expect(isModuleNavItemActive("/acme/ia/runs/123", "/acme/ia/runs")).toBe(true);
  });

  it("does not match a sibling that shares a prefix", () => {
    expect(isModuleNavItemActive("/acme/ia/runsheet", "/acme/ia/runs")).toBe(false);
  });

  it("matches a module root only exactly", () => {
    expect(isModuleNavItemActive("/acme/wiki", "/acme/wiki")).toBe(true);
    expect(isModuleNavItemActive("/acme/wiki/sources", "/acme/wiki")).toBe(false);
  });

  it("ignores a trailing slash", () => {
    expect(isModuleNavItemActive("/acme/wiki/", "/acme/wiki")).toBe(true);
  });
});
