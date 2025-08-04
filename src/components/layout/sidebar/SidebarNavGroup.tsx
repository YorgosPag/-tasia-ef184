"use client";

import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { SidebarNavItem } from "./SidebarNavItem";
import type { NavGroupType } from "./sidebar-config";

interface SidebarNavGroupProps {
  group: NavGroupType;
  pathname: string;
  isActive: (href: string) => boolean;
  getButtonClass: (href: string) => string;
}

export function SidebarNavGroup({
  group,
  pathname,
  isActive,
  getButtonClass,
}: SidebarNavGroupProps) {
  return (
    <>
      <SidebarGroup className="px-0">
        <SidebarGroupLabel className="px-3 pb-2 pt-4 text-xs font-semibold tracking-wider text-sidebar-muted-foreground/80 uppercase flex items-center gap-2">
          <group.icon className="h-4 w-4" />
          <span className="group-data-[state=collapsed]:hidden">{group.label}</span>
        </SidebarGroupLabel>
        <div className="space-y-0.5">
          {group.items.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              getButtonClass={getButtonClass}
              showBadge={group.showBadges}
            />
          ))}
        </div>
      </SidebarGroup>
      <SidebarSeparator className="my-4" />
    </>
  );
}
