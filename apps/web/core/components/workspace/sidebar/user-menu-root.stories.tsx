/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { runInAction } from "mobx";
import { userEvent, within } from "storybook/test";
import type { TStoreSetup } from "../../../../.storybook/decorators";
import { UserMenuRoot } from "./user-menu-root";

const clearUserName: TStoreSetup = (store) =>
  runInAction(() => {
    if (store.user.data) store.user.data = { ...store.user.data, display_name: "", first_name: "", last_name: "" };
  });

const meta: Meta<typeof UserMenuRoot> = {
  title: "Shell/UserMenuRoot",
  component: UserMenuRoot,
  decorators: [
    (Story) => (
      <div className="flex h-[400px] w-[360px] items-start justify-end bg-canvas p-2">
        <div className="flex size-8 items-center justify-center rounded-md hover:bg-layer-1-hover">
          <Story />
        </div>
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

export const NoDisplayName: Story = {
  play: openMenu,
  parameters: { store: clearUserName },
};

export const PortugueseBrazil: Story = { play: openMenu, parameters: { locale: "pt-BR" } };
