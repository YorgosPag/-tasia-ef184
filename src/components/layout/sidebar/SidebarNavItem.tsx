"use client";

import * as React from "react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import type { NavItemType } from "./sidebar-config";

interface SidebarNavItemProps {
  item: NavItemType;
  isActive: boolean;
  getButtonClass: (href: string) => string;
  showBadge?: boolean;
}

export function SidebarNavItem({
  item,
  isActive,
  getButtonClass,
  showBadge = true,
}: SidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        href={item.href}
        className={getButtonClass(item.href)}
        icon={item.icon}
        tooltip={`${item.label} - ${item.description}`}
        isActive={isActive}
      >
        <div className="flex items-center justify-between w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <item.icon className="h-4 w-4 shrink-0 transition-colors" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate leading-none">{item.label}</span>
              <span className="text-xs text-sidebar-muted-foreground/70 truncate mt-0.5 group-data-[state=collapsed]:hidden">
                {item.description}
              </span>
            </div>
          </div>
          {showBadge && item.badge && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 px-1.5 text-xs bg-sidebar-accent/30 text-sidebar-accent-foreground group-data-[state=collapsed]:hidden"
            >
              {item.badge}
            </Badge>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
