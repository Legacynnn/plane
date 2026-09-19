/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { AgentOutline } from "@makeplane/propel/icons";
import { useTranslation } from "@plane/i18n";
import { Tooltip } from "@plane/propel/tooltip";
import { cn } from "@plane/utils";
import { MODULE_NAV_ICONS } from "@/components/navigation/module-nav-icons";
import { ModuleNavItem } from "@/components/navigation/module-nav-item";
import { SidebarAddButton } from "@/components/sidebar/add-button";
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper";
import { WIKI_NAV_ITEMS, getModuleNavHref } from "@/lib/app-rail";
import { WikiCollectionsTree } from "./collections-tree";
import type { TWikiCollection } from "./types";

type Props = {
  collections?: TWikiCollection[];
  isLoading?: boolean;
};

export function WikiSidebar({ collections, isLoading }: Props) {
  const { t } = useTranslation();
  const { workspaceSlug } = useParams();
  const [agentAuthoredOnly, setAgentAuthoredOnly] = useState(false);
  const slug = workspaceSlug?.toString() ?? "";
  const NewPageIcon = MODULE_NAV_ICONS.new_page;

  return (
    <SidebarWrapper
      title={t("app_rail.wiki")}
      quickActions={
        <SidebarAddButton
          label={
            <>
              <NewPageIcon className="size-4" />
              <span className="max-w-[145px] truncate text-13 font-medium">{t("module_sidebar.wiki.new_page")}</span>
            </>
          }
          onClick={() => {}}
          disabled
        />
      }
    >
      <div className="flex flex-col gap-0.5">
        {WIKI_NAV_ITEMS.map(({ key, path }) => {
          const Icon = MODULE_NAV_ICONS[key as keyof typeof MODULE_NAV_ICONS];
          return (
            <ModuleNavItem
              key={key}
              href={getModuleNavHref(slug, "wiki", path)}
              label={t(`module_sidebar.wiki.${key}`)}
              icon={<Icon className="size-4 flex-shrink-0" />}
            />
          );
        })}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-1 rounded-sm px-2 py-1.5">
          <span className="truncate text-13 font-semibold text-placeholder">
            {t("module_sidebar.wiki.collections")}
          </span>
          <Tooltip tooltipContent={t("module_sidebar.wiki.agent_authored")} position="top">
            <button
              type="button"
              onClick={() => setAgentAuthoredOnly((only) => !only)}
              aria-pressed={agentAuthoredOnly}
              aria-label={t("module_sidebar.wiki.agent_authored")}
              className={cn("flex-shrink-0 rounded-sm p-0.5 text-placeholder hover:bg-layer-1", {
                "bg-layer-1 text-primary": agentAuthoredOnly,
              })}
            >
              <AgentOutline className="size-3.5" />
            </button>
          </Tooltip>
        </div>
        <WikiCollectionsTree collections={collections} isLoading={isLoading} agentAuthoredOnly={agentAuthoredOnly} />
      </div>
    </SidebarWrapper>
  );
}
