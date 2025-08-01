"use client";

import * as React from "react";
import Link from "next/link";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & {
    isActive?: boolean;
    hasSubmenu?: boolean;
    tooltip?: string;
    icon?: React.ElementType;
  }
>(
  (
    {
      className,
      href = "#",
      isActive,
      hasSubmenu,
      tooltip,
      children,
      icon: Icon,
      ...props
    },
    ref,
  ) => {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

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
                className,
              )}
              {...props}
            >
              {Icon && <Icon className="h-4 w-4" />}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Link
        ref={ref}
        data-sidebar="menu-button"
        data-active={isActive}
        href={href}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "relative h-auto justify-start p-2 text-left",
          hasSubmenu && "pr-8",
          "data-[active=true]:bg-sidebar-active data-[active=true]:text-sidebar-active-foreground",
          className,
        )}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </Link>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";
