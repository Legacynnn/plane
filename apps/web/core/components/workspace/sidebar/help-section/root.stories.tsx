/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import { HelpMenuRoot } from "./root";

const meta: Meta<typeof HelpMenuRoot> = {
  title: "Shell/HelpMenuRoot",
  component: HelpMenuRoot,
  decorators: [
    (Story) => (
      <div className="flex h-[360px] w-[320px] items-start justify-end bg-canvas p-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const openMenu: Story["play"] = async ({ canvasElement }) => {
  await userEvent.click(within(canvasElement).getAllByRole("button")[0]);
};

export const Default: Story = {};

export const Open: Story = { play: openMenu };

export const PortugueseBrazil: Story = { play: openMenu, parameters: { locale: "pt-BR" } };
