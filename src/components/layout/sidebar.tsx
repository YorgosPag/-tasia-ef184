
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
  CalendarDays,
  ClipboardList,
  SquareKanban,
  FilePen,
  MessageSquare,
  Package,
  FileText,
  Mail,
  Phone,
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
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { HierarchySidebar } from './HierarchySidebar'; // Import the new component

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const { isEditor, isAdmin } = useAuth();

  const isConstructionView = pathname.startsWith('/projects') && view === 'construction';

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
            <SidebarGroupLabel>Ευρετήριο Ακινήτων</SidebarGroupLabel>
            <HierarchySidebar />
        </SidebarGroup>
        
        {isEditor && (
            <>
                <SidebarGroup>
                <SidebarGroupLabel>Κατασκευαστική Διαχείριση</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/projects?view=construction" isActive={isConstructionView}>
                            <Construction />
                            Στάδια Εργασιών
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/assignments" isActive={pathname.startsWith('/assignments')}>
                            <ClipboardList />
                            Οι Αναθέσεις μου
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/architect-dashboard" isActive={pathname.startsWith('/architect-dashboard')}>
                            <FilePen />
                            Architect's Dashboard
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/construction/calendar" isActive={pathname.startsWith('/construction/calendar')}>
                            <CalendarDays />
                            Ημερολόγιο
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                </SidebarGroup>
                
                <SidebarGroup>
                    <SidebarGroupLabel>Project Admin</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton href="/leads" isActive={pathname.startsWith('/leads')}>
                                <Mail />
                                Leads
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                        <SidebarMenuButton href="/meetings" isActive={pathname.startsWith('/meetings')}>
                            <MessageSquare />
                            Συσκέψεις
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/contracts" isActive={pathname.startsWith('/contracts')}>
                            <FileText />
                            Συμβόλαια
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/materials" isActive={pathname.startsWith('/materials')}>
                            <Package />
                            Υλικά
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </>
        )}


        {isAdmin && (
          <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton href="/templates/work-stages" isActive={pathname.startsWith('/templates/work-stages')}>
                          <SquareKanban />
                          Πρότυπα Σταδίων
                      </SidebarMenuButton>
                  </SidebarMenuItem>
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
