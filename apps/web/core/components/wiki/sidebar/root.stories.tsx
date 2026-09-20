/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { WIKI_COLLECTIONS } from "../../../../.storybook/fixtures";
import { WikiSidebar } from "./root";

const meta: Meta<typeof WikiSidebar> = {
  title: "Wiki sidebar/WikiSidebar",
  component: WikiSidebar,
  parameters: { route: { path: "/acme/wiki" } },
  decorators: [
    (Story) => (
      <div className="flex h-[640px] w-[260px] flex-col bg-surface-1 py-3">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithCollections: Story = { args: { collections: WIKI_COLLECTIONS } };

export const Loading: Story = { args: { isLoading: true } };

export const SourcesActive: Story = {
  args: { collections: WIKI_COLLECTIONS },
  parameters: { route: { path: "/acme/wiki/sources" } },
};

export const Narrow: Story = {
  args: { collections: WIKI_COLLECTIONS },
  decorators: [
    (Story) => (
      <div className="flex h-[640px] w-[240px] flex-col bg-surface-1 py-3">
        <Story />
      </div>
    ),
  ],
};

export const PortugueseBrazil: Story = { args: { collections: WIKI_COLLECTIONS }, parameters: { locale: "pt-BR" } };
