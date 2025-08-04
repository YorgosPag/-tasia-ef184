"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "./sidebar/sidebar-config";
import { SidebarNavGroup } from "./sidebar/SidebarNavGroup";

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/projects") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getButtonClass = (href: string) => {
    return cn(
      "w-full h-full text-left transition-colors duration-200 ease-in-out relative flex items-center gap-2 rounded-md",
      "group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:size-10",
      "group-data-[state=expanded]:px-3 group-data-[state=expanded]:py-2",
      isActive(href)
        ? "bg-sidebar-active text-sidebar-active-foreground"
        : "text-sidebar-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    );
  };

  return (
    <SidebarMenu className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {navGroups.map((group) => (
          <SidebarNavGroup
            key={group.label}
            group={group}
            pathname={pathname}
            isActive={isActive}
            getButtonClass={getButtonClass}
          />
        ))}
      </div>
      <div className="mt-auto">
        <SidebarMenuItem>
          <SidebarMenuButton
            href="/settings"
            className={getButtonClass("/settings")}
            icon={Settings}
            tooltip="Ρυθμίσεις"
            isActive={isActive("/settings")}
          >
            <div className="flex items-center justify-between w-full min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Settings className="h-4 w-4 shrink-0 transition-colors" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate leading-none">Ρυθμίσεις</span>
                </div>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </div>
    </SidebarMenu>
  );
}