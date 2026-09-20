/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { Route, Routes } from "react-router";
import { EUserPermissions } from "@plane/types";
import { WorkspaceSettingsPlaceholder } from "@/components/settings/workspace/placeholder";
import type { TStoreSetup } from "../../../../../../.storybook/decorators";
import WorkspaceSettingLayout from "./layout";

type TLayoutProps = React.ComponentProps<typeof WorkspaceSettingLayout>;

const layoutProps = { params: { workspaceSlug: "acme" } } as TLayoutProps;

const asMember: TStoreSetup = (store) =>
  runInAction(() => {
    store.user.permission.workspaceUserInfo.acme.role = EUserPermissions.MEMBER;
  });

const renderWith = (content: React.ReactNode) => () => (
  <div className="flex h-screen flex-col bg-surface-1">
    <Routes>
      <Route element={<WorkspaceSettingLayout {...layoutProps} />}>
        <Route path="*" element={content} />
      </Route>
    </Routes>
  </div>
);

const meta: Meta<typeof WorkspaceSettingLayout> = {
  title: "Settings/WorkspaceSettingLayout",
  component: WorkspaceSettingLayout,
  parameters: { route: { path: "/acme/settings/connectors/" } },
  render: renderWith(<WorkspaceSettingsPlaceholder tab="connectors" />),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { render: renderWith(null) };

export const NotAuthorized: Story = { parameters: { store: asMember } };

export const Narrow: Story = { globals: { viewport: { value: "mobile1" } } };

export const Dark: Story = { parameters: { theme: "dark" } };

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
