
"use client"

import * as React from "react"
import { Sidebar } from "@/shared/components/ui/sidebar/sidebar"
import { SidebarNav } from "./sidebar-nav"

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarNav />
    </Sidebar>
  )
}
