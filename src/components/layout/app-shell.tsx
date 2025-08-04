"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

// A new inner component to access the sidebar context
function MainContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainContentStyle = {
    transition: 'margin-left 0.3s ease-in-out',
    marginLeft: isCollapsed ? 'var(--sidebar-width-icon, 52px)' : 'var(--sidebar-width, 256px)',
  };

  return (
    <div
      className="flex-1 flex flex-col min-h-screen"
      style={mainContentStyle}
    >
      <header
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{
          height: 'var(--header-height, 64px)',
          backgroundColor: 'var(--header-background, hsl(var(--background)))'
        }}
      >
        <AppHeader />
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();

  return (
    <div className={cn("w-full", domain)}>
      <SidebarProvider
        style={{
          '--sidebar-width': 'var(--sidebar-width, 256px)',
          '--sidebar-width-icon': 'var(--sidebar-width-icon, 52px)',
        } as React.CSSProperties}
      >
        <div className="flex">
          <AppSidebar />
          <MainContent>
            {children}
          </MainContent>
        </div>
      </SidebarProvider>
    </div>
  );
}
