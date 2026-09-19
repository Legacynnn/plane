/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AppRailVisibilityProvider } from "@/lib/app-rail";
import { AppRailRoot } from "./app-rail-root";

const renderRail = (pathname: string) =>
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route
          path=":workspaceSlug/*"
          element={
            <AppRailVisibilityProvider isEnabled>
              <AppRailRoot />
            </AppRailVisibilityProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );

const railLinks = () => within(screen.getByRole("navigation", { name: "Modules" })).getAllByRole("link");

describe("AppRailRoot", () => {
  it("lists Work, Wiki, IA, then Settings after a divider", () => {
    renderRail("/acme/");

    expect(railLinks().map((link) => link.textContent)).toEqual(["Work", "Wiki", "IA", "Settings"]);
    expect(railLinks().map((link) => link.getAttribute("href"))).toEqual([
      "/acme/",
      "/acme/wiki/",
      "/acme/ia/",
      "/acme/settings/",
    ]);
    const nav = screen.getByRole("navigation", { name: "Modules" });
    const separator = within(nav).getByRole("separator");
    expect(separator.compareDocumentPosition(screen.getByRole("link", { name: "IA" }))).toBe(
      Node.DOCUMENT_POSITION_PRECEDING
    );
    expect(separator.compareDocumentPosition(screen.getByRole("link", { name: "Settings" }))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it.each([
    ["/acme/projects/9f1c/issues/", "Work"],
    ["/acme/wiki/", "Wiki"],
    ["/acme/ia/runs/", "IA"],
    ["/acme/settings/members/", "Settings"],
  ])("marks the module owning %s as current", (pathname, current) => {
    renderRail(pathname);

    const currentLinks = railLinks().filter((link) => link.getAttribute("aria-current") === "page");
    expect(currentLinks.map((link) => link.textContent)).toEqual([current]);
  });

  it("marks no module as current on the inbox", () => {
    renderRail("/acme/notifications/");

    expect(railLinks().some((link) => link.hasAttribute("aria-current"))).toBe(false);
  });

  it("keeps every item named when the rail shows icons only", () => {
    localStorage.setItem("app_rail_preferences", JSON.stringify({ displayMode: "icon_only" }));
    renderRail("/acme/");

    expect(railLinks().map((link) => link.textContent)).toEqual(["", "", "", ""]);
    expect(railLinks().map((link) => link.getAttribute("aria-label"))).toEqual(["Work", "Wiki", "IA", "Settings"]);
  });
});
