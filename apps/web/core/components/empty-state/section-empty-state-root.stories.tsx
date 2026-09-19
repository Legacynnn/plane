/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterOutline } from "@makeplane/propel/icons";
import { Button } from "@plane/propel/button";
import { SectionEmptyState } from "./section-empty-state-root";

const meta: Meta<typeof SectionEmptyState> = {
  title: "Primitives/EmptyState/SectionEmptyState",
  component: SectionEmptyState,
  decorators: [
    (Story) => (
      <div className="w-[560px] bg-surface-1 p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    icon: <FilterOutline className="size-4" />,
    title: "No work items match your filters",
    description: "Try removing some filters to see more results.",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: { actionElement: <Button variant="secondary">Clear filters</Button> },
};

export const TitleOnly: Story = {
  args: { description: undefined },
};

export const Borderless: Story = {
  args: { customClassName: "border-none" },
};
