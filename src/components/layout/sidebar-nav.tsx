"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "./sidebar/sidebar-config";
import { SidebarNavGroup } from "./sidebar/SidebarNavGroup";

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    // Handle nested routes
    return pathname.startsWith(href);
  };

  const getButtonClass = (href: string) => {
    return cn(
      "group relative w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      isActive(href)
        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
        : "text-sidebar-muted-foreground hover:text-sidebar-foreground",
    );
  };

  return (
    <SidebarMenu className="space-y-1">
      {navGroups.map((group) => (
        <SidebarNavGroup
          key={group.label}
          group={group}
          pathname={pathname}
          isActive={isActive}
          getButtonClass={getButtonClass}
        />
      ))}

      <div className="mt-auto pt-4">
        <SidebarMenuItem>
          <SidebarMenuButton
            href="/settings"
            className={cn(
              getButtonClass("/settings"),
              "mt-4 border border-sidebar-border/50 bg-sidebar-accent/20 hover:bg-sidebar-accent hover:border-sidebar-accent"
            )}
            icon={Settings}
            tooltip="Ρυθμίσεις συστήματος"
            isActive={isActive("/settings")}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              <span>Ρυθμίσεις</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </div>
    </SidebarMenu>
  );
}
