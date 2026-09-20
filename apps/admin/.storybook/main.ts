/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, "..");

const config: StorybookConfig = {
  stories: ["../app/**/*.stories.@(ts|tsx)", "../components/**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: [
      ...(viteConfig.plugins ?? [])
        .flat()
        .filter((plugin) => !(plugin && "name" in plugin && plugin.name.startsWith("react-router"))),
      tsconfigPaths({ projects: [path.resolve(root, "tsconfig.json")] }),
    ],
    define: { ...viteConfig.define, "process.env": {} },
    resolve: {
      ...viteConfig.resolve,
      alias: {
        ...viteConfig.resolve?.alias,
        "next/link": path.resolve(root, "app/compat/next/link.tsx"),
        "next/navigation": path.resolve(root, "app/compat/next/navigation.ts"),
      },
      dedupe: ["react", "react-dom"],
    },
  }),
};

export default config;
