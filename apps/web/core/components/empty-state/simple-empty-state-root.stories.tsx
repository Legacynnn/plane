/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import progressAsset from "@/app/assets/empty-state/active-cycle/progress-light.webp?url";
import { SimpleEmptyState } from "./simple-empty-state-root";

const meta: Meta<typeof SimpleEmptyState> = {
  title: "Primitives/EmptyState/SimpleEmptyState",
  component: SimpleEmptyState,
  decorators: [
    (Story) => (
      <div className="flex min-h-[320px] items-center justify-center bg-surface-1 p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "No progress yet",
    assetPath: progressAsset,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};

export const Large: Story = {
  args: { size: "lg" },
};

export const WithDescription: Story = {
  args: {
    size: "lg",
    title: "Nothing to track",
    description: "Add work items to this cycle to see progress here.",
  },
};

export const WithoutAsset: Story = {
  args: { assetPath: undefined, title: "No labels found" },
};
