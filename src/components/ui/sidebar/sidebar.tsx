"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  SIDEBAR_WIDTH_MOBILE,
} from "./sidebar-utils";

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon", // Default to icon collapsible
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile, toggleSidebar } =
      useSidebar();

    // Mobile view uses a Sheet
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side={side}
            className="w-[--sidebar-width] bg-sidebar-background p-0 text-sidebar-foreground"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
          >
            <div className="flex h-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    // Desktop view
    return (
      <aside
        ref={ref}
        data-state={state}
        className={cn(
          "fixed top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          side === "left" ? "left-0" : "right-0",
          "w-[var(--sidebar-width)] group-data-[state=collapsed]/sidebar-wrapper:w-[var(--sidebar-width-icon)]",
          "hidden md:flex",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground border-r"
        >
          {children}
        </div>
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";
