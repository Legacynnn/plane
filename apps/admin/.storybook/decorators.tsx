/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect, useState } from "react";
import type { Decorator } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { StoreContext } from "@/providers/store-context";
import { RootStore } from "@/store/root.store";
import { seedInstance } from "./fixtures";

export const THEMES = ["light", "dark", "light-contrast", "dark-contrast"] as const;

export type TStoreSetup = (store: RootStore) => void;

export const withRouter: Decorator = (Story, { parameters }) => {
  const path = (parameters.path as string | undefined) ?? "/general/";
  return (
    <MemoryRouter key={path} initialEntries={[path]}>
      <Story />
    </MemoryRouter>
  );
};

function MockStoreProvider({ setup, children }: { setup?: TStoreSetup; children: React.ReactNode }) {
  const [store] = useState(() => {
    const root = new RootStore();
    seedInstance(root);
    setup?.(root);
    return root;
  });
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export const withMockStore: Decorator = (Story, { parameters }) => (
  <MockStoreProvider key={parameters.path as string | undefined} setup={parameters.store as TStoreSetup | undefined}>
    <Story />
  </MockStoreProvider>
);

function ThemeScope({ theme, children }: { theme: string; children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return children;
}

export const withTheme: Decorator = (Story, { globals, parameters }) => (
  <ThemeScope theme={(parameters.theme as string | undefined) ?? (globals.theme as string)}>
    <Story />
  </ThemeScope>
);
