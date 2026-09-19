/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { EUserPermissions } from "@plane/types";
import type { IWorkspaceMemberMe, TProject } from "@plane/types";
import type { TStoreSetup } from "../../../../.storybook/decorators";
import { PROJECTS } from "../../../../.storybook/fixtures";
import { SidebarProjectsList } from "./projects-list";

const LONG_NAMES = [
  "Customer onboarding and activation experiments",
  "Billing platform migration to usage-based pricing",
  "Internal developer tooling",
  "Q4 marketing site redesign with localized landing pages",
  "Data warehouse",
  "Mobile offline sync",
  "Accessibility audit remediation across all product surfaces",
  "Security and compliance (SOC 2 Type II)",
  "Search relevance",
  "Partner integrations marketplace",
  "Notifications overhaul",
  "Infrastructure cost reduction initiative for 2026",
  "Support tooling",
  "Enterprise SSO and SCIM provisioning",
  "Growth analytics dashboards",
];

const EMOJIS = ["128640", "128179", "128295", "127912", "128202", "128241", "9855", "128274"];

const withManyProjects: TStoreSetup = (store) =>
  runInAction(() => {
    store.projectRoot.project.projectMap = {};
    LONG_NAMES.forEach((name, index) => {
      const id = `p-many-${index}`;
      store.projectRoot.project.projectMap[id] = {
        ...PROJECTS[0],
        id,
        name,
        identifier: `P${index + 1}`,
        sort_order: (index + 1) * 1000,
        logo_props: { in_use: "emoji", emoji: { value: EMOJIS[index % EMOJIS.length] } },
      } as TProject;
      store.user.permission.workspaceProjectsPermissions.acme[id] = EUserPermissions.ADMIN;
    });
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

const asGuest: TStoreSetup = (store) =>
  runInAction(() => {
    store.user.permission.workspaceUserInfo.acme = {
      ...store.user.permission.workspaceUserInfo.acme,
      role: EUserPermissions.GUEST,
    } as IWorkspaceMemberMe;
    for (const project of PROJECTS) {
      store.user.permission.workspaceProjectsPermissions.acme[project.id] = EUserPermissions.GUEST;
      store.projectRoot.project.projectMap[project.id] = { ...project, member_role: EUserPermissions.GUEST };
    }
  });

const meta: Meta<typeof SidebarProjectsList> = {
  title: "Work sidebar/SidebarProjectsList",
  component: SidebarProjectsList,
  decorators: [
    (Story) => (
      <div className="flex h-[640px] w-[280px] flex-col overflow-y-auto bg-surface-1 px-3 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { parameters: { store: loading } };

export const Empty: Story = { parameters: { store: withoutProjects } };

export const ManyProjectsWithLongNames: Story = { parameters: { store: withManyProjects } };

export const Guest: Story = { parameters: { store: asGuest } };

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
