
"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("mt-auto border-t border-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"
