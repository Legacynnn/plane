/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountSettingsSidebarItemCategories } from "./account-categories";

const meta: Meta<typeof AccountSettingsSidebarItemCategories> = {
  title: "Settings/AccountSettingsSidebarItemCategories",
  component: AccountSettingsSidebarItemCategories,
  parameters: { route: { path: "/acme/settings/account/general/" } },
  decorators: [
    (Story) => (
      <div className="w-[260px] bg-surface-1">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SecurityActive: Story = {
  parameters: { route: { path: "/acme/settings/account/security/" } },
};

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
