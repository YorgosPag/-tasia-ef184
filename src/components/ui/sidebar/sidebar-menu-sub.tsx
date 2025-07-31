"use client";

import * as React from "react";
import Link from "next/link";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const SidebarMenuSub = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();

  return (
    <div
      data-sidebar="menu-sub"
      data-state={state}
      ref={ref}
      className={cn(
        "absolute left-full top-0 ml-1 hidden w-full min-w-max flex-col rounded-md border border-sidebar-border bg-sidebar p-2 shadow-lg group-hover/menu-item:flex group-data-[side=right]/sidebar-wrapper:left-auto group-data-[side=right]/sidebar-wrapper:right-full group-data-[side=right]/sidebar-wrapper:-ml-0 group-data-[side=right]/sidebar-wrapper:mr-1",
        "transition-opacity group-data-[state=collapsed]/sidebar-wrapper:flex",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => {
  return (
    <li
      data-sidebar="menu-sub-item"
      ref={ref}
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
});
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

export const SidebarMenuSubButton = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentProps<typeof Link> & {
    isActive?: boolean;
  }
>(({ className, isActive, children, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      data-sidebar="menu-sub-button"
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-auto justify-start gap-2 p-2",
        "data-[active=true]:bg-sidebar-active data-[active=true]:text-sidebar-active-foreground",
        className,
      )}
      {...props}
    >
      <div className="flex-1 text-wrap text-left">{children}</div>
      <ChevronRight className="h-4 w-4 shrink-0 group-hover/menu-sub-item:ml-1 group-hover/menu-sub-item:opacity-100" />
    </Link>
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
