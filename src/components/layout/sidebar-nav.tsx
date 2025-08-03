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
  TrendingUp,
  UserCheck,
  Phone,
  Handshake,
  Target,
  Clock,
  Archive,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const tasiaProjectToolsNav = [
  {
    href: "/contacts",
    label: "Επαφές",
    icon: Users,
    description: "Διαχείριση επαφών",
    badge: "9",
  },
  {
    href: "/projects-management",
    label: "Διαχείριση Έργων",
    icon: FolderKanban,
    description: "Project management tools",
  },
  {
    href: "/building-management",
    label: "Διαχείριση Κτιρίων",
    icon: Building,
    description: "Building management tools",
  },
  {
    href: "/property-management",
    label: "Διαχείριση Ακινήτων",
    icon: Home,
    description: "Property management tools",
  },
  {
    href: "/leads",
    label: "Leads",
    icon: Target,
    description: "Δυνητικοί πελάτες",
    badge: "3",
  },
  {
    href: "/meetings",
    label: "Συσκέψεις",
    icon: MessageSquare,
    description: "Προγραμματισμός συναντήσεων",
  },
  {
    href: "/contracts",
    label: "Συμβόλαια",
    icon: FileText,
    description: "Διαχείριση συμβολαίων",
  },
  {
    href: "/work-stages",
    label: "Στάδια Εργασιών",
    icon: GanttChartSquare,
    description: "Παρακολούθηση προόδου",
  },
  {
    href: "/calendar",
    label: "Ημερολόγιο",
    icon: Calendar,
    description: "Προγραμματισμός εργασιών",
  },
  {
    href: "/architect-desk",
    label: "Architect's Desk",
    icon: FilePen,
    description: "Εργαλεία αρχιτέκτονα",
  },
  {
    href: "/assignments",
    label: "Οι Αναθέσεις μου",
    icon: ClipboardList,
    description: "Προσωπικές εργασίες",
    badge: "5",
  },
];

const entitiesNav = [
  {
    href: "/companies",
    label: "Εταιρείες",
    icon: Building2,
    description: "Καταχώρηση εταιρειών",
  },
  {
    href: "/projects",
    label: "Έργα",
    icon: Briefcase,
    description: "Διαχείριση έργων",
    badge: "12",
  },
  {
    href: "/buildings",
    label: "Κτίρια",
    icon: Building,
    description: "Καταγραφή κτιρίων",
  },
  {
    href: "/floors",
    label: "Όροφοι",
    icon: Layers,
    description: "Διαχείριση ορόφων",
  },
  {
    href: "/units",
    label: "Ακίνητα",
    icon: Home,
    description: "Μονάδες ακινήτων",
  },
  {
    href: "/attachments",
    label: "Παρακολουθήματα",
    icon: ClipboardList,
    description: "Έγγραφα και αρχεία",
  },
];

const nestorNav = [
  {
    href: "/nestor/dashboard",
    label: "Πίνακας Ελέγχου",
    icon: LayoutGrid,
    description: "Γενική επισκόπηση",
  },
  {
    href: "/nestor/projects",
    label: "Λίστα Έργων",
    icon: FileBox,
    description: "Όλα τα έργα",
  },
  {
    href: "/nestor/reports",
    label: "Αναφορές",
    icon: BarChart3,
    description: "Στατιστικά και αναλύσεις",
  },
  {
    href: "/nestor/offers",
    label: "Προσφορές Προμηθευτών",
    icon: Award,
    description: "Διαχείριση προσφορών",
  },
  {
    href: "/nestor/interventions",
    label: "Παρεμβάσεις Έργων",
    icon: PenTool,
    description: "Καταγραφή παρεμβάσεων",
  },
  {
    href: "/nestor/stages",
    label: "Στάδια Παρεμβάσεων",
    icon: GanttChartSquare,
    description: "Παρακολούθηση σταδίων",
  },
  {
    href: "/nestor/guides",
    label: "Οδηγίες",
    icon: List,
    description: "Εγχειρίδια χρήσης",
  },
];

const managementNav = [
  {
    href: "/custom-lists",
    label: "Προσ. Λίστες",
    icon: List,
    description: "Προσαρμοσμένες λίστες",
  },
  {
    href: "/privacy",
    label: "Πολιτική Απορρήτου",
    icon: BookLock,
    description: "Όροι και προϋποθέσεις",
  },
  {
    href: "/terms",
    label: "Όροι Χρήσης",
    icon: Gavel,
    description: "Νομικοί όροι",
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getButtonClass = (href: string) => {
    return cn(
      "group relative w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      isActive(href)
        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
        : "text-sidebar-muted-foreground hover:text-sidebar-foreground",
    );
  };

  const NavItem = ({ item, showBadge = true }: { item: any; showBadge?: boolean }) => (
    <SidebarMenuItem>
      <SidebarMenuButton
        href={item.href}
        className={getButtonClass(item.href)}
        icon={item.icon}
        tooltip={`${item.label} - ${item.description}`}
        isActive={isActive(item.href)}
      >
        <div className="flex items-center justify-between w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <item.icon className="h-4 w-4 shrink-0 transition-colors" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate leading-none">{item.label}</span>
              <span className="text-xs text-sidebar-muted-foreground/70 truncate mt-0.5 group-data-[state=collapsed]:hidden">
                {item.description}
              </span>
            </div>
          </div>
          {showBadge && item.badge && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 px-1.5 text-xs bg-sidebar-accent/30 text-sidebar-accent-foreground group-data-[state=collapsed]:hidden"
            >
              {item.badge}
            </Badge>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <SidebarMenu className="space-y-1">
      <SidebarGroup className="px-0">
        <SidebarGroupLabel className="px-3 pb-2 pt-4 text-xs font-semibold tracking-wider text-sidebar-muted-foreground/80 uppercase flex items-center gap-2">
          <Building className="h-4 w-4" />
          <span className="group-data-[state=collapsed]:hidden">Ευρετήριο Ακινήτων</span>
        </SidebarGroupLabel>
        <div className="space-y-0.5">
          {entitiesNav.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </SidebarGroup>

      <SidebarSeparator className="my-4" />

      <SidebarGroup className="px-0">
        <SidebarGroupLabel className="px-3 pb-2 pt-4 text-xs font-semibold tracking-wider text-sidebar-muted-foreground/80 uppercase flex items-center gap-2">
          <Zap className="h-4 w-4" />
          <span className="group-data-[state=collapsed]:hidden">ΕΡΓΑΛΕΙΑ CRM</span>
        </SidebarGroupLabel>
        <div className="space-y-0.5">
          {tasiaProjectToolsNav.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>
      </SidebarGroup>

      <SidebarSeparator className="my-4" />

      <SidebarGroup className="px-0">
        <SidebarGroupLabel className="px-3 pb-2 pt-4 text-xs font-semibold tracking-wider text-sidebar-muted-foreground/80 uppercase flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="group-data-[state=collapsed]:hidden">Nestor Analytics</span>
        </SidebarGroupLabel>
        <div className="space-y-0.5">
          {nestorNav.map((item) => (
            <NavItem key={item.href} item={item} showBadge={false} />
          ))}
        </div>
      </SidebarGroup>

      <SidebarSeparator className="my-4" />

      <SidebarGroup className="px-0">
        <SidebarGroupLabel className="px-3 pb-2 pt-4 text-xs font-semibold tracking-wider text-sidebar-muted-foreground/80 uppercase flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="group-data-[state=collapsed]:hidden">Διαχείριση</span>
        </SidebarGroupLabel>
        <div className="space-y-0.5">
          {managementNav.map((item) => (
            <NavItem key={item.href} item={item} showBadge={false} />
          ))}
        </div>
      </SidebarGroup>

      <div className="mt-auto pt-4">
        <SidebarMenuItem>
          <SidebarMenuButton
            href="/settings"
            className={cn(
              getButtonClass("/settings"),
              "mt-4 border border-sidebar-border/50 bg-sidebar-accent/20 hover:bg-sidebar-accent hover:border-sidebar-accent"
            )}
            icon={Settings}
            tooltip="Ρυθμίσεις συστήματος"
            isActive={isActive("/settings")}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              <span>Ρυθμίσεις</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </div>
    </SidebarMenu>
  );
}
