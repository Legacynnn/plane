/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProfileSettingsSidebarItemCategories } from "./item-categories";

const meta: Meta<typeof ProfileSettingsSidebarItemCategories> = {
  title: "Settings/ProfileSettingsSidebarItemCategories",
  component: ProfileSettingsSidebarItemCategories,
  args: { activeTab: "general", updateActiveTab: () => {} },
  parameters: {
    route: { path: "/acme/settings/profile/general/", pattern: ":workspaceSlug/settings/profile/:profileTabId" },
  },
  decorators: [
    (Story) => (
      <div className="w-[260px] bg-surface-1 px-2 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecurityActive: Story = {
  args: { activeTab: "security" },
  parameters: {
    route: { path: "/acme/settings/profile/security/", pattern: ":workspaceSlug/settings/profile/:profileTabId" },
  },
};

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
