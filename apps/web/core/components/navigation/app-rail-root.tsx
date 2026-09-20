/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";
import { observer } from "mobx-react";
import { useParams, usePathname } from "next/navigation";
import { TickOutline } from "@makeplane/propel/icons";
import { EUserPermissions, EUserPermissionsLevel } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { ContextMenu } from "@plane/propel/context-menu";
import { cn } from "@plane/utils";
// components
import { AppSidebarItem } from "@/components/sidebar/sidebar-item";
// hooks
import { useAppRailPreferences } from "@/hooks/use-navigation-preferences";
import { useUserPermissions } from "@/hooks/store/user";
import { getActiveModule, getModuleRootHref, useAppRailVisibility } from "@/lib/app-rail";
import type { TAppModule } from "@/lib/app-rail";
// local imports
import { MODULE_ICONS } from "./module-icons";

const RAIL_MODULES: Exclude<TAppModule, "settings">[] = ["work", "wiki", "ia"];
const SettingsIcon = MODULE_ICONS.settings;

export const AppRailRoot = observer(() => {
  // router
  const { workspaceSlug } = useParams();
  const pathname = usePathname();
  const { t } = useTranslation();
  // preferences
  const { preferences, updateDisplayMode } = useAppRailPreferences();
  const { isCollapsed, toggleAppRail } = useAppRailVisibility();
  const { allowPermissions } = useUserPermissions();
  // derived values
  const slug = workspaceSlug?.toString() ?? "";
  const activeModule = getActiveModule(pathname, slug);
  const canOpenWorkspaceSettings = allowPermissions(
    [EUserPermissions.ADMIN, EUserPermissions.MEMBER],
    EUserPermissionsLevel.WORKSPACE,
    slug
  );
  const settingsHref = canOpenWorkspaceSettings ? `/${slug}/settings` : `/${slug}/settings/account/general`;
  const showLabel = preferences.displayMode === "icon_with_label";
  const railWidth = showLabel ? "3.75rem" : "3rem";

  return (
    <div
      className="z-[26] h-full flex-shrink-0 bg-canvas transition-[width] duration-200 ease-out"
      style={{ width: railWidth }}
    >
      <ContextMenu>
        <ContextMenu.Trigger className="h-full">
          <nav aria-label={t("app_rail.label")} className="flex h-full flex-col justify-between gap-4 px-2 py-3">
            <div
              className={cn("flex flex-col", {
                "gap-4": showLabel,
                "gap-3": !showLabel,
              })}
            >
              {RAIL_MODULES.map((module) => {
                const Icon = MODULE_ICONS[module];
                return (
                  <AppSidebarItem
                    key={module}
                    item={{
                      label: t(`app_rail.${module}`),
                      icon: <Icon className="size-5" />,
                      href: getModuleRootHref(slug, module),
                      isActive: activeModule === module,
                      showLabel,
                    }}
                  />
                );
              })}
              <div role="separator" className="mx-2 border-t border-strong" />
              <AppSidebarItem
                item={{
                  label: t("app_rail.settings"),
                  icon: <SettingsIcon className="size-5" />,
                  href: settingsHref,
                  isActive: activeModule === "settings",
                  showLabel,
                }}
              />
            </div>
          </nav>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content positionerClassName="z-30" className="outline-none">
            <ContextMenu.Item onClick={() => updateDisplayMode("icon_only")}>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-11">Icon only</span>
                {preferences.displayMode === "icon_only" && <TickOutline className="size-3.5" />}
              </div>
            </ContextMenu.Item>
            <ContextMenu.Item onClick={() => updateDisplayMode("icon_with_label")}>
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-11">Icon with name</span>
                {preferences.displayMode === "icon_with_label" && <TickOutline className="size-3.5" />}
              </div>
            </ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item onClick={toggleAppRail}>
              <span className="text-11">{isCollapsed ? "Dock App Rail" : "Undock App Rail"}</span>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu>
    </div>
  );
});
