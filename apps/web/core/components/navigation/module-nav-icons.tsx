/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import {
  AddPageOutline,
  AgentOutline,
  AnalyticsOutline,
  ApproverOutline,
  ForumOutline,
  ImportsOutline,
  MemoryOutline,
  NewChatOutline,
  PagesOutline,
  PlayCircleOutline,
} from "@makeplane/propel/icons";

export const MODULE_NAV_ICONS = {
  pages: PagesOutline,
  sources: ImportsOutline,
  threads: ForumOutline,
  agents: AgentOutline,
  runs: PlayCircleOutline,
  review: ApproverOutline,
  memory: MemoryOutline,
  usage: AnalyticsOutline,
  new_page: AddPageOutline,
  new_thread: NewChatOutline,
} as const;
