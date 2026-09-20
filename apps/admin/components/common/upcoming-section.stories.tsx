/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { UpcomingSection } from "./upcoming-section";

const meta: Meta<typeof UpcomingSection> = {
  title: "God Mode/UpcomingSection",
  component: UpcomingSection,
  args: {
    section: "usage",
    summary: "Metered calls across every workspace: model, tokens, cost and credits, with the trace that caused them.",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Usage: Story = {};

export const Pricing: Story = {
  args: { section: "pricing", summary: "Per-model price, the markup applied on top, and when pricing last synced." },
};
