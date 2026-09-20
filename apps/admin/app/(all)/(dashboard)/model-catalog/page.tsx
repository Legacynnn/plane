/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { UpcomingSection } from "@/components/common/upcoming-section";
import type { Route } from "./+types/page";

export const meta: Route.MetaFunction = () => [{ title: "Model Catalog - God Mode" }];

export default function ModelCatalogPage() {
  return (
    <UpcomingSection
      section="model-catalog"
      summary="Every provider model with its capabilities and status — pending, active, deprecated or disabled — kept current by the daily sync."
    />
  );
}
