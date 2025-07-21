
'use client';

import {
  Home,
  Building,
  Briefcase,
  Building2,
  Layers,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { usePathname } from 'next/navigation';


export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <span className="text-xl font-semibold font-headline">TASIA</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Μενού</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive={pathname === '/'}>
                <Home />
                Αρχική
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/projects" isActive={pathname.startsWith('/projects')}>
                <Briefcase />
                Έργα
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/companies" isActive={pathname.startsWith('/companies')}>
                <Building2 />
                Εταιρείες
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Ευρετήριο Ακινήτων</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton href="/buildings" isActive={pathname.startsWith('/buildings')}>
                <Building />
                Κτίρια
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/floors" isActive={pathname.startsWith('/floors')}>
                <Layers />
                Όροφοι
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
