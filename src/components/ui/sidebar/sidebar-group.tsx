"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative px-2 py-1", className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "relative flex items-center gap-2 px-2 py-2 text-xs font-semibold tracking-wider text-sidebar-muted-foreground/80 uppercase transition-all duration-200",
        "before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:bg-gradient-to-r before:from-sidebar-border before:to-transparent before:-translate-y-1/2",
        "after:absolute after:right-0 after:top-1/2 after:h-px after:flex-1 after:bg-gradient-to-l after:from-sidebar-border after:to-transparent after:-translate-y-1/2",
        "group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:before:hidden group-data-[state=collapsed]:after:hidden",
        "hover:text-sidebar-muted-foreground transition-colors duration-200",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn(
        "flex flex-col space-y-1 transition-all duration-200",
        "group-data-[state=collapsed]:space-y-2",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";
