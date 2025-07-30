
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    data-sidebar="rail"
    className={cn(
      "absolute left-[calc(var(--sidebar-width-icon)_-_theme(spacing.px))] top-0 hidden h-full w-px group-data-[collapsible=icon]:md:block"
    )}
  >
    <Separator orientation="vertical" />
  </div>
))
SidebarRail.displayName = "SidebarRail"
