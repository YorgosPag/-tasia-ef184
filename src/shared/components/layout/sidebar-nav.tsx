
'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/shared/components/ui/sidebar';
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

const tasiaProjectToolsNav = [
  { href: '/projects', label: 'Έργα', icon: Briefcase },
  { href: '/leads', label: 'Leads', icon: Wallet },
  { href: '/meetings', label: 'Συσκέψεις', icon: MessageSquare },
  { href: '/work-stages', label: 'Στάδια Εργασιών', icon: GanttChartSquare },
  { href: '/calendar', label: 'Ημερολόγιο', icon: Calendar },
  { href: '/architect-desk', label: 'Architect\'s Desk', icon: FilePen },
  { href: '/assignments', label: 'Οι Αναθέσεις μου', icon: ClipboardList },
];

const entitiesNav = [
    { href: '/companies', label: 'Εταιρείες', icon: Building2 },
    { href: '/contacts', label: 'Επαφές', icon: Users },
    { href: '/buildings', label: 'Κτίρια', icon: Building },
    { href: '/floors', label: 'Όροφοι', icon: Layers },
    { href: '/units', label: 'Ακίνητα', icon: Home },
    { href: '/attachments', label: 'Παρακολουθήματα', icon: ClipboardList },
]

const nestorNav = [
  { href: '/nestor/dashboard', label: 'Πίνακας Ελέγχου', icon: LayoutGrid },
  { href: '/nestor/projects', label: 'Λίστα Έργων', icon: FileBox },
  { href: '/nestor/contacts', label: 'Λίστα Επαφών', icon: BookUser },
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
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton href="/dashboard" isActive={pathname === '/dashboard'} icon={Home} tooltip="Αρχική">
          Αρχική
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarGroup>
        <SidebarGroupLabel>TASIA Real Estate</SidebarGroupLabel>
        {tasiaProjectToolsNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton href={item.href} isActive={isActive(item.href)} icon={item.icon} tooltip={item.label}>
              {item.label}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>
      
       <SidebarSeparator />

        <SidebarGroup>
            <SidebarGroupLabel>Οντότητες</SidebarGroupLabel>
            {entitiesNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton href={item.href} isActive={isActive(item.href)} icon={item.icon} tooltip={item.label}>
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
      </SidebarGroup>
      
      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel>NESTOR Εξοικονομώ</SidebarGroupLabel>
        {nestorNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton href={item.href} isActive={isActive(item.href)} icon={item.icon} tooltip={item.label}>
              {item.label}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>

      <SidebarSeparator />
      
       <SidebarGroup>
        <SidebarGroupLabel>Διαχείριση</SidebarGroupLabel>
        {managementNav.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton href={item.href} isActive={isActive(item.href)} icon={item.icon} tooltip={item.label}>
              {item.label}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarGroup>


      <SidebarMenuItem className="mt-auto">
        <SidebarMenuButton href="/settings" isActive={pathname === '/settings'} icon={Settings} tooltip="Ρυθμίσεις">
          Ρυθμίσεις
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
