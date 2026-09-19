/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { IaSidebar } from "./root";

const meta: Meta<typeof IaSidebar> = {
  title: "IA sidebar/IaSidebar",
  component: IaSidebar,
  parameters: { route: { path: "/acme/ia" } },
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

export const Default: Story = {};

export const RunsActive: Story = { parameters: { route: { path: "/acme/ia/runs" } } };

export const ReviewActive: Story = { parameters: { route: { path: "/acme/ia/review" } } };

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="flex h-[640px] w-[240px] flex-col bg-surface-1 py-3">
        <Story />
      </div>
    ),
  ],
};

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
