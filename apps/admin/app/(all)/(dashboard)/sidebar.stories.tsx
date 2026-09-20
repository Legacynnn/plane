/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import type { TStoreSetup } from "../../../.storybook/decorators";
import { AdminSidebar } from "./sidebar";

const collapsed: TStoreSetup = (store) =>
  runInAction(() => {
    store.theme.isSidebarCollapsed = true;
  });

const meta: Meta<typeof AdminSidebar> = {
  title: "God Mode/AdminSidebar",
  component: AdminSidebar,
  decorators: [
    (Story) => (
      <div className="flex h-screen bg-canvas">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ProvidersActive: Story = { parameters: { path: "/providers/" } };

export const Collapsed: Story = { parameters: { store: collapsed, path: "/providers/" } };

export const Dark: Story = { parameters: { theme: "dark", path: "/usage/" } };
