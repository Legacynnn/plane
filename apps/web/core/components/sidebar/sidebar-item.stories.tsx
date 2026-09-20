/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { WikiIcon } from "@plane/propel/icons";
import { AppSidebarItem } from "./sidebar-item";

const meta: Meta<typeof AppSidebarItem> = {
  title: "Sidebar/AppSidebarItem",
  component: AppSidebarItem,
  decorators: [
    (Story) => (
      <div className="flex w-[3.75rem] flex-col bg-canvas px-2 py-3">
        <Story />
      </div>
    ),
  ],
  args: {
    item: {
      label: "Wiki",
      icon: <WikiIcon className="size-5" />,
      href: "/acme/wiki",
      isActive: false,
      showLabel: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { item: { ...meta.args?.item, isActive: true } },
};

export const IconOnly: Story = {
  args: { item: { ...meta.args?.item, showLabel: false } },
};

export const LongLabel: Story = {
  args: { item: { ...meta.args?.item, label: "Configurações" } },
};

export const Button: Story = {
  args: { variant: "button", item: { ...meta.args?.item, href: undefined } },
};
