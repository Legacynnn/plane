/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { usePathname } from "next/navigation";
import { useParams } from "react-router";
import { GROUPED_ACCOUNT_SETTINGS, PROFILE_SETTINGS_CATEGORIES } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import { SettingsSidebarItem } from "@/components/settings/sidebar/item";
import { PROFILE_SETTINGS_ICONS } from "@/components/settings/profile/sidebar/item-icon";
import { getWorkspaceSettingsHref, isWorkspaceSettingsItemActive } from "@/lib/settings-nav";

export const AccountSettingsSidebarItemCategories = observer(function AccountSettingsSidebarItemCategories() {
  const { workspaceSlug } = useParams();
  const pathname = usePathname();
  const { t } = useTranslation();

  const items = PROFILE_SETTINGS_CATEGORIES.flatMap((category) => GROUPED_ACCOUNT_SETTINGS[category]);

  return (
    <div className="shrink-0 py-3">
      <div className="p-2 text-caption-md-medium text-tertiary capitalize">{t("common.your_profile")}</div>
      <div className="flex flex-col">
        {items.map((item) => (
          <SettingsSidebarItem
            key={item.key}
            as="link"
            href={getWorkspaceSettingsHref(workspaceSlug ?? "", item.href)}
            isActive={isWorkspaceSettingsItemActive(pathname, workspaceSlug ?? "", item.href)}
            icon={PROFILE_SETTINGS_ICONS[item.key]}
            label={t(item.i18n_label)}
          />
        ))}
      </div>
    </div>
  );
});
