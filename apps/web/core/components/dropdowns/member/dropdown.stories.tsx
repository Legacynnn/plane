/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { ComponentProps } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent } from "storybook/test";
import { MemberDropdown } from "./dropdown";

type TArgs = Omit<ComponentProps<typeof MemberDropdown>, "multiple" | "value" | "onChange"> & {
  multiple: boolean;
  value: string | string[] | null;
  onChange: (val: string | string[] | null) => void;
};

function Controlled({ multiple, value, onChange, ...rest }: TArgs) {
  const [single, setSingle] = useState(typeof value === "string" ? value : null);
  const [many, setMany] = useState(Array.isArray(value) ? value : []);
  if (multiple)
    return (
      <MemberDropdown
        {...rest}
        multiple
        value={many}
        onChange={(val: string[]) => {
          setMany(val);
          onChange(val);
        }}
      />
    );
  return (
    <MemberDropdown
      {...rest}
      multiple={false}
      value={single}
      onChange={(val: string | null) => {
        setSingle(val);
        onChange(val);
      }}
    />
  );
}

const meta: Meta<TArgs> = {
  title: "Primitives/Dropdowns/MemberDropdown",
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
    placeholder: "Assignee",
    projectId: undefined,
    showUserDetails: true,
    multiple: false,
    value: "u-ben",
    onChange: fn(),
  },
  render: (args) => <Controlled {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const SingleEmpty: Story = {
  args: { multiple: false, value: null },
};

export const Multiple: Story = {
  args: { multiple: true, value: ["u-ana", "u-chloe", "u-diego"], placeholder: "Assignees" },
};

export const MultipleEmpty: Story = {
  args: { multiple: true, value: [], placeholder: "Assignees" },
};

export const BackgroundWithText: Story = {
  args: { buttonVariant: "background-with-text" },
};

export const TransparentWithoutText: Story = {
  args: { buttonVariant: "transparent-without-text", multiple: true, value: ["u-ana", "u-ben"] },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Open: Story = {
  args: { multiple: true, value: ["u-ana", "u-chloe"], placeholder: "Assignees" },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector("button");
    if (trigger) await userEvent.click(trigger);
  },
};
