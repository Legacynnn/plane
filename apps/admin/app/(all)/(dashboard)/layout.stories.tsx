/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { Route, Routes } from "react-router";
import type { TStoreSetup } from "../../../.storybook/decorators";
import AdminLayout from "./layout";
import UsagePage from "./usage/page";

type TLayoutProps = React.ComponentProps<typeof AdminLayout>;

const collapsed: TStoreSetup = (store) =>
  runInAction(() => {
    store.theme.isSidebarCollapsed = true;
  });

const loading: TStoreSetup = (store) =>
  runInAction(() => {
    store.user.isUserLoggedIn = undefined;
    store.user.currentUser = undefined;
  });

const meta: Meta<typeof AdminLayout> = {
  title: "God Mode/AdminLayout",
  component: AdminLayout,
  parameters: { path: "/usage/" },
  render: () => (
    <Routes>
      <Route element={<AdminLayout {...({} as TLayoutProps)} />}>
        <Route path="*" element={<UsagePage />} />
      </Route>
    </Routes>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Collapsed: Story = { parameters: { store: collapsed } };

export const Loading: Story = { parameters: { store: loading } };

export const Empty: Story = {
  render: () => (
    <Routes>
      <Route element={<AdminLayout {...({} as TLayoutProps)} />}>
        <Route path="*" element={null} />
      </Route>
    </Routes>
  ),
};

export const Narrow: Story = { globals: { viewport: { value: "mobile1" } } };

export const Dark: Story = { parameters: { theme: "dark" } };
