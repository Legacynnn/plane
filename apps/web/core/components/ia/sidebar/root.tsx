/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";
import { useParams } from "next/navigation";
import { useTranslation } from "@plane/i18n";
import { MODULE_NAV_ICONS } from "@/components/navigation/module-nav-icons";
import { ModuleNavItem } from "@/components/navigation/module-nav-item";
import { SidebarAddButton } from "@/components/sidebar/add-button";
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper";
import { IA_NAV_ITEMS, getModuleNavHref } from "@/lib/app-rail";

export function IaSidebar() {
  const { t } = useTranslation();
  const { workspaceSlug } = useParams();
  const slug = workspaceSlug?.toString() ?? "";
  const NewThreadIcon = MODULE_NAV_ICONS.new_thread;

  return (
    <SidebarWrapper
      title={t("app_rail.ia")}
      quickActions={
        <SidebarAddButton
          label={
            <>
              <NewThreadIcon className="size-4" />
              <span className="max-w-[145px] truncate text-13 font-medium">{t("module_sidebar.ia.new_thread")}</span>
            </>
          }
          onClick={() => {}}
          disabled
        />
      }
    >
      <div className="flex flex-col gap-0.5">
        {IA_NAV_ITEMS.map(({ key, path }) => {
          const Icon = MODULE_NAV_ICONS[key as keyof typeof MODULE_NAV_ICONS];
          return (
            <ModuleNavItem
              key={key}
              href={getModuleNavHref(slug, "ia", path)}
              label={t(`module_sidebar.ia.${key}`)}
              icon={<Icon className="size-4 flex-shrink-0" />}
            />
          );
        })}
      </div>
    </SidebarWrapper>
  );
}
