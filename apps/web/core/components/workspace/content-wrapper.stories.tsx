/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModulePlaceholder } from "@/components/navigation/module-placeholder";
import { AppRailVisibilityProvider } from "@/lib/app-rail";
import { WorkspaceContentWrapper } from "./content-wrapper";

const meta: Meta<typeof WorkspaceContentWrapper> = {
  title: "Shell/WorkspaceContentWrapper",
  component: WorkspaceContentWrapper,
  decorators: [
    (Story) => (
      <AppRailVisibilityProvider isEnabled>
        <div className="h-[720px] w-[1280px] bg-canvas">
          <Story />
        </div>
      </AppRailVisibilityProvider>
    ),
  ],
  args: {
    children: (
      <div className="flex size-full items-center justify-center rounded-lg border border-subtle bg-surface-1">
        <ModulePlaceholder module="wiki" />
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FullShellWork: Story = { parameters: { route: { path: "/acme/" } } };

export const FullShellWiki: Story = { parameters: { route: { path: "/acme/wiki/" } } };

export const FullShellSettings: Story = { parameters: { route: { path: "/acme/settings/" } } };

export const FullShellPortugueseBrazil: Story = { parameters: { route: { path: "/acme/wiki/" }, locale: "pt-BR" } };
