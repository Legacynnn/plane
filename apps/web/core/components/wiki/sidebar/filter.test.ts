/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { describe, expect, it } from "vitest";
import { filterAgentAuthored } from "./filter";
import type { TWikiCollection } from "./types";

const collections: TWikiCollection[] = [
  {
    id: "handbook",
    name: "Handbook",
    pages: [
      { id: "onboarding", name: "Onboarding" },
      {
        id: "releases",
        name: "Releases",
        children: [{ id: "q3", name: "Q3 summary", isAgentAuthored: true }],
      },
    ],
  },
  {
    id: "meetings",
    name: "Meetings",
    pages: [{ id: "standup", name: "Standup notes" }],
  },
];

describe("filterAgentAuthored", () => {
  it("keeps a page written by an agent", () => {
    const [handbook] = filterAgentAuthored(collections);
    expect(handbook.pages.map((page) => page.id)).toEqual(["releases"]);
  });

  it("keeps a human page that holds an agent-authored child", () => {
    const [handbook] = filterAgentAuthored(collections);
    expect(handbook.pages[0].children?.map((page) => page.id)).toEqual(["q3"]);
  });

  it("drops a collection with nothing agent-authored", () => {
    expect(filterAgentAuthored(collections).map((collection) => collection.id)).toEqual(["handbook"]);
  });

  it("returns nothing when no page is agent-authored", () => {
    expect(filterAgentAuthored([{ id: "a", name: "A", pages: [{ id: "p", name: "P" }] }])).toEqual([]);
  });
});
