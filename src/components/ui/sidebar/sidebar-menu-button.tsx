
"use client"

import * as React from "react"
import Link from "next/link"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "./sidebar-context"
import { sidebarMenuButtonVariants } from "./sidebar-variants"

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    hasSubmenu?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
    href?: string
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      hasSubmenu, // Destructure hasSubmenu to prevent it from being passed to the DOM element
      variant = "default",
      size = "default",
      tooltip,
      className,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state } = useSidebar()
    const isLink = !!href
    const Comp = asChild ? Slot : isLink ? Link : "button"

    const commonProps = {
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size, className })),
      ...(isLink ? { href } : {}),
      ...props,
    };

    const button = (
      <Comp ref={ref as any} {...commonProps}>
        {children}
      </Comp>
    );

    if (!tooltip) {
      return button
    }
    
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"
