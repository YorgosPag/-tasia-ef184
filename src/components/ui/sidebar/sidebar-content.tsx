"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SidebarContent = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  React.ComponentProps<typeof ScrollArea>
>(({ className, ...props }, ref) => {
  return (
    <ScrollArea
      data-sidebar="content"
      ref={ref}
      className={cn(
        "flex-1 overflow-hidden transition-all duration-300",
        // Custom scrollbar styling
        "[&>[data-radix-scroll-area-viewport]]:pb-0",
        // Enhanced scroll area with gradient fade effects
        "relative",
        // Fade effect at top
        "before:absolute before:top-0 before:left-0 before:right-0 before:h-4 before:bg-gradient-to-b before:from-sidebar before:to-transparent before:z-10 before:pointer-events-none",
        // Fade effect at bottom
        "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-4 after:bg-gradient-to-t after:from-sidebar after:to-transparent after:z-10 after:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";
