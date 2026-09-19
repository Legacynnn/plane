/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon } from "lucide-react";
import { fn } from "storybook/test";
import allIssuesAsset from "@/app/assets/empty-state/all-issues/all-issues-light.webp?url";
import { DetailedEmptyState } from "./detailed-empty-state-root";

const meta: Meta<typeof DetailedEmptyState> = {
  title: "Primitives/EmptyState/DetailedEmptyState",
  component: DetailedEmptyState,
  decorators: [
    (Story) => (
      <div className="flex min-h-[640px] bg-surface-1 p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "No work items yet",
    description: "Work items help you track, plan and ship. Create your first one to get started.",
    assetPath: allIssuesAsset,
    primaryButton: { text: "Create work item", prependIcon: <PlusIcon className="size-3.5" />, onClick: fn() },
    secondaryButton: { text: "Import", onClick: fn() },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PrimaryOnly: Story = {
  args: { secondaryButton: undefined },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const DisabledPrimary: Story = {
  args: { primaryButton: { text: "Create work item", disabled: true } },
};

export const TitleOnly: Story = {
  args: { description: undefined, assetPath: undefined, primaryButton: undefined, secondaryButton: undefined },
};
