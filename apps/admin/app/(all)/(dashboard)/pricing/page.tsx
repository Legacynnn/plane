/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { UpcomingSection } from "@/components/common/upcoming-section";
import type { Route } from "./+types/page";

export const meta: Route.MetaFunction = () => [{ title: "Pricing & Markup - God Mode" }];

export default function PricingAndMarkupPage() {
  return (
    <UpcomingSection
      section="pricing"
      summary="Provider prices per model, the markup applied on top, and the manual prices for providers no price feed covers."
    />
  );
}
