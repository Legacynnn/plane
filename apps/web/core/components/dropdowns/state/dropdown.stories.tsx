/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { ComponentProps } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent } from "storybook/test";
import { STATE_PROJECT_ID } from "../../../../.storybook/fixtures";
import { StateDropdown } from "./dropdown";

type TProps = ComponentProps<typeof StateDropdown>;

function Controlled(args: TProps) {
  const [value, setValue] = useState(args.value);
  return (
    <StateDropdown
      {...args}
      value={value}
      onChange={(val) => {
        setValue(val);
        args.onChange(val);
      }}
    />
  );
}

const meta: Meta<typeof StateDropdown> = {
  title: "Primitives/Dropdowns/StateDropdown",
  component: StateDropdown,
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
    projectId: STATE_PROJECT_ID,
    value: "s-progress",
    onChange: fn(),
  },
  render: (args) => <Controlled {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BorderWithText: Story = {};

export const Empty: Story = {
  args: { value: null, showDefaultState: false },
};

export const BackgroundWithText: Story = {
  args: { buttonVariant: "background-with-text", value: "s-done" },
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
