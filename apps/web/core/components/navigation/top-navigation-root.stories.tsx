/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import type { TStoreSetup } from "../../../.storybook/decorators";
import { TopNavigationRoot } from "./top-navigation-root";

const setNotifications =
  (total: number, mentions: number): TStoreSetup =>
  (store) =>
    runInAction(() => {
      store.workspaceNotification.unreadNotificationsCount = {
        total_unread_notifications_count: total,
        mention_unread_notifications_count: mentions,
      };
    });

const setLongWorkspaceName: TStoreSetup = (store) =>
  runInAction(() => {
    store.workspaceRoot.workspaces["ws-acme"].name = "Acme Interplanetary Logistics and Research Cooperative";
  });

const meta: Meta<typeof TopNavigationRoot> = {
  title: "Shell/TopNavigationRoot",
  component: TopNavigationRoot,
  decorators: [
    (Story) => (
      <div className="h-[320px] w-[1280px] bg-canvas">
        <Story />
      </div>
    ),
  ],
  parameters: { route: { path: "/acme/" } },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoUnreadNotifications: Story = {
  parameters: { store: setNotifications(0, 0) },
};

export const InboxActive: Story = {
  parameters: { route: { path: "/acme/notifications/" } },
};

export const LongWorkspaceName: Story = {
  parameters: { store: setLongWorkspaceName },
};

export const PortugueseBrazil: Story = {
  parameters: { locale: "pt-BR" },
};
