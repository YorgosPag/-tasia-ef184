"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

function AppShellLayout({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      {/* Fixed Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full transition-all duration-300 ease-in-out",
        )}
        style={{
          width: isCollapsed
            ? "var(--sidebar-width-icon)"
            : "var(--sidebar-width)",
          backgroundColor: "var(--sidebar-background)",
        }}
      >
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <div
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isCollapsed
            ? "var(--sidebar-width-icon)"
            : "var(--sidebar-width)",
        }}
      >
        {/* Header */}
        <header
          className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          style={{
            height: "var(--header-height)",
            backgroundColor: "var(--header-background)",
          }}
        >
          <AppHeader />
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
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
