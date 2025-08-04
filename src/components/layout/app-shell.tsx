"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();

  return (
    <div className={cn("min-h-screen w-full", domain)}>
      <SidebarProvider>
        {/* Fixed Sidebar */}
        <div 
          className="fixed left-0 top-0 z-50 h-full transition-all duration-300 ease-in-out"
          style={{
            width: 'var(--sidebar-width, 256px)',
            backgroundColor: 'var(--sidebar-background, hsl(var(--sidebar-background)))'
          }}
        >
          <AppSidebar />
        </div>
        
        {/* Main Content Area */}
        <div 
          className="min-h-screen transition-all duration-300 ease-in-out"
          style={{
            marginLeft: 'var(--sidebar-width, 256px)'
          }}
        >
          {/* Header */}
          <header
            className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out"
            style={{
              height: 'var(--header-height, 64px)',
              backgroundColor: 'var(--header-background, hsl(var(--background)))'
            }}
          >
            <AppHeader />
          </header>
          
          {/* Main Content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}