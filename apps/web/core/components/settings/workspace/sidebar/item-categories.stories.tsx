/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { EUserPermissions } from "@plane/types";
import type { TStoreSetup } from "../../../../../.storybook/decorators";
import { WorkspaceSettingsSidebarItemCategories } from "./item-categories";

const asRole =
  (role: EUserPermissions): TStoreSetup =>
  (store) =>
    runInAction(() => {
      store.user.permission.workspaceUserInfo.acme.role = role;
    });

const meta: Meta<typeof WorkspaceSettingsSidebarItemCategories> = {
  title: "Settings/WorkspaceSettingsSidebarItemCategories",
  component: WorkspaceSettingsSidebarItemCategories,
  decorators: [
    (Story) => (
      <div className="w-[250px] bg-surface-1 py-3">
        <Story />
      </div>
    ),
  ],
  parameters: { route: { path: "/acme/settings/" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {};

export const Member: Story = {
  parameters: { store: asRole(EUserPermissions.MEMBER) },
};

export const Guest: Story = {
  parameters: { store: asRole(EUserPermissions.GUEST) },
};

export const IaSectionActive: Story = {
  parameters: { route: { path: "/acme/settings/preferences/" } },
};

export const WebhookDetailActive: Story = {
  parameters: { route: { path: "/acme/settings/webhooks/9f2c/" } },
};

export const PortugueseBrazil: Story = {
  parameters: { locale: "pt-BR" },
};
