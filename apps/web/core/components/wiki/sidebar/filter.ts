/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { TWikiCollection, TWikiPage } from "./types";

const filterPages = (pages: TWikiPage[]): TWikiPage[] =>
  pages.reduce<TWikiPage[]>((kept, page) => {
    const children = filterPages(page.children ?? []);
    if (page.isAgentAuthored || children.length > 0) kept.push({ ...page, children });
    return kept;
  }, []);

export const filterAgentAuthored = (collections: TWikiCollection[]): TWikiCollection[] =>
  collections
    .map((collection) => ({ ...collection, pages: filterPages(collection.pages) }))
    .filter((collection) => collection.pages.length > 0);
