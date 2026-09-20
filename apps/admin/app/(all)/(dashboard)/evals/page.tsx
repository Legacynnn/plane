/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { UpcomingSection } from "@/components/common/upcoming-section";
import type { Route } from "./+types/page";

export const meta: Route.MetaFunction = () => [{ title: "Eval results - God Mode" }];

export default function EvalResultsPage() {
  return (
    <UpcomingSection
      section="evals"
      summary="Scores from the eval suite per agent and per model, so a model swap can be judged before it ships."
    />
  );
}
