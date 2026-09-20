/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarLayoutLoader } from "./layouts/calendar-layout-loader";
import { KanbanLayoutLoader } from "./layouts/kanban-layout-loader";
import { ListLayoutLoader } from "./layouts/list-layout-loader";
import { SpreadsheetLayoutLoader } from "./layouts/spreadsheet-layout-loader";
import { NotificationsLoader } from "./notification-loader";
import { ProjectsLoader } from "./projects-loader";

const meta: Meta = {
  title: "Primitives/Loaders",
  decorators: [
    (Story) => (
      <div className="flex h-[640px] w-full flex-col overflow-hidden bg-surface-1 p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Projects: Story = {
  render: () => <ProjectsLoader />,
};

export const Notifications: Story = {
  render: () => (
    <div className="w-[360px]">
      <NotificationsLoader />
    </div>
  ),
};

export const List: Story = {
  render: () => <ListLayoutLoader />,
};

export const Kanban: Story = {
  render: () => <KanbanLayoutLoader />,
};

export const Spreadsheet: Story = {
  render: () => <SpreadsheetLayoutLoader />,
};

export const Calendar: Story = {
  render: () => <CalendarLayoutLoader />,
};
