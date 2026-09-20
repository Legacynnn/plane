/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { WikiCollectionsTree } from "./collections-tree";
import { WIKI_COLLECTIONS } from "../../../../.storybook/fixtures";

const meta: Meta<typeof WikiCollectionsTree> = {
  title: "Wiki sidebar/WikiCollectionsTree",
  component: WikiCollectionsTree,
  decorators: [
    (Story) => (
      <div className="flex h-[520px] w-[260px] flex-col overflow-y-auto bg-surface-1 px-3 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { collections: WIKI_COLLECTIONS } };

export const Empty: Story = { args: { collections: [] } };

export const Loading: Story = { args: { isLoading: true } };

export const AgentAuthoredOnly: Story = { args: { collections: WIKI_COLLECTIONS, agentAuthoredOnly: true } };

export const AgentAuthoredEmpty: Story = {
  args: {
    collections: [{ id: "a", name: "Handbook", pages: [{ id: "p", name: "Onboarding" }] }],
    agentAuthoredOnly: true,
  },
};

export const PortugueseBrazil: Story = { args: { collections: [] }, parameters: { locale: "pt-BR" } };
