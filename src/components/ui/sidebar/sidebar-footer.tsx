"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "relative mt-auto border-t border-sidebar-border/50 bg-gradient-to-r from-sidebar to-sidebar/95 transition-all duration-300",
        // Enhanced styling
        "backdrop-blur-sm",
        // Shadow for depth
        "shadow-sm shadow-black/5",
        // Subtle pattern overlay at the bottom
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.08),transparent_50%)] before:pointer-events-none",
        // Subtle inner glow
        "after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-sidebar-border/30 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";
