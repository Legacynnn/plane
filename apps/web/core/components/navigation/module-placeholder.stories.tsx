/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModulePlaceholder } from "./module-placeholder";

const meta: Meta<typeof ModulePlaceholder> = {
  title: "Navigation/ModulePlaceholder",
  component: ModulePlaceholder,
  decorators: [
    (Story) => (
      <div className="flex h-[480px] bg-surface-1">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Wiki: Story = { args: { module: "wiki" } };

export const IA: Story = { args: { module: "ia" } };
