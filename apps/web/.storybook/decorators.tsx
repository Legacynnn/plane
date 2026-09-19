/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import type { Decorator } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router";
import { TranslationProvider } from "@plane/i18n";
import { StoreContext } from "@/lib/store-context";
import { RootStore } from "@/store/root.store";
import { seedWorkspace } from "./fixtures";

type TRouteParameters = {
  path?: string;
  pattern?: string;
};

export const withRouter: Decorator = (Story, { parameters }) => {
  const { path = "/acme/", pattern = ":workspaceSlug/*" } = (parameters.route ?? {}) as TRouteParameters;
  return (
    <MemoryRouter key={path} initialEntries={[path]}>
      <Routes>
        <Route path={pattern} element={<Story />} />
      </Routes>
    </MemoryRouter>
  );
};

export type TStoreSetup = (store: RootStore) => void;

function MockStoreProvider({ setup, children }: { setup?: TStoreSetup; children: React.ReactNode }) {
  const [store] = useState(() => {
    const root = new RootStore();
    seedWorkspace(root);
    setup?.(root);
    return root;
  });
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export const withMockStore: Decorator = (Story, { parameters }) => (
  <MockStoreProvider key={JSON.stringify(parameters.route)} setup={parameters.store as TStoreSetup | undefined}>
    <Story />
  </MockStoreProvider>
);

export const withTranslation: Decorator = (Story) => (
  <TranslationProvider>
    <Story />
  </TranslationProvider>
);
