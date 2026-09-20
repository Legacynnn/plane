/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { ProjectsOutline } from "@makeplane/propel/icons";
import { Button } from "@plane/propel/button";
import { Breadcrumbs, Header } from "@plane/ui";
import { BreadcrumbLink } from "@/components/common/breadcrumb-link";
import type { RootStore } from "@/store/root.store";
import { AppHeader } from "./app-header";

const header = (
  <Header>
    <Header.LeftItem>
      <Breadcrumbs>
        <Breadcrumbs.Item
          component={
            <BreadcrumbLink
              label="Projects"
              href="/acme/projects"
              icon={<ProjectsOutline className="size-4 text-tertiary" />}
            />
          }
        />
        <Breadcrumbs.Item component={<BreadcrumbLink label="Web app" />} />
      </Breadcrumbs>
    </Header.LeftItem>
    <Header.RightItem>
      <Button variant="primary" size="sm">
        Add work item
      </Button>
    </Header.RightItem>
  </Header>
);

const meta: Meta<typeof AppHeader> = {
  title: "Primitives/Headers/AppHeader",
  component: AppHeader,
  decorators: [
    (Story) => (
      <div className="h-[160px] bg-surface-1">
        <Story />
      </div>
    ),
  ],
  args: { header },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SidebarCollapsed: Story = {
  parameters: {
    store: (store: RootStore) =>
      runInAction(() => {
        store.theme.sidebarCollapsed = true;
      }),
  },
};

export const WithMobileHeader: Story = {
  args: {
    mobileHeader: (
      <div className="flex h-10 items-center border-b border-subtle bg-surface-1 px-4 text-13 text-secondary">
        Display filters
      </div>
    ),
  },
};
