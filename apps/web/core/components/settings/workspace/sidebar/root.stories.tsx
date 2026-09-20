/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { EUserPermissions } from "@plane/types";
import type { TStoreSetup } from "../../../../../.storybook/decorators";
import { WorkspaceSettingsSidebarRoot } from "./root";

const asRole =
  (role: EUserPermissions): TStoreSetup =>
  (store) =>
    runInAction(() => {
      store.user.permission.workspaceUserInfo.acme.role = role;
    });

const meta: Meta<typeof WorkspaceSettingsSidebarRoot> = {
  title: "Settings/WorkspaceSettingsSidebarRoot",
  component: WorkspaceSettingsSidebarRoot,
  decorators: [
    (Story) => (
      <div className="flex h-screen bg-surface-1">
        <Story />
      </div>
    ),
  ],
  parameters: { route: { path: "/acme/settings/" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AccountActive: Story = {
  parameters: { route: { path: "/acme/settings/account/preferences/" } },
};

export const Member: Story = {
  parameters: { store: asRole(EUserPermissions.MEMBER) },
};

export const Guest: Story = {
  parameters: { store: asRole(EUserPermissions.GUEST) },
};

export const CodebaseActive: Story = {
  parameters: { route: { path: "/acme/settings/code-scopes/" } },
};

export const PortugueseBrazil: Story = {
  parameters: { locale: "pt-BR" },
};
