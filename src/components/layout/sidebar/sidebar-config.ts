"use client";

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
  Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItemType {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
}

export interface NavGroupType {
  label: string;
  icon: LucideIcon;
  items: NavItemType[];
  showBadges?: boolean;
}

const tasiaProjectToolsNav: NavItemType[] = [
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
    href: "/property-viewer",
    label: "Προβολή Ακινήτων",
    icon: LayoutGrid,
    description: "Διαδραστική προβολή κατόψεων",
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

const entitiesNav: NavItemType[] = [
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

const nestorNav: NavItemType[] = [
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

const managementNav: NavItemType[] = [
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

const designSystemNav: NavItemType[] = [
  {
    href: "/design-system",
    label: "Design System",
    icon: Palette,
    description: "Customization & theming",
  },
];

export const navGroups: NavGroupType[] = [
  {
    label: "Ευρετήριο Ακινήτων",
    icon: Building,
    items: entitiesNav,
  },
  {
    label: "ΕΡΓΑΛΕΙΑ CRM",
    icon: Zap,
    items: tasiaProjectToolsNav,
  },
  {
    label: "Nestor Analytics",
    icon: TrendingUp,
    items: nestorNav,
    showBadges: false,
  },
  {
    label: "Design",
    icon: Palette,
    items: designSystemNav,
    showBadges: false,
  },
  {
    label: "Διαχείριση",
    icon: Settings,
    items: managementNav,
    showBadges: false,
  },
];
