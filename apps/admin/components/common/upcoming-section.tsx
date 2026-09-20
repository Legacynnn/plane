/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { coreSidebarMenuLinks } from "@/hooks/use-sidebar-menu/core";
import type { TCoreSidebarMenuKey } from "@/hooks/use-sidebar-menu/core";
import { PageWrapper } from "./page-wrapper";

type TUpcomingSectionProps = {
  section: TCoreSidebarMenuKey;
  summary: string;
};

export function UpcomingSection({ section, summary }: TUpcomingSectionProps) {
  const { Icon, name, description } = coreSidebarMenuLinks[section];

  return (
    <PageWrapper header={{ title: name, description }}>
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Icon className="size-8 text-placeholder" />
        <div className="max-w-100 text-body-sm-regular text-balance text-secondary">{summary}</div>
      </div>
    </PageWrapper>
  );
}
