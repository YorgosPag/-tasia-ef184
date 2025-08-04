"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();
  const { isMobile, state } = useSidebar();
  const isCollapsed = isMobile ? false : state === "collapsed";

  return (
    <div className={cn("min-h-screen w-full", domain)}>
      <AppSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col bg-background transition-[margin-left] duration-300 ease-in-out",
        )}
        style={{
          marginLeft: isMobile
            ? "0px"
            : `var(${isCollapsed ? "--sidebar-width-icon" : "--sidebar-width"})`,
        }}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
