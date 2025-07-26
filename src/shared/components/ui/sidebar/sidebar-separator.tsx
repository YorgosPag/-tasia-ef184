
"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"
import { Separator } from "@/shared/components/ui/separator"

export const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      className={cn("my-2 bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"
