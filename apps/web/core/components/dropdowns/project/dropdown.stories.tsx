/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { ComponentProps } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent } from "storybook/test";
import { ProjectDropdown } from "./dropdown";

type TArgs = Omit<ComponentProps<typeof ProjectDropdown>, "multiple" | "value" | "onChange"> & {
  multiple: boolean;
  value: string | string[] | null;
  onChange: (val: string | string[] | null) => void;
};

function Controlled({ multiple, value, onChange, ...rest }: TArgs) {
  const [single, setSingle] = useState(typeof value === "string" ? value : null);
  const [many, setMany] = useState(Array.isArray(value) ? value : []);
  if (multiple)
    return (
      <ProjectDropdown
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
    <ProjectDropdown
      {...rest}
      multiple={false}
      value={single}
      onChange={(val: string) => {
        setSingle(val);
        onChange(val);
      }}
    />
  );
}

const meta: Meta<TArgs> = {
  title: "Primitives/Dropdowns/ProjectDropdown",
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
    placeholder: "Project",
    multiple: false,
    value: "p-web",
    onChange: fn(),
  },
  render: (args) => <Controlled {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Empty: Story = {
  args: { multiple: false, value: null },
};

export const Multiple: Story = {
  args: { multiple: true, value: ["p-web", "p-api"], placeholder: "Projects" },
};

export const BackgroundWithText: Story = {
  args: { buttonVariant: "background-with-text", value: "p-design" },
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
