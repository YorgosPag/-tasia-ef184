"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();
  const { state: sidebarState } = useSidebar();

  const mainContentStyle: React.CSSProperties = {
    transition: 'margin-left 0.3s ease-in-out',
    marginLeft: sidebarState === 'expanded' ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)',
  };

  return (
    <div className={cn("flex min-h-screen w-full", domain)}>
      <AppSidebar />
      <div className="flex-1 flex flex-col w-full" style={mainContentStyle}>
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
