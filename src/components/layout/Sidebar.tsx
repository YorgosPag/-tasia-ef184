
"use client"

import * as React from "react"
import {
  Sidebar,
} from "@/components/ui/sidebar"
import { SidebarNav } from "./sidebar-nav"

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarNav />
    </Sidebar>
  )
}
