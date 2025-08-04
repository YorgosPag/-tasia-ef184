"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";


export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();

  // This inner component is needed to access the sidebar context
  // and apply the correct margin to the main content area.
  const MainContentWrapper = ({ children }: { children: React.ReactNode }) => {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    // Use CSS variables for dynamic margin calculation
    const mainContentStyle = {
      transition: 'margin-left .2s ease-in-out',
      marginLeft: `var(--sidebar-width-${isCollapsed ? 'icon' : 'expanded'})`
    };

    return (
      <div 
        className="flex-1 flex flex-col min-h-screen" 
        style={mainContentStyle}
      >
        <header
          className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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

  return (
    <div className={cn("w-full", domain)}>
      <SidebarProvider
        style={{
          '--sidebar-width-expanded': 'var(--sidebar-width, 256px)',
          '--sidebar-width-icon': 'var(--sidebar-width-icon, 52px)',
        } as React.CSSProperties}
      >
        <AppSidebar />
        <MainContentWrapper>
          {children}
        </MainContentWrapper>
      </SidebarProvider>
    </div>
  );
}
