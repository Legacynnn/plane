/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { Outlet } from "react-router";
import { IaSidebar } from "@/components/ia/sidebar/root";
import { ModuleSidebarShell } from "@/components/navigation/module-sidebar-shell";

export default function IaLayout() {
  return (
    <>
      <ModuleSidebarShell>
        <IaSidebar />
      </ModuleSidebarShell>
      <main className="relative flex size-full flex-col overflow-hidden bg-surface-1">
        <Outlet />
      </main>
    </>
  );
}
