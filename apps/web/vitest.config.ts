import path from "node:path";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { compatDedupe, nextCompatAliases } from "./app/compat/next/aliases";

export default defineConfig({
  plugins: [tsconfigPaths({ projects: [path.resolve(__dirname, "tsconfig.json")] })],
  resolve: {
    alias: nextCompatAliases(__dirname),
    dedupe: compatDedupe,
  },
  test: {
    environment: "jsdom",
    include: ["core/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
  },
});
