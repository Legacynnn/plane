/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { initPromise } from "@plane/i18n";

beforeAll(async () => {
  await initPromise;
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});
