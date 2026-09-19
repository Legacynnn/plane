/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidebarWrapper } from "./sidebar-wrapper";

const meta: Meta<typeof SidebarWrapper> = {
  title: "Sidebar/SidebarWrapper",
  component: SidebarWrapper,
  decorators: [
    (Story) => (
      <div className="flex h-[480px] w-[280px] bg-surface-1">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Work",
    children: <p className="px-2 text-13 text-tertiary">Sidebar content</p>,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomizeNavigation: Story = {
  args: { canCustomizeNavigation: true },
};
