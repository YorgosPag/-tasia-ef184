"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();

  return (
    <div className={cn("min-h-screen w-full relative", domain)}>
      {/* Sidebar - FIXED */}
      <AppSidebar />

      {/* Main content area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          "md:ml-[var(--sidebar-width)]",
          "group-data-[state=collapsed]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]",
        )}
      >
        {/* Header - Fixed within the main content area */}
        <header className="sticky top-0 z-30">
          <AppHeader />
        </header>

        {/* Scrollable Main Content */}
        <main className="p-4 sm:p-6 lg:p-8 bg-background">
          <div className="max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
