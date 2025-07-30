
"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useSidebar } from "./sidebar-context"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()

  return (
    <div
      data-sidebar="input"
      className="relative transition-opacity group-data-[state=collapsed]:opacity-0"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
      <Input
        ref={ref}
        className={cn("bg-transparent pl-9", className)}
        {...props}
      />
    </div>
  )
})
SidebarInput.displayName = "SidebarInput"
