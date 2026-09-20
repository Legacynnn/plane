/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { IS_FAVORITE_MENU_OPEN } from "@plane/constants";
import { EUserPermissions } from "@plane/types";
import type { IFavorite, IWorkspaceMemberMe, TProject } from "@plane/types";
import type { TStoreSetup } from "../../../../.storybook/decorators";
import { PROJECTS, WORKSPACE } from "../../../../.storybook/fixtures";
import { AppSidebar } from "./sidebar";

const favoriteProject = PROJECTS[0];

const withFavorite: TStoreSetup = (store) =>
  runInAction(() => {
    store.favorite.favoriteMap["fav-web"] = {
      id: "fav-web",
      name: favoriteProject.name,
      entity_type: "project",
      entity_identifier: favoriteProject.id,
      entity_data: { id: favoriteProject.id, name: favoriteProject.name, logo_props: favoriteProject.logo_props },
      is_folder: false,
      sort_order: 1000,
      parent: null,
      children: [],
      project_id: favoriteProject.id,
      sequence: 1,
      workspace_id: WORKSPACE.id,
    } as IFavorite;
    store.favorite.favoriteIds = ["fav-web"];
  });

const asGuest: TStoreSetup = (store) =>
  runInAction(() => {
    store.user.permission.workspaceUserInfo.acme = {
      ...store.user.permission.workspaceUserInfo.acme,
      role: EUserPermissions.GUEST,
    } as IWorkspaceMemberMe;
    for (const project of PROJECTS) {
      store.user.permission.workspaceProjectsPermissions.acme[project.id] = EUserPermissions.GUEST;
      store.projectRoot.project.projectMap[project.id] = {
        ...project,
        member_role: EUserPermissions.GUEST,
      } as TProject;
    }
  });

const withoutProjects: TStoreSetup = (store) =>
  runInAction(() => {
    store.projectRoot.project.projectMap = {};
  });

const loading: TStoreSetup = (store) =>
  runInAction(() => {
    store.projectRoot.project.projectMap = {};
    store.projectRoot.project.loader = "init-loader";
  });

const openFavoritesMenu = () => {
  localStorage.setItem(IS_FAVORITE_MENU_OPEN, "true");
  return () => localStorage.removeItem(IS_FAVORITE_MENU_OPEN);
};

const WIDTHS = { default: "w-[280px]", narrow: "w-[240px]" };

const meta: Meta<typeof AppSidebar> = {
  title: "Work sidebar/AppSidebar",
  component: AppSidebar,
  decorators: [
    (Story, { parameters }) => (
      <div className={`flex h-[720px] bg-surface-1 ${WIDTHS[(parameters.width as keyof typeof WIDTHS) ?? "default"]}`}>
        <Story />
      </div>
    ),
  ],
  parameters: { store: withFavorite },
  beforeEach: openFavoritesMenu,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutFavorites: Story = { parameters: { store: () => {} } };

export const Loading: Story = { parameters: { store: loading } };

export const Empty: Story = { parameters: { store: withoutProjects } };

export const Guest: Story = { parameters: { store: asGuest } };

export const Narrow: Story = { parameters: { width: "narrow" } };

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };

export const Dark: Story = { parameters: { theme: "dark" } };
