
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("border-b border-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"
