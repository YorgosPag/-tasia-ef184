
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tasiaProjectToolsNav = [
  { href: '/contacts', label: 'Επαφές', icon: Users },
  { href: '/leads', label: 'Leads', icon: Wallet },
  { href: '/meetings', label: 'Συσκέψεις', icon: MessageSquare },
  { href: '/contracts', label: 'Συμβόλαια', icon: FileText },
  { href: '/work-stages', label: 'Στάδια Εργασιών', icon: GanttChartSquare },
  { href: '/calendar', label: 'Ημερολόγιο', icon: Calendar },
  { href: '/architect-desk', label: 'Architect\'s Desk', icon: FilePen },
  { href: '/assignments', label: 'Οι Αναθέσεις μου', icon: ClipboardList },
];

const entitiesNav = [
    { href: '/companies', label: 'Εταιρείες', icon: Building2 },
    { href: '/projects', label: 'Έργα', icon: Briefcase },
    { href: '/buildings', label: 'Κτίρια', icon: Building },
    { href: '/floors', label: 'Όροφοι', icon: Layers },
    { href: '/units', label: 'Ακίνητα', icon: Home },
    { href: '/attachments', label: 'Παρακολουθήματα', icon: ClipboardList },
]

const nestorNav = [
  { href: '/nestor/dashboard', label: 'Πίνακας Ελέγχου', icon: LayoutGrid },
  { href: '/nestor/projects', label: 'Λίστα Έργων', icon: FileBox },
  { href: '/nestor/reports', label: 'Αναφορές', icon: BarChart3 },
  { href: '/nestor/offers', label: 'Προσφορές Προμηθευτών', icon: Award },
  { href: '/nestor/interventions', label: 'Παρεμβάσεις Έργων', icon: PenTool },
  { href: '/nestor/stages', label: 'Στάδια Παρεμβάσεων', icon: GanttChartSquare },
  { href: '/nestor/guides', label: 'Οδηγίες', icon: List },
];

const managementNav = [
  { href: '/custom-lists', label: 'Προσ. Λίστες', icon: List },
]

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Handle exact match for dashboard or other root-level links
    if (href === '/dashboard') {
        return pathname === href;
    }
    // Handle nested routes
    return pathname.startsWith(href);
  };

  const getButtonClass = (href: string) => {
    const active = isActive(href);
    return cn(
      'text-lg font-medium text-left px-4 py-2 whitespace-nowrap',
      active
        ? 'bg-gray-200/60 dark:bg-gray-700 text-gray-900 dark:text-white' // Active state styles
        : 'text-gray-600 dark:text-gray-400' // Inactive state styles
    );
  };

  return (
    <SidebarMenu>
      <SidebarGroup>
        <SidebarGroupLabel className="text-base font-semibold tracking-wider text-gray-500 uppercase px-4 whitespace-nowrap">Ευρετήριο Ακινήτων</SidebarGroupLabel>
        {entitiesNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton href={item.href} className={getButtonClass(item.href)} icon={item.icon} tooltip={item.label}>
              <span className="ml-3">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>
      
       <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel className="text-base font-semibold tracking-wider text-gray-500 uppercase px-4 whitespace-nowrap">Εργαλεία</SidebarGroupLabel>
        {tasiaProjectToolsNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton href={item.href} className={getButtonClass(item.href)} icon={item.icon} tooltip={item.label}>
              <span className="ml-3">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>
      
      <SidebarSeparator />
      
       <SidebarGroup>
        <SidebarGroupLabel className="text-base font-semibold tracking-wider text-gray-500 uppercase px-4 whitespace-nowrap">Διαχείριση</SidebarGroupLabel>
        {managementNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton href={item.href} className={getButtonClass(item.href)} icon={item.icon} tooltip={item.label}>
              <span className="ml-3">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>


      <SidebarMenuItem className="mt-auto">
        <SidebarMenuButton href="/settings" className={getButtonClass('/settings')} icon={Settings} tooltip="Ρυθμίσεις">
          <span className="ml-3">Ρυθμίσεις</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
