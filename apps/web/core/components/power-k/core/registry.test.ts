/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { describe, expect, it } from "vitest";
import { findShortcutClashes } from "./registry";
import type { TPowerKCommandConfig } from "./types";

const command = (id: string, shortcuts: Partial<TPowerKCommandConfig>): TPowerKCommandConfig =>
  ({
    id,
    group: "miscellaneous",
    type: "action",
    i18n_title: id,
    action: () => {},
    closeOnSelect: true,
    ...shortcuts,
  }) as TPowerKCommandConfig;

describe("findShortcutClashes", () => {
  it("finds two commands claiming one chord", () => {
    const clashes = findShortcutClashes([
      command("open_keyboard_shortcuts", { modifierShortcut: "cmd+/" }),
      command("toggle_top_nav_search", { modifierShortcut: "cmd+/" }),
    ]);
    expect(clashes).toEqual(["cmd+/: open_keyboard_shortcuts and toggle_top_nav_search"]);
  });

  it("ignores case when comparing", () => {
    expect(
      findShortcutClashes([command("a", { modifierShortcut: "Cmd+B" }), command("b", { modifierShortcut: "cmd+b" })])
    ).toHaveLength(1);
  });

  it("compares single keys and sequences too", () => {
    expect(
      findShortcutClashes([command("a", { keySequence: "gm" }), command("b", { keySequence: "gm" })])
    ).toHaveLength(1);
  });

  it("says nothing when every shortcut is distinct", () => {
    expect(
      findShortcutClashes([
        command("a", { modifierShortcut: "cmd+/" }),
        command("b", { modifierShortcut: "cmd+shift+/" }),
        command("c", { shortcut: "c" }),
      ])
    ).toEqual([]);
  });
});
