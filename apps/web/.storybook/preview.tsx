/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { Preview } from "@storybook/react-vite";
import { initPromise, setLanguage } from "@plane/i18n";
import type { TLanguage } from "@plane/i18n";
import { withMockStore, withRouter, withTranslation } from "./decorators";
import globalStyles from "@/styles/globals.css?inline";

const styleElement = document.createElement("style");
styleElement.textContent = globalStyles;
document.head.append(styleElement);

const preview: Preview = {
  decorators: [withRouter, withMockStore, withTranslation],
  loaders: [
    async ({ parameters }) => {
      await initPromise;
      await setLanguage((parameters.locale as TLanguage | undefined) ?? "en");
      return {};
    },
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default preview;
