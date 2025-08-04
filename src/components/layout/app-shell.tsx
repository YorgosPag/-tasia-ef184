"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();

  return (
    <div className={cn("min-h-screen w-full", domain)}>
      <AppSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col bg-background transition-[margin-left] duration-300 ease-in-out",
          "md:ml-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]"
        )}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
