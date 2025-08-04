"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Logo } from "@/components/logo";
import { InstructionsDialog } from "./instructions-dialog";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-2 flex items-center gap-2">
        <Logo className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold whitespace-nowrap text-sidebar-foreground transition-opacity group-data-[state=collapsed]:opacity-0 ml-2">
          TASIA
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <InstructionsDialog>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <div className="size-4" />
            <span>Οδηγίες Χρήσης</span>
          </Button>
        </InstructionsDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
