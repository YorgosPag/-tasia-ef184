"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  return (
    <ul
      data-sidebar="menu"
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
});
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => {
  return (
    <li
      data-sidebar="menu-item"
      ref={ref}
      className={cn("relative", className)}
      {...props}
    />
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";
