/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect } from "react";
import { observer } from "mobx-react";
import type { TProfileSettingsTabs } from "@plane/types";
// components
import { LogoSpinner } from "@/components/common/logo-spinner";
// hooks
import { useUserSettings } from "@/hooks/store/user";
import { useAppRouter } from "@/hooks/use-app-router";
// lib
import { getAccountSettingsHref, getAccountSettingsTab } from "@/lib/settings-nav";
import { AuthenticationWrapper } from "@/lib/wrappers/authentication-wrapper";

import type { Route } from "./+types/profile-settings";

const AccountSettingsRedirect = observer(function AccountSettingsRedirect({ tab }: { tab: TProfileSettingsTabs }) {
  // router
  const router = useAppRouter();
  // store hooks
  const { data: userSettings } = useUserSettings();
  // derived values
  const workspaceSlug =
    userSettings?.workspace?.last_workspace_slug ?? userSettings?.workspace?.fallback_workspace_slug;

  useEffect(() => {
    if (!userSettings?.id) return;
    router.replace(getAccountSettingsHref(workspaceSlug, tab));
  }, [router, tab, userSettings?.id, workspaceSlug]);

  return (
    <div className="grid size-full place-items-center">
      <LogoSpinner />
    </div>
  );
});

export default function ProfileSettings({ params }: Route.ComponentProps) {
  return (
    <AuthenticationWrapper>
      <AccountSettingsRedirect tab={getAccountSettingsTab(params["*"])} />
    </AuthenticationWrapper>
  );
}
