/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { Outlet } from "react-router";

export default function ModuleLayout() {
  return (
    <div className="relative flex size-full overflow-hidden rounded-lg border border-subtle">
      <main className="relative flex size-full flex-col overflow-hidden bg-surface-1">
        <Outlet />
      </main>
    </div>
  );
}
