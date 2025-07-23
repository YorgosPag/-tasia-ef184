
'use client';

import {
  Home,
  Building,
  Briefcase,
  Building2,
  Layers,
  LayoutTemplate,
  History,
  Users,
  Paperclip,
  Construction,
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
import { useAuth } from '@/hooks/use-auth';

export function AppSidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

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
          </SidebarMenu>
        </SidebarGroup>
        
         <SidebarGroup>
          <SidebarGroupLabel>Κατασκευαστική Διαχείριση</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton href="/projects" isActive={pathname.startsWith('/projects')}>
                    <Construction />
                    Έργα
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Ευρετήριο Ακινήτων</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton href="/companies" isActive={pathname.startsWith('/companies')}>
                    <Building2 />
                    Εταιρείες
                </SidebarMenuButton>
            </SidebarMenuItem>
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
             <SidebarMenuItem>
              <SidebarMenuButton href="/units" isActive={pathname.startsWith('/units')}>
                <LayoutTemplate />
                Ακίνητα
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/attachments" isActive={pathname.startsWith('/attachments')}>
                <Paperclip />
                Παρακολουθήματα
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton href="/users" isActive={pathname.startsWith('/users')}>
                          <Users />
                          Users
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <SidebarMenuButton href="/audit-log" isActive={pathname.startsWith('/audit-log')}>
                          <History />
                          Audit Log
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
