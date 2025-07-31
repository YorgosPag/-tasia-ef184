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
      className={cn("flex-1", className)}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";
