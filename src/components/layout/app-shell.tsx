"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

function AppShellLayout({ children }: { children: React.ReactNode }) {
  const { isMobile, state } = useSidebar();
  const isCollapsed = isMobile ? false : state === "collapsed";

  return (
    <>
      <AppSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col bg-background transition-[margin-left] duration-300 ease-in-out",
          !isMobile && (isCollapsed ? "ml-[52px]" : "ml-64"),
        )}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();

  return (
    <div className={cn("min-h-screen w-full", domain)}>
      <SidebarProvider>
        <AppShellLayout>{children}</AppShellLayout>
      </SidebarProvider>
    </div>
  );
}
