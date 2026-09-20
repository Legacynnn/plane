/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { runInAction } from "mobx";
import { EUserPermissions } from "@plane/types";
import type { TWikiCollection } from "@/components/wiki/sidebar/types";
import type { IState, IUser, IUserLite, IWorkspace, IWorkspaceMemberMe, TProject } from "@plane/types";
import workspaceNotificationService from "@/services/workspace-notification.service";
import type { RootStore } from "@/store/root.store";

export const WORKSPACE_SLUG = "acme";
const WORKSPACE_ID = "ws-acme";
const TIMESTAMP = "2026-09-01T09:00:00Z";

export const MEMBERS: IUserLite[] = [
  { id: "u-ana", display_name: "ana", first_name: "Ana", last_name: "Souza", avatar_url: "", is_bot: false },
  { id: "u-ben", display_name: "ben", first_name: "Ben", last_name: "Okafor", avatar_url: "", is_bot: false },
  { id: "u-chloe", display_name: "chloe", first_name: "Chloé", last_name: "Martin", avatar_url: "", is_bot: false },
  { id: "u-diego", display_name: "diego", first_name: "Diego", last_name: "Alvarez", avatar_url: "", is_bot: false },
  { id: "u-emi", display_name: "emi", first_name: "Emi", last_name: "Tanaka", avatar_url: "", is_bot: false },
] as IUserLite[];

export const CURRENT_USER = {
  ...MEMBERS[0],
  email: "ana@acme.dev",
  is_active: true,
  is_email_verified: true,
  is_password_autoset: false,
  is_tour_completed: true,
  date_joined: TIMESTAMP,
  last_workspace_id: WORKSPACE_ID,
  user_timezone: "America/Sao_Paulo",
  username: "ana",
} as IUser;

export const WORKSPACE = {
  id: WORKSPACE_ID,
  slug: WORKSPACE_SLUG,
  name: "Acme",
  url: `https://app.plane.so/${WORKSPACE_SLUG}`,
  logo_url: null,
  owner: CURRENT_USER,
  total_members: MEMBERS.length,
  role: EUserPermissions.ADMIN,
  timezone: "America/Sao_Paulo",
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
} as unknown as IWorkspace;

const project = (id: string, name: string, identifier: string, emoji: string, sort_order: number) =>
  ({
    id,
    name,
    identifier,
    sort_order,
    workspace: WORKSPACE_ID,
    archived_at: null,
    member_role: EUserPermissions.ADMIN,
    logo_props: { in_use: "emoji", emoji: { value: emoji } },
    cycle_view: true,
    module_view: true,
    issue_views_view: true,
    page_view: true,
    inbox_view: true,
    created_at: TIMESTAMP,
    updated_at: TIMESTAMP,
  }) as unknown as TProject;

export const PROJECTS: TProject[] = [
  project("p-web", "Web app", "WEB", "128421", 1000),
  project("p-api", "Public API", "API", "9881", 2000),
  project("p-mobile", "Mobile", "MOB", "128241", 3000),
  project("p-design", "Design system", "DS", "127912", 4000),
];

export const STATE_PROJECT_ID = PROJECTS[0].id;

const state = (id: string, name: string, group: IState["group"], color: string, sequence: number) =>
  ({
    id,
    name,
    group,
    color,
    sequence,
    default: group === "backlog",
    description: "",
    project_id: STATE_PROJECT_ID,
    workspace_id: WORKSPACE_ID,
    order: sequence,
  }) as IState;

export const STATES: IState[] = [
  state("s-backlog", "Backlog", "backlog", "#60646C", 1000),
  state("s-todo", "Todo", "unstarted", "#60646C", 2000),
  state("s-progress", "In Progress", "started", "#F59E0B", 3000),
  state("s-done", "Done", "completed", "#46A758", 4000),
  state("s-cancelled", "Cancelled", "cancelled", "#9AA4BC", 5000),
];

export const seedWorkspace = (store: RootStore) => {
  runInAction(() => {
    store.router.setQuery({ workspaceSlug: WORKSPACE_SLUG, projectId: STATE_PROJECT_ID });
    store.workspaceRoot.workspaces[WORKSPACE_ID] = WORKSPACE;

    store.user.isAuthenticated = true;
    store.user.data = CURRENT_USER;
    store.user.permission.workspaceUserInfo[WORKSPACE_SLUG] = {
      role: EUserPermissions.ADMIN,
      member: CURRENT_USER.id,
      workspace: WORKSPACE_ID,
      draft_issue_count: 0,
    } as unknown as IWorkspaceMemberMe;
    store.user.permission.workspaceProjectsPermissions[WORKSPACE_SLUG] = Object.fromEntries(
      PROJECTS.map((item) => [item.id, EUserPermissions.ADMIN])
    );

    for (const item of PROJECTS) store.projectRoot.project.projectMap[item.id] = item;
    store.projectRoot.project.loader = "loaded";

    store.memberRoot.workspace.workspaceMemberMap[WORKSPACE_SLUG] = {};
    for (const member of MEMBERS) {
      store.memberRoot.memberMap[member.id] = member;
      store.memberRoot.workspace.workspaceMemberMap[WORKSPACE_SLUG][member.id] = {
        id: `wm-${member.id}`,
        member: member.id,
        role: EUserPermissions.MEMBER,
        is_active: true,
      };
    }

    for (const item of STATES) store.state.stateMap[item.id] = item;
    store.state.fetchedMap[STATE_PROJECT_ID] = true;

    store.workspaceNotification.unreadNotificationsCount = {
      total_unread_notifications_count: 3,
      mention_unread_notifications_count: 1,
    };
  });

  workspaceNotificationService.fetchUnreadNotificationsCount = async () =>
    store.workspaceNotification.unreadNotificationsCount;
};

export const WIKI_COLLECTIONS: TWikiCollection[] = [
  {
    id: "handbook",
    name: "Handbook",
    pages: [
      { id: "onboarding", name: "Onboarding" },
      {
        id: "engineering",
        name: "Engineering",
        children: [
          { id: "review", name: "Code review" },
          { id: "oncall", name: "On-call rotation", isAgentAuthored: true },
        ],
      },
      { id: "brand", name: "Brand and voice" },
    ],
  },
  {
    id: "meetings",
    name: "Meetings",
    pages: [
      { id: "weekly", name: "Weekly sync notes", isAgentAuthored: true },
      { id: "retro", name: "Retro 2026-09-12", isAgentAuthored: true },
    ],
  },
  {
    id: "long",
    name: "Customer research and discovery interviews",
    pages: [{ id: "interviews", name: "Interview transcripts from the enterprise pilot cohort" }],
  },
];
