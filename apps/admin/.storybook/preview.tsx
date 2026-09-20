/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Preview } from "@storybook/react-vite";
import { THEMES, withMockStore, withRouter, withTheme } from "./decorators";
import globalStyles from "@/styles/globals.css?inline";

const styleElement = document.createElement("style");
styleElement.textContent = globalStyles;
document.head.append(styleElement);

const preview: Preview = {
  decorators: [withRouter, withMockStore, withTheme],
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: { icon: "contrast", items: [...THEMES], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "fullscreen",
  },
};

export default preview;
