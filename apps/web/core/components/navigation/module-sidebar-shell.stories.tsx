/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import type { TStoreSetup } from "../../../.storybook/decorators";
import { IaSidebar } from "@/components/ia/sidebar/root";
import { WIKI_COLLECTIONS } from "../../../.storybook/fixtures";
import { WikiSidebar } from "@/components/wiki/sidebar/root";
import { ModuleSidebarShell } from "./module-sidebar-shell";

const collapsed: TStoreSetup = (store) =>
  runInAction(() => {
    store.theme.sidebarCollapsed = true;
  });

const meta: Meta<typeof ModuleSidebarShell> = {
  title: "Shell/ModuleSidebarShell",
  component: ModuleSidebarShell,
  parameters: { route: { path: "/acme/wiki" } },
  decorators: [
    (Story) => (
      <div className="flex h-[640px] w-[420px] bg-canvas p-2">
        <div className="flex size-full overflow-hidden rounded-lg border border-subtle">
          <Story />
          <main className="flex-1 bg-surface-1" />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Wiki: Story = { args: { children: <WikiSidebar collections={WIKI_COLLECTIONS} /> } };

export const Ia: Story = {
  args: { children: <IaSidebar /> },
  parameters: { route: { path: "/acme/ia" } },
};

export const Collapsed: Story = {
  args: { children: <WikiSidebar collections={WIKI_COLLECTIONS} /> },
  parameters: { store: collapsed },
};
