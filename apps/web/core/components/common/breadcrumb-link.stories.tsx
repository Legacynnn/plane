/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectsOutline } from "@makeplane/propel/icons";
import { Breadcrumbs } from "@plane/ui";
import { BreadcrumbLink } from "./breadcrumb-link";

const meta: Meta<typeof BreadcrumbLink> = {
  title: "Primitives/Headers/BreadcrumbLink",
  component: BreadcrumbLink,
  decorators: [
    (Story) => (
      <div className="bg-surface-1 p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Projects",
    href: "/acme/projects",
    icon: <ProjectsOutline className="size-4 text-tertiary" />,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Link: Story = {};

export const Text: Story = {
  args: { href: undefined, isLast: true },
};

export const LabelOnly: Story = {
  args: { icon: undefined },
};

export const Trail: Story = {
  render: () => (
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
      <Breadcrumbs.Item component={<BreadcrumbLink label="Web app" href="/acme/projects/p-web/issues" icon="🖥️" />} />
      <Breadcrumbs.Item component={<BreadcrumbLink label="Work items" />} />
    </Breadcrumbs>
  ),
};
