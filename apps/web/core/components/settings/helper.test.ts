/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { describe, expect, it } from "vitest";
import { PROFILE_SETTINGS, WORKSPACE_SETTINGS } from "@plane/constants";
import { getWorkspaceActivePath } from "./helper";

describe("getWorkspaceActivePath", () => {
  it("labels a workspace settings section", () => {
    expect(getWorkspaceActivePath("/acme/settings/connectors/")).toBe(WORKSPACE_SETTINGS.connectors.i18n_label);
  });

  it("labels a nested route by its section", () => {
    expect(getWorkspaceActivePath("/acme/settings/webhooks/9f1c/")).toBe(WORKSPACE_SETTINGS.webhooks.i18n_label);
  });

  it("labels an account tab", () => {
    expect(getWorkspaceActivePath("/acme/settings/account/preferences/")).toBe(PROFILE_SETTINGS.preferences.i18n_label);
  });

  it("labels the account root as the profile tab", () => {
    expect(getWorkspaceActivePath("/acme/settings/account/")).toBe(PROFILE_SETTINGS.general.i18n_label);
  });

  it("returns null outside settings", () => {
    expect(getWorkspaceActivePath("/acme/projects/")).toBeNull();
  });
});
