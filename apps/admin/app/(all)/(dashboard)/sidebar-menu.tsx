/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// plane internal packages
import { Tooltip } from "@makeplane/propel/components/tooltip";
import { cn } from "@plane/utils";
// hooks
import { useTheme } from "@/hooks/store";
import { useSidebarMenu } from "@/hooks/use-sidebar-menu";
import type { TSidebarMenuItem } from "@/hooks/use-sidebar-menu/types";

type TMenuItemProps = {
  item: TSidebarMenuItem;
  isActive: boolean;
  isSidebarCollapsed: boolean;
};

function SidebarMenuItem({ item, isActive, isSidebarCollapsed }: TMenuItemProps) {
  return (
    <div
      className={cn(
        "group flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors outline-none",
        {
          "!bg-layer-transparent-active text-primary": isActive,
          "text-secondary hover:bg-layer-transparent-hover active:bg-layer-transparent-active": !isActive,
        },
        isSidebarCollapsed ? "justify-center" : "w-[260px]"
      )}
    >
      <item.Icon className="h-4 w-4 flex-shrink-0" />
      {!isSidebarCollapsed && (
        <div className="w-full">
          <div className="text-body-xs-medium transition-colors">{item.name}</div>
          <div className="text-caption-sm-regular transition-colors">{item.description}</div>
        </div>
      )}
    </div>
  );
}

export const AdminSidebarMenu = observer(function AdminSidebarMenu() {
  // router
  const pathName = usePathname();
  // store hooks
  const { isSidebarCollapsed, toggleSidebar } = useTheme();
  // derived values
  const sidebarMenu = useSidebarMenu();

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar(!isSidebarCollapsed);
    }
  };

  return (
    <div
      className={cn("vertical-scrollbar scrollbar-sm flex h-full w-full flex-col overflow-y-scroll px-4 py-4", {
        "divide-y divide-subtle": !isSidebarCollapsed,
      })}
    >
      {sidebarMenu.map((group) => (
        <div key={group.key} className="flex flex-col gap-2.5 py-3 first:pt-0 last:pb-0">
          {!isSidebarCollapsed && <div className="px-3 text-caption-md-medium text-tertiary">{group.name}</div>}
          {group.items.map((item) => {
            const isActive = item.href === pathName || Boolean(pathName?.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={handleItemClick}>
                {isSidebarCollapsed ? (
                  <Tooltip label={item.name} side="right">
                    <div>
                      <SidebarMenuItem item={item} isActive={isActive} isSidebarCollapsed />
                    </div>
                  </Tooltip>
                ) : (
                  <SidebarMenuItem item={item} isActive={isActive} isSidebarCollapsed={false} />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
});
