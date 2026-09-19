/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import path from "node:path";

export const nextCompatAliases = (appRoot: string) => ({
  "next/link": path.resolve(appRoot, "app/compat/next/link.tsx"),
  "next/navigation": path.resolve(appRoot, "app/compat/next/navigation.ts"),
  "next/script": path.resolve(appRoot, "app/compat/next/script.tsx"),
});

export const compatDedupe = ["react", "react-dom", "@headlessui/react"];
