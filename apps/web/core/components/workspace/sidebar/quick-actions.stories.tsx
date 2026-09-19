/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { EUserPermissions } from "@plane/types";
import type { IWorkspaceMemberMe } from "@plane/types";
import type { TStoreSetup } from "../../../../.storybook/decorators";
import { SidebarQuickActions } from "./quick-actions";

const asGuest: TStoreSetup = (store) =>
  runInAction(() => {
    store.user.permission.workspaceUserInfo.acme = {
      ...store.user.permission.workspaceUserInfo.acme,
      role: EUserPermissions.GUEST,
    } as IWorkspaceMemberMe;
  });

const withoutProjects: TStoreSetup = (store) =>
  runInAction(() => {
    store.projectRoot.project.projectMap = {};
  });

const meta: Meta<typeof SidebarQuickActions> = {
  title: "Work sidebar/SidebarQuickActions",
  component: SidebarQuickActions,
  decorators: [
    (Story) => (
      <div className="w-[280px] bg-surface-1 px-3 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DisabledForGuest: Story = { parameters: { store: asGuest } };

export const DisabledWithoutProjects: Story = { parameters: { store: withoutProjects } };

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
