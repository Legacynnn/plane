/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IPowerKCommandRegistry } from "./registry";
import { ShortcutHandler } from "./shortcut-handler";
import type { TPowerKCommandConfig, TPowerKContext } from "./types";

const makeCommand = (overrides: Partial<TPowerKCommandConfig>): TPowerKCommandConfig =>
  ({
    id: "toggle_top_nav_search",
    group: "miscellaneous",
    type: "action",
    i18n_title: "toggle",
    action: vi.fn(),
    modifierShortcut: "cmd+/",
    closeOnSelect: true,
    isVisible: () => true,
    isEnabled: () => true,
    ...overrides,
  }) as TPowerKCommandConfig;

const makeHandler = (command: TPowerKCommandConfig) => {
  const registry = {
    findByModifierShortcut: (_ctx: TPowerKContext, shortcut: string) =>
      shortcut === command.modifierShortcut ? command : undefined,
    findByShortcut: () => undefined,
    findByKeySequence: () => undefined,
  } as unknown as IPowerKCommandRegistry;
  return new ShortcutHandler(registry, () => ({}) as TPowerKContext, vi.fn());
};

const keydown = (target: EventTarget) => {
  const event = new KeyboardEvent("keydown", { key: "/", metaKey: true, cancelable: true });
  Object.defineProperty(event, "target", { value: target });
  return event;
};

describe("ShortcutHandler modifier shortcuts", () => {
  let input: HTMLInputElement;
  let outside: HTMLDivElement;

  beforeEach(() => {
    input = document.createElement("input");
    outside = document.createElement("div");
  });

  it("runs a shortcut when focus is outside an input", () => {
    const command = makeCommand({});
    makeHandler(command).handleKeyDown(keydown(outside));
    expect(command.type === "action" && command.action).toHaveBeenCalled();
  });

  it("skips a shortcut while typing in an input", () => {
    const command = makeCommand({});
    makeHandler(command).handleKeyDown(keydown(input));
    expect(command.type === "action" && command.action).not.toHaveBeenCalled();
  });

  it("runs a shortcut that opts in with allowWhileTyping", () => {
    const command = makeCommand({ allowWhileTyping: true });
    makeHandler(command).handleKeyDown(keydown(input));
    expect(command.type === "action" && command.action).toHaveBeenCalled();
  });

  it("prevents the browser default when it runs", () => {
    const command = makeCommand({ allowWhileTyping: true });
    const event = keydown(input);
    makeHandler(command).handleKeyDown(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
