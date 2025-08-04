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
    // Handle exact match for dashboard or other root-level links
    if (href === "/dashboard") {
      return pathname === href;
    }
    // Handle nested routes
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
    <SidebarMenu className="flex-1">
      {navGroups.map((group) => (
        <SidebarNavGroup
          key={group.label}
          group={group}
          pathname={pathname}
          isActive={isActive}
          getButtonClass={getButtonClass}
        />
      ))}
    </SidebarMenu>
  );
}
