/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { MODULE_NAV_ICONS } from "./module-nav-icons";
import { ModuleNavItem } from "./module-nav-item";

const RunsIcon = MODULE_NAV_ICONS.runs;

const meta: Meta<typeof ModuleNavItem> = {
  title: "Shell/ModuleNavItem",
  component: ModuleNavItem,
  args: {
    href: "/acme/ia/runs",
    label: "Runs",
    icon: <RunsIcon className="size-4 flex-shrink-0" />,
  },
  parameters: { route: { path: "/acme/ia" } },
  decorators: [
    (Story) => (
      <div className="w-[240px] bg-surface-1 p-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = { parameters: { route: { path: "/acme/ia/runs" } } };

export const ActiveOnChildRoute: Story = { parameters: { route: { path: "/acme/ia/runs/42" } } };

export const LongLabel: Story = { args: { label: "Memory & Preferences for this workspace" } };
