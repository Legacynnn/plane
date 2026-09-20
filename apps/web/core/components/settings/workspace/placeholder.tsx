/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
// plane imports
import { WORKSPACE_SETTINGS } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { EmptyStateCompact } from "@plane/propel/empty-state";
import type { TWorkspaceSettingsTabs } from "@plane/types";
import { Breadcrumbs } from "@plane/ui";
// components
import { BreadcrumbLink } from "@/components/common/breadcrumb-link";
import { PageHead } from "@/components/core/page-title";
import { SettingsContentWrapper } from "@/components/settings/content-wrapper";
import { SettingsPageHeader } from "@/components/settings/page-header";
import { WORKSPACE_SETTINGS_ICONS } from "@/components/settings/workspace/sidebar/item-icon";

type Props = {
  tab: TWorkspaceSettingsTabs;
};

export const WorkspaceSettingsPlaceholder = observer(function WorkspaceSettingsPlaceholder({ tab }: Props) {
  // translation
  const { t } = useTranslation();
  // derived values
  const settingsDetails = WORKSPACE_SETTINGS[tab];
  const Icon = WORKSPACE_SETTINGS_ICONS[tab];
  const title = t(settingsDetails.i18n_label);

  return (
    <SettingsContentWrapper
      header={
        <SettingsPageHeader
          leftItem={
            <Breadcrumbs>
              <Breadcrumbs.Item
                component={<BreadcrumbLink label={title} icon={<Icon className="size-4 text-tertiary" />} />}
              />
            </Breadcrumbs>
          }
        />
      }
    >
      <PageHead title={title} />
      <EmptyStateCompact
        asset={<Icon className="size-8 text-placeholder" />}
        title={title}
        description={t(settingsDetails.i18n_label.replace(".title", ".placeholder"))}
        rootClassName="px-4"
        className="text-balance"
      />
    </SettingsContentWrapper>
  );
});
