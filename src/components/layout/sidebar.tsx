
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Logo } from '@/components/logo';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useDataStore } from '@/hooks/use-data-store';
import { Skeleton } from '../ui/skeleton';


export function AppSidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const { companies, projects, isLoading } = useDataStore();

  const groupedProjects = projects.reduce((acc, project) => {
    const companyId = project.companyId || 'unassigned';
    if (!acc[companyId]) {
      acc[companyId] = [];
    }
    acc[companyId].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  const getAccordionValue = () => {
    const parts = pathname.split('/');
    if (parts.length >= 3 && parts[1] === 'projects') {
      const projectId = parts[2];
      const project = projects.find(p => p.id === projectId);
      return project ? [`company-${project.companyId}`] : [];
    }
    return [];
  }

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
          <SidebarGroupLabel>Εταιρείες & Έργα</SidebarGroupLabel>
            {isLoading ? (
              <div className="space-y-2 px-1">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
            <Accordion type="multiple" defaultValue={getAccordionValue()} className="w-full">
              {companies.map(company => (
                <AccordionItem value={`company-${company.id}`} key={company.id} className="border-none">
                  <AccordionTrigger className="py-2 px-2 text-sm rounded-md hover:bg-sidebar-accent hover:no-underline data-[state=open]:bg-sidebar-accent">
                    <div className="flex items-center gap-2">
                       <Building2 className="h-4 w-4" />
                       <span className="truncate">{company.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 pb-0">
                    <SidebarMenu>
                      {(groupedProjects[company.id] || []).map(project => (
                         <SidebarMenuItem key={project.id}>
                            <SidebarMenuButton 
                              href={`/projects/${project.id}`} 
                              isActive={pathname === `/projects/${project.id}`}
                              className="h-auto py-1.5"
                            >
                              <Briefcase className="h-3.5 w-3.5" />
                              <span className="truncate">{project.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                      {(!groupedProjects[company.id] || groupedProjects[company.id].length === 0) && (
                         <p className="px-2 py-1 text-xs text-sidebar-foreground/60">Δεν υπάρχουν έργα.</p>
                      )}
                    </SidebarMenu>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            )}
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
             <SidebarMenuItem>
              <SidebarMenuButton href="/units" isActive={pathname.startsWith('/units')}>
                <LayoutTemplate />
                Ακίνητα
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
