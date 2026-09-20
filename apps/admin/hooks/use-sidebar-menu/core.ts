/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// plane imports
import {
  BoxesOutline,
  CheckDoneOutline,
  DollarOutline,
  FlagOutline,
  ImageOutline,
  LockOutline,
  MailOutline,
  ServerOutline,
  SettingsOutline,
  UsageOutline,
  WorkspaceOutline,
} from "@makeplane/propel/icons";
// types
import type { TSidebarMenuItem } from "./types";

export type TCoreSidebarMenuKey =
  | "general"
  | "email"
  | "workspace"
  | "authentication"
  | "image"
  | "providers"
  | "model-catalog"
  | "pricing"
  | "usage"
  | "evals"
  | "feature-flags";

export const coreSidebarMenuLinks: Record<TCoreSidebarMenuKey, TSidebarMenuItem> = {
  general: {
    Icon: SettingsOutline,
    name: "General",
    description: "Identify your instances and get key details.",
    href: `/general/`,
  },
  email: {
    Icon: MailOutline,
    name: "Email",
    description: "Configure your SMTP controls.",
    href: `/email/`,
  },
  workspace: {
    Icon: WorkspaceOutline,
    name: "Workspaces",
    description: "Manage all workspaces on this instance.",
    href: `/workspace/`,
  },
  authentication: {
    Icon: LockOutline,
    name: "Authentication",
    description: "Configure authentication modes.",
    href: `/authentication/`,
  },
  image: {
    Icon: ImageOutline,
    name: "Images in Plane",
    description: "Allow third-party image libraries.",
    href: `/image/`,
  },
  providers: {
    Icon: ServerOutline,
    name: "Providers",
    description: "Credentials and status per model provider.",
    href: `/providers/`,
  },
  "model-catalog": {
    Icon: BoxesOutline,
    name: "Model Catalog",
    description: "Every model this instance knows, and what it may be used for.",
    href: `/model-catalog/`,
  },
  pricing: {
    Icon: DollarOutline,
    name: "Pricing & Markup",
    description: "What each model costs and what you charge for it.",
    href: `/pricing/`,
  },
  usage: {
    Icon: UsageOutline,
    name: "Usage",
    description: "Metered calls across every workspace on this instance.",
    href: `/usage/`,
  },
  evals: {
    Icon: CheckDoneOutline,
    name: "Eval results",
    description: "How the agents score on the eval suite.",
    href: `/evals/`,
  },
  "feature-flags": {
    Icon: FlagOutline,
    name: "Feature flags",
    description: "Turn instance features on and off.",
    href: `/feature-flags/`,
  },
};
