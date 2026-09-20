/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkspaceSettingsPlaceholder } from "./placeholder";

const meta: Meta<typeof WorkspaceSettingsPlaceholder> = {
  title: "Settings/WorkspaceSettingsPlaceholder",
  component: WorkspaceSettingsPlaceholder,
  decorators: [
    (Story) => (
      <div className="flex h-[520px] bg-surface-1">
        <Story />
      </div>
    ),
  ],
  args: { tab: "connectors" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Connectors: Story = {};

export const Repositories: Story = {
  args: { tab: "repositories" },
};

export const WorkspacePool: Story = {
  args: { tab: "workspace-pool" },
};

export const McpAccess: Story = {
  args: { tab: "mcp-access" },
};

export const PortugueseBrazil: Story = {
  args: { tab: "workspace-preferences" },
  parameters: { locale: "pt-BR" },
};

export const Narrow: Story = {
  args: { tab: "code-scopes" },
  decorators: [
    (Story) => (
      <div className="flex h-[520px] w-[420px] bg-surface-1">
        <Story />
      </div>
    ),
  ],
};
