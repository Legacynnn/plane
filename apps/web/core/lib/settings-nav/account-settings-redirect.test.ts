/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { describe, expect, it } from "vitest";
import { getAccountSettingsHref, getAccountSettingsTab } from "./account-settings-redirect";

describe("getAccountSettingsTab", () => {
  it("keeps a known tab", () => {
    expect(getAccountSettingsTab("api-tokens")).toBe("api-tokens");
    expect(getAccountSettingsTab("security")).toBe("security");
  });

  it("falls back to general for an empty or unknown tab", () => {
    expect(getAccountSettingsTab("")).toBe("general");
    expect(getAccountSettingsTab(undefined)).toBe("general");
    expect(getAccountSettingsTab("activity")).toBe("general");
  });

  it("ignores trailing slashes and deeper segments", () => {
    expect(getAccountSettingsTab("preferences/")).toBe("preferences");
    expect(getAccountSettingsTab("notifications/email")).toBe("notifications");
  });
});

describe("getAccountSettingsHref", () => {
  it("builds the workspace account href", () => {
    expect(getAccountSettingsHref("acme", "security")).toBe("/acme/settings/account/security");
  });

  it("sends the user home when no workspace is known", () => {
    expect(getAccountSettingsHref(undefined, "security")).toBe("/");
  });
});
