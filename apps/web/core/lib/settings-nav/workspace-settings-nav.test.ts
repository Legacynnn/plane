/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { describe, expect, it } from "vitest";
import { WORKSPACE_SETTINGS, WORKSPACE_SETTINGS_ACCESS } from "@plane/constants";
import { EUserWorkspaceRoles } from "@plane/types";
import {
  getAccessibleWorkspaceSettings,
  getWorkspaceSettingsHref,
  isWorkspaceSettingsItemActive,
} from "./workspace-settings-nav";

const forRole = (role: EUserWorkspaceRoles) => (access: EUserWorkspaceRoles[]) => access.includes(role);

describe("getWorkspaceSettingsHref", () => {
  it("prefixes the workspace slug", () => {
    expect(getWorkspaceSettingsHref("acme", "/settings/members")).toBe("/acme/settings/members");
  });

  it("builds the settings root", () => {
    expect(getWorkspaceSettingsHref("acme", "/settings")).toBe("/acme/settings");
  });
});

describe("isWorkspaceSettingsItemActive", () => {
  it("matches the settings root only exactly", () => {
    expect(isWorkspaceSettingsItemActive("/acme/settings/", "acme", "/settings")).toBe(true);
    expect(isWorkspaceSettingsItemActive("/acme/settings", "acme", "/settings")).toBe(true);
    expect(isWorkspaceSettingsItemActive("/acme/settings/members/", "acme", "/settings")).toBe(false);
  });

  it("matches a leaf and its children", () => {
    expect(isWorkspaceSettingsItemActive("/acme/settings/webhooks/", "acme", "/settings/webhooks")).toBe(true);
    expect(isWorkspaceSettingsItemActive("/acme/settings/webhooks/abc-123/", "acme", "/settings/webhooks")).toBe(true);
  });

  it("does not match a sibling that shares a prefix", () => {
    expect(isWorkspaceSettingsItemActive("/acme/settings/code-scopes/", "acme", "/settings/code")).toBe(false);
    expect(isWorkspaceSettingsItemActive("/acme/settings/preferences/", "acme", "/settings/pool")).toBe(false);
  });

  it("does not match another workspace", () => {
    expect(isWorkspaceSettingsItemActive("/globex/settings/members/", "acme", "/settings/members")).toBe(false);
  });
});

describe("getAccessibleWorkspaceSettings", () => {
  it("gives an admin every group in order", () => {
    const categories = getAccessibleWorkspaceSettings(forRole(EUserWorkspaceRoles.ADMIN));
    expect(categories.map((category) => category.key)).toEqual([
      "workspace",
      "connectors",
      "codebase",
      "ia",
      "developer",
    ]);
    expect(categories.flatMap((category) => category.items)).toHaveLength(Object.keys(WORKSPACE_SETTINGS).length);
  });

  it("hides the group heading for connectors only", () => {
    const categories = getAccessibleWorkspaceSettings(forRole(EUserWorkspaceRoles.ADMIN));
    expect(categories.filter((category) => !category.showLabel).map((category) => category.key)).toEqual([
      "connectors",
    ]);
  });

  it("leaves a member the workspace group without billing", () => {
    const categories = getAccessibleWorkspaceSettings(forRole(EUserWorkspaceRoles.MEMBER));
    expect(categories.map((category) => category.key)).toEqual(["workspace"]);
    expect(categories[0].items.map((item) => item.key)).toEqual(["general", "members", "export"]);
  });

  it("leaves a guest nothing", () => {
    expect(getAccessibleWorkspaceSettings(forRole(EUserWorkspaceRoles.GUEST))).toEqual([]);
  });
});

describe("access map", () => {
  it("covers every settings href", () => {
    Object.values(WORKSPACE_SETTINGS).forEach((item) => {
      expect(WORKSPACE_SETTINGS_ACCESS[item.href]).toEqual(item.access);
    });
  });
});
