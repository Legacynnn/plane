/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "@/components/sidebar/sidebar-navigation";
import { isModuleNavItemActive } from "@/lib/app-rail";

type Props = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function ModuleNavItem({ href, label, icon }: Props) {
  const pathname = usePathname();
  const isActive = isModuleNavItemActive(pathname, href);

  return (
    <SidebarNavItem isActive={isActive}>
      <Link href={href} aria-current={isActive ? "page" : undefined} className="flex flex-grow items-center gap-1.5">
        {icon}
        <span className="truncate text-13 font-medium">{label}</span>
      </Link>
    </SidebarNavItem>
  );
}
