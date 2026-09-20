/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { describe, expect, it } from "vitest";
import { getActiveModule } from "./active-module";

describe("getActiveModule", () => {
  it.each([
    ["/acme", "work"],
    ["/acme/", "work"],
    ["/acme/projects/9f1c/issues/", "work"],
    ["/acme/your-work/", "work"],
    ["/acme/profile/42/", "work"],
    ["/acme/wiki", "wiki"],
    ["/acme/wiki/pages/7/", "wiki"],
    ["/acme/ia/", "ia"],
    ["/acme/ia/runs/3", "ia"],
    ["/acme/settings", "settings"],
    ["/acme/settings/projects/9f1c/states/", "settings"],
  ])("maps %s to %s", (pathname, expected) => {
    expect(getActiveModule(pathname, "acme")).toBe(expected);
  });

  it("marks no module on the inbox, which lives in the top bar", () => {
    expect(getActiveModule("/acme/notifications/", "acme")).toBeNull();
  });

  it("matches whole path segments only", () => {
    expect(getActiveModule("/acme/wikis-archive/", "acme")).toBe("work");
    expect(getActiveModule("/acme/iaas/", "acme")).toBe("work");
  });

  it("marks no module outside the workspace", () => {
    expect(getActiveModule("/settings/profile/general/", "acme")).toBeNull();
    expect(getActiveModule("/other/wiki/", "acme")).toBeNull();
  });
});
