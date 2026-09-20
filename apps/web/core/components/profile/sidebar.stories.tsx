/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { IUserProfileProjectSegregation } from "@plane/types";
import { ProfileSidebar } from "./sidebar";

const userProjectsData: IUserProfileProjectSegregation = {
  project_data: [],
  user_data: {
    avatar_url: "",
    cover_image_url: "",
    display_name: "ana",
    first_name: "Ana",
    last_name: "Souza",
    date_joined: new Date("2025-02-11T00:00:00.000Z"),
    user_timezone: "America/Sao_Paulo",
  },
};

const meta: Meta<typeof ProfileSidebar> = {
  title: "Settings/ProfileSidebar",
  component: ProfileSidebar,
  args: { userProjectsData },
  parameters: { route: { path: "/acme/profile/u-ana/" } },
  decorators: [
    (Story) => (
      <div className="flex h-[640px] justify-end bg-canvas">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { userProjectsData: undefined } };

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
