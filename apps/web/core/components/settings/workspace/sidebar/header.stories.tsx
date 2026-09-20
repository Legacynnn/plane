/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { EUserPermissions } from "@plane/types";
import type { IWorkspaceMemberMe } from "@plane/types";
import type { TStoreSetup } from "../../../../../.storybook/decorators";
import { WorkspaceSettingsSidebarHeader } from "./header";

const asGuest: TStoreSetup = (store) =>
  runInAction(() => {
    store.user.permission.workspaceUserInfo.acme = {
      ...store.user.permission.workspaceUserInfo.acme,
      role: EUserPermissions.GUEST,
    } as IWorkspaceMemberMe;
  });

const withLongName: TStoreSetup = (store) =>
  runInAction(() => {
    store.workspaceRoot.workspaces["ws-acme"].name = "Acme Interplanetary Logistics and Research Cooperative";
  });

const meta: Meta<typeof WorkspaceSettingsSidebarHeader> = {
  title: "Settings/WorkspaceSettingsSidebarHeader",
  component: WorkspaceSettingsSidebarHeader,
  parameters: { route: { path: "/acme/settings/" } },
  decorators: [
    (Story) => (
      <div className="w-[260px] bg-surface-1 py-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Guest: Story = { parameters: { store: asGuest } };

export const LongWorkspaceName: Story = { parameters: { store: withLongName } };

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
