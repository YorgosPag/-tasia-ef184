# Sidebar Component Code

This file contains the source code for all components related to the application's sidebar functionality.

---

## src/components/layout/sidebar.tsx

```tsx
"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Logo } from "@/components/logo";
import { InstructionsDialog } from "./instructions-dialog";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-2 flex items-center gap-2">
        <Logo className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold whitespace-nowrap text-sidebar-foreground transition-opacity group-data-[state=collapsed]:opacity-0 ml-2">
          TASIA
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter>
        <InstructionsDialog>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <div className="size-4" />
            <span>Οδηγίες Χρήσης</span>
          </Button>
        </InstructionsDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
```

---

## src/components/layout/sidebar-nav.tsx

```tsx
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Home,
  Briefcase,
  Users,
  Building,
  ClipboardList,
  Calendar,
  PenTool,
  Award,
  Wallet,
  FileText,
  MessageSquare,
  Settings,
  List,
  LayoutGrid,
  BarChart3,
  FileBox,
  GanttChartSquare,
  BookUser,
  Layers,
  Building2,
  FolderKanban,
  FilePen,
  Library,
  BookLock,
  Gavel,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tasiaProjectToolsNav = [
  { href: "/contacts", label: "Επαφές", icon: Users },
  { href: "/leads", label: "Leads", icon: Wallet },
  { href: "/meetings", label: "Συσκέψεις", icon: MessageSquare },
  { href: "/contracts", label: "Συμβόλαια", icon: FileText },
  { href: "/work-stages", label: "Στάδια Εργασιών", icon: GanttChartSquare },
  { href: "/calendar", label: "Ημερολόγιο", icon: Calendar },
  { href: "/architect-desk", label: "Architect's Desk", icon: FilePen },
  { href: "/assignments", label: "Οι Αναθέσεις μου", icon: ClipboardList },
];

const entitiesNav = [
  { href: "/companies", label: "Εταιρείες", icon: Building2 },
  { href: "/projects", label: "Έργα", icon: Briefcase },
  { href: "/buildings", label: "Κτίρια", icon: Building },
  { href: "/floors", label: "Όροφοι", icon: Layers },
  { href: "/units", label: "Ακίνητα", icon: Home },
  { href: "/attachments", label: "Παρακολουθήματα", icon: ClipboardList },
];

const nestorNav = [
  { href: "/nestor/dashboard", label: "Πίνακας Ελέγχου", icon: LayoutGrid },
  { href: "/nestor/projects", label: "Λίστα Έργων", icon: FileBox },
  { href: "/nestor/reports", label: "Αναφορές", icon: BarChart3 },
  { href: "/nestor/offers", label: "Προσφορές Προμηθευτών", icon: Award },
  { href: "/nestor/interventions", label: "Παρεμβάσεις Έργων", icon: PenTool },
  {
    href: "/nestor/stages",
    label: "Στάδια Παρεμβάσεων",
    icon: GanttChartSquare,
  },
  { href: "/nestor/guides", label: "Οδηγίες", icon: List },
];

const managementNav = [
  { href: "/project-management", label: "Διαχείριση Έργων", icon: FolderKanban },
  { href: "/custom-lists", label: "Προσ. Λίστες", icon: List },
  { href: "/privacy", label: "Πολιτική Απορρήτου", icon: BookLock },
  { href: "/terms", label: "Όροι Χρήσης", icon: Gavel },
];

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Handle exact match for dashboard or other root-level links
    if (href === "/dashboard") {
      return pathname === href;
    }
    // Handle nested routes
    return pathname.startsWith(href);
  };

  const getButtonClass = (href: string) => {
    return cn(
      "text-lg font-medium text-left px-4 py-2 whitespace-nowrap",
      isActive(href)
        ? "text-sidebar-active-foreground"
        : "text-sidebar-muted-foreground",
    );
  };

  return (
    <SidebarMenu>
      <SidebarGroup>
        <SidebarGroupLabel className="text-base font-semibold tracking-wider text-sidebar-muted-foreground uppercase px-4 whitespace-nowrap">
          Ευρετήριο Ακινήτων
        </SidebarGroupLabel>
        {entitiesNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              href={item.href}
              className={getButtonClass(item.href)}
              icon={item.icon}
              tooltip={item.label}
              isActive={isActive(item.href)}
            >
              <span className="ml-3">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel className="text-base font-semibold tracking-wider text-sidebar-muted-foreground uppercase px-4 whitespace-nowrap">
          Εργαλεία
        </SidebarGroupLabel>
        {tasiaProjectToolsNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              href={item.href}
              className={getButtonClass(item.href)}
              icon={item.icon}
              tooltip={item.label}
              isActive={isActive(item.href)}
            >
              <span className="ml-3">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel className="text-base font-semibold tracking-wider text-sidebar-muted-foreground uppercase px-4 whitespace-nowrap">
          Διαχείριση
        </SidebarGroupLabel>
        {managementNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              href={item.href}
              className={getButtonClass(item.href)}
              icon={item.icon}
              tooltip={item.label}
              isActive={isActive(item.href)}
            >
              <span className="ml-3">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>

      <SidebarMenuItem className="mt-auto">
        <SidebarMenuButton
          href="/settings"
          className={getButtonClass("/settings")}
          icon={Settings}
          tooltip="Ρυθμίσεις"
          isActive={isActive("/settings")}
        >
          <span className="ml-3">Ρυθμίσεις</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
```

---

## src/components/layout/sidebar-provider.tsx

```tsx
"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarContext } from "@/components/ui/sidebar/sidebar-context";
import {
  getCookie,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
} from "@/components/ui/sidebar/sidebar-utils";

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    // Read the initial state from the cookie
    const getInitialOpenState = () => {
      const cookieValue = getCookie(SIDEBAR_COOKIE_NAME);
      if (cookieValue) {
        return cookieValue === "true";
      }
      return defaultOpen;
    };

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(getInitialOpenState);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open],
    );

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      ],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";
```

---

## src/components/ui/sidebar/index.ts

```ts
export * from "./sidebar-provider";
export * from "./sidebar";
export * from "./sidebar-trigger";
export * from "./sidebar-rail";
export * from "./sidebar-inset";
export * from "./sidebar-header";
export * from "./sidebar-footer";
export * from "./sidebar-separator";
export * from "./sidebar-content";
export * from "./sidebar-group";
export * from "./sidebar-menu";
export * from "./sidebar-menu-button";
export * from "./sidebar-menu-sub";
export * from "./sidebar-input";
export * from "./sidebar-context";
```

---

## src/components/ui/sidebar/sidebar.tsx

```tsx
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
import { SIDEBAR_WIDTH_MOBILE } from "./sidebar-utils";

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
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar-background text-sidebar-foreground",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar-background p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Main navigation menu for the application.
            </SheetDescription>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar-background text-sidebar-foreground group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";
```

---

## src/components/ui/sidebar/sidebar-trigger.tsx

```tsx
"use client";

import * as React from "react";
import { PanelLeft } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
```

---

## src/components/ui/sidebar/sidebar-rail.tsx

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    data-sidebar="rail"
    className={cn(
      "absolute left-[calc(var(--sidebar-width-icon)_-_theme(spacing.px))] top-0 hidden h-full w-px group-data-[collapsible=icon]:md:block",
    )}
  >
    <Separator orientation="vertical" />
  </div>
));
SidebarRail.displayName = "SidebarRail";
```

---

## src/components/ui/sidebar/sidebar-inset.tsx

```tsx
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
```

---

## src/components/ui/sidebar/sidebar-header.tsx

```tsx
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
      className={cn("border-b border-sidebar-border", className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";
```

---

## src/components/ui/sidebar/sidebar-footer.tsx

```tsx
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
      className={cn("mt-auto border-t border-sidebar-border", className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";
```

---

## src/components/ui/sidebar/sidebar-separator.tsx

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      className={cn("my-2 bg-sidebar-border", className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
```

---

## src/components/ui/sidebar/sidebar-content.tsx

```tsx
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
```

---

## src/components/ui/sidebar/sidebar-group.tsx

```tsx
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
      className={cn("p-2", className)}
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
        "px-2 pb-1 pt-3 text-xs font-medium uppercase text-sidebar-muted-foreground transition-opacity group-data-[state=collapsed]:opacity-0",
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
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
});
SidebarGroupContent.displayName = "SidebarGroupContent";
```

---

## src/components/ui/sidebar/sidebar-menu.tsx

```tsx
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
```

---

## src/components/ui/sidebar/sidebar-menu-button.tsx

```tsx
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
                "h-9 w-9",
                "data-[active=true]:bg-sidebar-active data-[active=true]:text-sidebar-active-foreground",
                className,
              )}
              {...props}
            >
              {Icon && <Icon className="h-4 w-4" />}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
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
          "relative h-auto justify-start p-2 text-left",
          hasSubmenu && "pr-8",
          "data-[active=true]:bg-sidebar-active data-[active=true]:text-sidebar-active-foreground",
          className,
        )}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
      </Link>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";
```

---

## src/components/ui/sidebar/sidebar-menu-sub.tsx

```tsx
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
```

---

## src/components/ui/sidebar/sidebar-input.tsx

```tsx
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  const { state } = useSidebar();

  return (
    <div
      data-sidebar="input"
      className="relative transition-opacity group-data-[state=collapsed]:opacity-0"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
      <Input
        ref={ref}
        className={cn("bg-transparent pl-9", className)}
        {...props}
      />
    </div>
  );
});
SidebarInput.displayName = "SidebarInput";
```

---

## src/components/ui/sidebar/sidebar-context.ts

```ts
"use client";

import * as React from "react";

export type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (value: boolean | ((value: boolean) => boolean)) => void;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: (value: boolean | ((value: boolean) => boolean)) => void;
  toggleSidebar: () => void;
};

export const SidebarContext = React.createContext<SidebarContext | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}
```

---

## src/components/ui/sidebar/sidebar-utils.ts

```ts
"use client";

// --- Constants ---
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "15rem";
export const SIDEBAR_WIDTH_ICON = "3.25rem";
export const SIDEBAR_COOKIE_NAME = "sidebar-open";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// --- Functions ---
export function getCookie(name: string): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}
```
