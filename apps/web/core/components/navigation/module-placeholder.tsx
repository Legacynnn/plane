/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useTranslation } from "@plane/i18n";
import { EmptyStateCompact } from "@plane/propel/empty-state";
import { PageHead } from "@/components/core/page-title";
import { MODULE_ICONS } from "./module-icons";

type Props = {
  module: "wiki" | "ia";
};

export function ModulePlaceholder({ module }: Props) {
  const { t } = useTranslation();
  const Icon = MODULE_ICONS[module];
  const title = t(`app_rail.${module}`);

  return (
    <>
      <PageHead title={title} />
      <EmptyStateCompact
        asset={<Icon className="size-8 text-placeholder" />}
        title={title}
        description={t(`app_rail.placeholder.${module}`)}
        rootClassName="px-4"
        className="text-balance"
      />
    </>
  );
}
