/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumbs } from "@plane/ui";
import { BreadcrumbLink } from "@/components/common/breadcrumb-link";
import { SettingsContentWrapper } from "./content-wrapper";
import { SettingsPageHeader } from "./page-header";

const header = (
  <SettingsPageHeader
    leftItem={
      <Breadcrumbs>
        <Breadcrumbs.Item component={<BreadcrumbLink label="Connectors" />} />
      </Breadcrumbs>
    }
  />
);

const meta: Meta<typeof SettingsContentWrapper> = {
  title: "Settings/SettingsContentWrapper",
  component: SettingsContentWrapper,
  args: {
    header,
    children: <div className="rounded-lg border border-subtle p-6 text-13 text-secondary">Section content</div>,
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen bg-surface-1">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutHeader: Story = { args: { header: undefined } };

export const Hugging: Story = { args: { hugging: true } };

export const Narrow: Story = { globals: { viewport: { value: "mobile1" } } };
