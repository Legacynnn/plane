/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { PROFILE_SETTINGS } from "@plane/constants";
import { useTranslation } from "@plane/i18n";
import type { TProfileSettingsTabs } from "@plane/types";
import { PageHead } from "@/components/core/page-title";
import { ProfileSettingsContent } from "@/components/settings/profile/content";
import type { Route } from "./+types/page";

function AccountSettingsPage({ params }: Route.ComponentProps) {
  const { t } = useTranslation();
  const activeTab = params.profileTabId as TProfileSettingsTabs;
  const settings = PROFILE_SETTINGS[activeTab];

  if (!settings) return null;

  return (
    <>
      <PageHead title={t(settings.i18n_label)} />
      <ProfileSettingsContent activeTab={activeTab} className="size-full" />
    </>
  );
}

export default observer(AccountSettingsPage);
