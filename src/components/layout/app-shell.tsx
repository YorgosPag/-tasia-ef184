"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isMobile, state } = useSidebar();
  const isCollapsed = isMobile ? false : state === "collapsed";

  return (
    <div className={cn("min-h-screen w-full flex")}>
      <AppSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col bg-background transition-all duration-300 ease-in-out flex-1",
        )}
        style={{
          marginLeft: isMobile
            ? "0px"
            : `var(${isCollapsed ? "--sidebar-width-icon" : "--sidebar-width"})`,
        }}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
