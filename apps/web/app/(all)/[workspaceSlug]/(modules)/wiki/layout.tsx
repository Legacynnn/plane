/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { Outlet } from "react-router";
import { ModuleSidebarShell } from "@/components/navigation/module-sidebar-shell";
import { WikiSidebar } from "@/components/wiki/sidebar/root";

export default function WikiLayout() {
  return (
    <>
      <ModuleSidebarShell>
        <WikiSidebar />
      </ModuleSidebarShell>
      <main className="relative flex size-full flex-col overflow-hidden bg-surface-1">
        <Outlet />
      </main>
    </>
  );
}
