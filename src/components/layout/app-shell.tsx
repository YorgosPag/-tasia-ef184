"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();
  const { isMobile, state } = useSidebar();
  const isCollapsed = isMobile ? false : state === "collapsed";

  return (
    <div className={cn("min-h-screen w-full relative", domain)}>
      <AppSidebar />
      <div
        className={cn(
          "min-h-screen flex flex-col bg-background transition-all duration-300 ease-in-out",
          "md:pl-[var(--sidebar-width)]",
          "group-data-[state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)]"
        )}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-full">{children}</div>
        </main>
      </div>
      {isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => {
            /* close sidebar */
          }}
        />
      )}
    </div>
  );
}
