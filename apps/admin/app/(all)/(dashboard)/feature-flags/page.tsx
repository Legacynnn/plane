/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { UpcomingSection } from "@/components/common/upcoming-section";
import type { Route } from "./+types/page";

export const meta: Route.MetaFunction = () => [{ title: "Feature flags - God Mode" }];

export default function FeatureFlagsPage() {
  return (
    <UpcomingSection
      section="feature-flags"
      summary="Instance-wide switches for features that are not ready for every workspace yet."
    />
  );
}
