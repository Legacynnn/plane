/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

export type TWikiPage = {
  id: string;
  name: string;
  isAgentAuthored?: boolean;
  children?: TWikiPage[];
};

export type TWikiCollection = {
  id: string;
  name: string;
  pages: TWikiPage[];
};
