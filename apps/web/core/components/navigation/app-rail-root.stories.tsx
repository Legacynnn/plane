/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppRailVisibilityProvider } from "@/lib/app-rail";
import { AppRailRoot } from "./app-rail-root";

const setDisplayMode = (displayMode: "icon_only" | "icon_with_label") => () => {
  localStorage.setItem("app_rail_preferences", JSON.stringify({ displayMode }));
  return () => localStorage.removeItem("app_rail_preferences");
};

const meta: Meta<typeof AppRailRoot> = {
  title: "Navigation/AppRailRoot",
  component: AppRailRoot,
  decorators: [
    (Story) => (
      <AppRailVisibilityProvider isEnabled>
        <div className="flex h-[480px] bg-canvas">
          <Story />
        </div>
      </AppRailVisibilityProvider>
    ),
  ],
  beforeEach: setDisplayMode("icon_with_label"),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Work: Story = { parameters: { route: { path: "/acme/projects/9f1c/issues/" } } };

export const Wiki: Story = { parameters: { route: { path: "/acme/wiki/" } } };

export const IA: Story = { parameters: { route: { path: "/acme/ia/" } } };

export const Settings: Story = { parameters: { route: { path: "/acme/settings/members/" } } };

export const Inbox: Story = { parameters: { route: { path: "/acme/notifications/" } } };

export const IconOnly: Story = {
  parameters: { route: { path: "/acme/" } },
  beforeEach: setDisplayMode("icon_only"),
};

export const LongestLabels: Story = {
  parameters: { route: { path: "/acme/settings/" }, locale: "pt-BR" },
};

export const Dark: Story = { parameters: { route: { path: "/acme/wiki/" }, theme: "dark" } };
