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

const asGuest: TStoreSetup = (store) =>
  runInAction(() => {
    store.user.permission.workspaceUserInfo.acme.role = EUserPermissions.GUEST;
  });

const meta: Meta<typeof WorkspaceSettingsSidebarRoot> = {
  title: "Settings/WorkspaceSettingsSidebarRoot",
  component: WorkspaceSettingsSidebarRoot,
  decorators: [
    (Story) => (
      <div className="flex h-[700px] bg-surface-1">
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

export const Guest: Story = {
  parameters: { store: asGuest },
};

export const PortugueseBrazil: Story = {
  parameters: { locale: "pt-BR" },
};
