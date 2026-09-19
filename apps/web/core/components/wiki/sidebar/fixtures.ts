/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TWikiCollection } from "./types";

export const WIKI_COLLECTIONS: TWikiCollection[] = [
  {
    id: "handbook",
    name: "Handbook",
    pages: [
      { id: "onboarding", name: "Onboarding" },
      {
        id: "engineering",
        name: "Engineering",
        children: [
          { id: "review", name: "Code review" },
          { id: "oncall", name: "On-call rotation", isAgentAuthored: true },
        ],
      },
      { id: "brand", name: "Brand and voice" },
    ],
  },
  {
    id: "meetings",
    name: "Meetings",
    pages: [
      { id: "weekly", name: "Weekly sync notes", isAgentAuthored: true },
      { id: "retro", name: "Retro 2026-09-12", isAgentAuthored: true },
    ],
  },
  {
    id: "long",
    name: "Customer research and discovery interviews",
    pages: [{ id: "interviews", name: "Interview transcripts from the enterprise pilot cohort" }],
  },
];
