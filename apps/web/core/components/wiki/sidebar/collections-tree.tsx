/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";
import { useState } from "react";
import { ChevronRightOutline, FileOutline, FolderOutline } from "@makeplane/propel/icons";
import { useTranslation } from "@plane/i18n";
import { Loader } from "@plane/ui";
import { cn } from "@plane/utils";
import { SidebarNavItem } from "@/components/sidebar/sidebar-navigation";
import { filterAgentAuthored } from "./filter";
import type { TWikiCollection, TWikiPage } from "./types";

type Props = {
  collections?: TWikiCollection[];
  isLoading?: boolean;
  agentAuthoredOnly?: boolean;
};

function DisclosureChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <ChevronRightOutline
      className={cn("size-3 flex-shrink-0 text-placeholder transition-transform", { "rotate-90": isOpen })}
    />
  );
}

function PageBranch({ page, depth }: { page: TWikiPage; depth: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const children = page.children ?? [];
  const indent = { paddingLeft: `${depth * 0.75}rem` };

  return (
    <>
      <SidebarNavItem>
        {children.length > 0 ? (
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            className="flex min-w-0 flex-grow items-center gap-1.5"
            style={indent}
          >
            <DisclosureChevron isOpen={isOpen} />
            <FileOutline className="size-4 flex-shrink-0 text-placeholder" />
            <span className="truncate text-13 font-medium">{page.name}</span>
          </button>
        ) : (
          <span className="flex min-w-0 flex-grow items-center gap-1.5" style={indent}>
            <span className="size-3 flex-shrink-0" aria-hidden />
            <FileOutline className="size-4 flex-shrink-0 text-placeholder" />
            <span className="truncate text-13 font-medium">{page.name}</span>
          </span>
        )}
      </SidebarNavItem>
      {isOpen && children.map((child) => <PageBranch key={child.id} page={child} depth={depth + 1} />)}
    </>
  );
}

function CollectionBranch({ collection }: { collection: TWikiCollection }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <SidebarNavItem>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-grow items-center gap-1.5"
        >
          <DisclosureChevron isOpen={isOpen} />
          <FolderOutline className="size-4 flex-shrink-0" />
          <span className="truncate text-13 font-medium">{collection.name}</span>
        </button>
      </SidebarNavItem>
      {isOpen && collection.pages.map((page) => <PageBranch key={page.id} page={page} depth={1} />)}
    </>
  );
}

export function WikiCollectionsTree({ collections = [], isLoading = false, agentAuthoredOnly = false }: Props) {
  const { t } = useTranslation();
  const visible = agentAuthoredOnly ? filterAgentAuthored(collections) : collections;

  if (isLoading)
    return (
      <Loader className="w-full space-y-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          // oxlint-disable-next-line react/no-array-index-key
          <Loader.Item key={index} height="28px" />
        ))}
      </Loader>
    );

  if (visible.length === 0)
    return (
      <p className="px-2 py-1 text-13 text-placeholder">
        {t(agentAuthoredOnly ? "module_sidebar.wiki.no_agent_authored" : "module_sidebar.wiki.no_collections")}
      </p>
    );

  return (
    <div className="flex flex-col gap-0.5">
      {visible.map((collection) => (
        <CollectionBranch key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
