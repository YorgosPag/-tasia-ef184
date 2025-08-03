"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn(
        "relative border-b border-sidebar-border/50 bg-gradient-to-r from-sidebar to-sidebar/95 transition-all duration-300",
        // Enhanced styling
        "backdrop-blur-sm",
        // Shadow for depth
        "shadow-sm shadow-black/5",
        // Subtle pattern overlay
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)] before:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";
