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
import { SidebarWorkspaceMenu } from "./workspace-menu";

const asGuest: TStoreSetup = (store) =>
  runInAction(() => {
    store.user.permission.workspaceUserInfo.acme = {
      ...store.user.permission.workspaceUserInfo.acme,
      role: EUserPermissions.GUEST,
    } as IWorkspaceMemberMe;
  });

const setWorkspaceMenuOpen = (isOpen: boolean) => () => {
  localStorage.setItem("is_workspace_menu_open", JSON.stringify(isOpen));
  return () => localStorage.removeItem("is_workspace_menu_open");
};

const meta: Meta<typeof SidebarWorkspaceMenu> = {
  title: "Work sidebar/SidebarWorkspaceMenu",
  component: SidebarWorkspaceMenu,
  decorators: [
    (Story) => (
      <div className="w-[280px] bg-surface-1 px-3 py-3">
        <Story />
      </div>
    ),
  ],
  beforeEach: setWorkspaceMenuOpen(true),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ProjectsActive: Story = { parameters: { route: { path: "/acme/projects/" } } };

export const Collapsed: Story = { beforeEach: setWorkspaceMenuOpen(false) };

export const Guest: Story = { parameters: { store: asGuest } };

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
