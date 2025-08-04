"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-provider";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";
import { cn } from "@/lib/utils";

function MainAppLayoutContent({ children }: { children: React.ReactNode }) {
  const { isMobile, state } = useSidebar();
  const isCollapsed = isMobile ? false : state === "collapsed";

  return (
    <div
      className="relative"
      style={{
        marginLeft: isMobile
          ? "0"
          : `var(--sidebar-width-icon, ${isCollapsed ? "3.25rem" : "16rem"})`,
      }}
    >
      <AppShell>{children}</AppShell>
    </div>
  );
}

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MainAppLayoutContent>{children}</MainAppLayoutContent>
    </SidebarProvider>
  );
}
