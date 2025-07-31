"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="inset"
      className={cn("bg-background text-foreground", className)}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";
