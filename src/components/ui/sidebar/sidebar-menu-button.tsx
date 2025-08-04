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
                "h-10 w-10 rounded-lg transition-all duration-200 hover:scale-105",
                "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "border border-transparent data-[active=true]:border-sidebar-accent-foreground/20",
                className,
              )}
              {...props}
            >
              {Icon && (
                <Icon className="h-4 w-4 transition-transform duration-200" />
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
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
          "relative h-auto min-h-[2.5rem] justify-start p-0 text-left transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg",
          hasSubmenu && "pr-8",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm",
          // "data-[active=true]:border-l-2 data-[active=true]:border-l-sidebar-accent-foreground/30",
          "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-r-full before:bg-sidebar-accent-foreground before:opacity-0 before:transition-opacity before:duration-200",
          "data-[active=true]:before:opacity-100",
          "hover:shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="flex items-center w-full px-3 py-2.5">
          <div className="flex items-center w-full min-w-0">
            {children}
          </div>
        </div>

        {/* Active indicator dot */}
        {isActive && !isCollapsed && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-2 w-2 rounded-full bg-sidebar-accent-foreground/60 animate-pulse" />
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sidebar-accent/0 to-sidebar-accent/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </Link>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";
