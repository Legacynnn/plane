/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import type { TStoreSetup } from "../../../../.storybook/decorators";
import { ProjectAppSidebar } from "./_sidebar";

const collapsed: TStoreSetup = (store) =>
  runInAction(() => {
    store.theme.sidebarCollapsed = true;
  });

const meta: Meta<typeof ProjectAppSidebar> = {
  title: "Work sidebar/ProjectAppSidebar",
  component: ProjectAppSidebar,
  decorators: [
    (Story) => (
      <div className="flex h-[720px] w-[520px] bg-canvas p-2">
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

export const Default: Story = {};

export const Collapsed: Story = { parameters: { store: collapsed } };
