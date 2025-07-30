
"use client"

import * as React from "react"
import Link from "next/link"
import { useSidebar } from "./sidebar-context"
import { cn } from "@/shared/lib/utils"
import { buttonVariants } from "@/shared/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"

export const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    isActive?: boolean
    hasSubmenu?: boolean
    tooltip?: string
  }
>(({ className, href = "#", isActive, hasSubmenu, tooltip, ...props }, ref) => {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (isCollapsed && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            ref={ref}
            data-sidebar="menu-button"
            data-active={isActive}
            href={href}
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "data-[active=true]:bg-sidebar-active data-[active=true]:text-sidebar-active-foreground",
              className
            )}
            {...props}
          />
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link
      ref={ref}
      data-sidebar="menu-button"
      data-active={isActive}
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "relative h-auto justify-start p-2",
        hasSubmenu && "pr-8",
        "data-[active=true]:bg-sidebar-active data-[active=true]:text-sidebar-active-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"
