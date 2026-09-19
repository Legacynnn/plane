import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { compatDedupe, nextCompatAliases } from "../app/compat/next/aliases";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../core/**/*.stories.@(ts|tsx)"],
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
      tsconfigPaths({ projects: [path.resolve(dirname, "../tsconfig.json")] }),
    ],
    define: { ...viteConfig.define, "process.env": {} },
    resolve: {
      ...viteConfig.resolve,
      alias: { ...viteConfig.resolve?.alias, ...nextCompatAliases(path.resolve(dirname, "..")) },
      dedupe: compatDedupe,
    },
  }),
};

export default config;
