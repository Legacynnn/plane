/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { ComponentProps } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent } from "storybook/test";
import { DateDropdown } from "./date";

type TProps = ComponentProps<typeof DateDropdown>;

function Controlled(args: TProps) {
  const [value, setValue] = useState(args.value);
  return (
    <DateDropdown
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
        args.onChange(val);
      }}
    />
  );
}

const meta: Meta<typeof DateDropdown> = {
  title: "Primitives/Dropdowns/DateDropdown",
  component: DateDropdown,
  decorators: [
    (Story) => (
      <div className="min-h-[420px] bg-surface-1 p-6">
        <div className="h-7 w-fit">
          <Story />
        </div>
      </div>
    ),
  ],
  args: {
    buttonVariant: "border-with-text",
    placeholder: "Due date",
    value: "2026-09-24",
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
  args: { buttonVariant: "background-with-text" },
};

export const TransparentWithoutText: Story = {
  args: { buttonVariant: "transparent-without-text" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector("button");
    if (trigger) await userEvent.click(trigger);
  },
};
