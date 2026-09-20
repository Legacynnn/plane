/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { userEvent, within } from "storybook/test";
import type { IInstanceConfig, IWorkspace } from "@plane/types";
import type { TStoreSetup } from "../../../../.storybook/decorators";
import { WORKSPACE } from "../../../../.storybook/fixtures";
import { WorkspaceMenuRoot } from "./workspace-menu-root";

const addWorkspaces: TStoreSetup = (store) =>
  runInAction(() => {
    for (const [id, slug, name] of [
      ["ws-globex", "globex", "Globex"],
      ["ws-initech", "initech", "Initech"],
    ]) {
      store.workspaceRoot.workspaces[id] = { ...WORKSPACE, id, slug, name } as IWorkspace;
    }
  });

const setLongWorkspaceName: TStoreSetup = (store) =>
  runInAction(() => {
    store.workspaceRoot.workspaces["ws-acme"].name = "Acme Interplanetary Logistics and Research Cooperative";
  });

const disableWorkspaceCreation: TStoreSetup = (store) => {
  addWorkspaces(store);
  runInAction(() => {
    store.instance.config = { ...store.instance.config, is_workspace_creation_disabled: true } as IInstanceConfig;
  });
};

const openMenu: Story["play"] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getAllByRole("button").at(-1)!);
};

const meta: Meta<typeof WorkspaceMenuRoot> = {
  title: "Shell/WorkspaceMenuRoot",
  component: WorkspaceMenuRoot,
  decorators: [
    (Story, { args }) => (
      <div className="flex h-[480px] w-[640px] items-start bg-canvas">
        {args.variant === "sidebar" ? (
          <div className="flex h-full w-14 justify-center bg-surface-1 py-2">
            <Story />
          </div>
        ) : (
          <div className="flex h-10 w-80 items-center px-3.5">
            <Story />
          </div>
        )}
      </div>
    ),
  ],
  args: { variant: "top-navigation" },
  parameters: { store: addWorkspaces },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TopNavigation: Story = {};

export const TopNavigationOpen: Story = { play: openMenu };

export const Sidebar: Story = { args: { variant: "sidebar" } };

export const SidebarOpen: Story = { ...Sidebar, play: openMenu };

export const LongWorkspaceName: Story = {
  parameters: { store: setLongWorkspaceName },
};

export const WorkspaceCreationDisabled: Story = {
  play: openMenu,
  parameters: { store: disableWorkspaceCreation },
};

export const PortugueseBrazil: Story = { play: openMenu, parameters: { locale: "pt-BR" } };
