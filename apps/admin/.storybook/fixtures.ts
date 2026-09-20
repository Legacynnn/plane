/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { runInAction } from "mobx";
import type { IInstance, IUser } from "@plane/types";
import type { RootStore } from "@/store/root.store";

export const ADMIN = {
  id: "admin-1",
  email: "ada@acme.dev",
  display_name: "Ada",
  first_name: "Ada",
  last_name: "Lovelace",
  avatar_url: "",
} as IUser;

export const INSTANCE = {
  id: "instance-1",
  instance_name: "Acme",
  current_version: "1.4.2",
  latest_version: "1.4.2",
  is_setup_done: true,
} as IInstance;

export const seedInstance = (store: RootStore) =>
  runInAction(() => {
    store.user.isUserLoggedIn = true;
    store.user.currentUser = ADMIN;
    store.instance.instance = INSTANCE;
    store.theme.isSidebarCollapsed = false;
  });
