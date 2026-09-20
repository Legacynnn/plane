/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { ComponentProps } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";
import { PriorityDropdown } from "./priority";

type TProps = ComponentProps<typeof PriorityDropdown>;

function Controlled(args: TProps) {
  const [value, setValue] = useState(args.value);
  return (
    <PriorityDropdown
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
        args.onChange(val);
      }}
    />
  );
}

const meta: Meta<typeof PriorityDropdown> = {
  title: "Primitives/Dropdowns/PriorityDropdown",
  component: PriorityDropdown,
  decorators: [
    (Story) => (
      <div className="min-h-[360px] bg-surface-1 p-6">
        <div className="h-7 w-fit">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    buttonVariant: "border-with-text",
    value: "high",
    onChange: fn(),
  },
  render: (args) => <Controlled {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BorderWithText: Story = {};

export const Empty: Story = {
  args: { value: null },
};

export const BackgroundWithText: Story = {
  args: { buttonVariant: "background-with-text", value: "medium" },
};

export const TransparentWithoutText: Story = {
  args: { buttonVariant: "transparent-without-text", value: "urgent" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));
  },
};
