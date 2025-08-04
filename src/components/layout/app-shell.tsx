"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();

  return (
    <div className={cn("min-h-screen w-full", domain)}>
      <SidebarProvider 
        style={{
          '--sidebar-width': 'var(--sidebar-width, 256px)',
          '--sidebar-width-icon': 'var(--sidebar-width-icon, 52px)',
        } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarInset className="transition-all duration-300 ease-in-out">
          {/* Header */}
          <header 
            className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            style={{
              height: 'var(--header-height, 64px)',
              backgroundColor: 'var(--header-background, hsl(var(--background)))'
            }}
          >
            <AppHeader />
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}