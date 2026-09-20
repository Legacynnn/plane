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
import { SidebarUserMenu } from "./user-menu";

const setMembership =
  (membership: Partial<IWorkspaceMemberMe>): TStoreSetup =>
  (store) =>
    runInAction(() => {
      store.user.permission.workspaceUserInfo.acme = {
        ...store.user.permission.workspaceUserInfo.acme,
        ...membership,
      } as IWorkspaceMemberMe;
    });

const meta: Meta<typeof SidebarUserMenu> = {
  title: "Work sidebar/SidebarUserMenu",
  component: SidebarUserMenu,
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

export const WithDrafts: Story = { parameters: { store: setMembership({ draft_issue_count: 3 }) } };

export const Guest: Story = { parameters: { store: setMembership({ role: EUserPermissions.GUEST }) } };

export const PortugueseBrazil: Story = {
  parameters: { locale: "pt-BR", store: setMembership({ draft_issue_count: 3 }) },
};
