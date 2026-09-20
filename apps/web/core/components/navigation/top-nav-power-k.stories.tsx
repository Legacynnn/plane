/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { observer } from "mobx-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useProjectsAppPowerKCommands } from "@/components/power-k/config/commands";
import type { TPowerKContext } from "@/components/power-k/core/types";
import { GlobalShortcutsProvider } from "@/components/power-k/global-shortcuts";
import { useAppRouter } from "@/hooks/use-app-router";
import { TopNavPowerK } from "./top-nav-power-k";

const ShortcutHarness = observer(function ShortcutHarness({ children }: { children: React.ReactNode }) {
  const commands = useProjectsAppPowerKCommands();
  const router = useAppRouter();
  const context = {
    currentUserId: undefined,
    activeCommand: null,
    activeContext: null,
    shouldShowContextBasedActions: false,
    setShouldShowContextBasedActions: () => {},
    params: { workspaceSlug: "acme", projectId: undefined },
    router,
    closePalette: () => {},
    setActiveCommand: () => {},
    setActivePage: () => {},
  } as unknown as TPowerKContext;
  return (
    <>
      <GlobalShortcutsProvider context={context} commands={commands} />
      {children}
    </>
  );
});

const meta: Meta<typeof TopNavPowerK> = {
  title: "Shell/TopNavPowerK",
  component: TopNavPowerK,
  parameters: { route: { path: "/acme/" } },
  decorators: [
    (Story) => (
      <ShortcutHarness>
        <div className="flex h-[420px] w-[720px] justify-center bg-canvas pt-4">
          <Story />
        </div>
      </ShortcutHarness>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("textbox"));
  },
};

export const OpenedByShortcut: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.keyboard("{Meta>}/{/Meta}");
    await waitFor(() => expect(canvas.getByRole("textbox")).toHaveFocus());
  },
};

export const ClosedByShortcutWhileTyping: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.keyboard("{Meta>}/{/Meta}");
    await waitFor(() => expect(input).not.toHaveFocus());
  },
};

export const PortugueseBrazil: Story = { parameters: { locale: "pt-BR" } };
