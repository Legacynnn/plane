/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { UpcomingSection } from "@/components/common/upcoming-section";
import type { Route } from "./+types/page";

export const meta: Route.MetaFunction = () => [{ title: "Usage - God Mode" }];

export default function UsagePage() {
  return (
    <UpcomingSection
      section="usage"
      summary="Metered calls across every workspace: model, tokens, cost and credits, with the trace that caused them."
    />
  );
}
