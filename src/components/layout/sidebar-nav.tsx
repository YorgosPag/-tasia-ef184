
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarContent,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  FolderKanban,
  Settings,
  BookUser,
  Home as HomeIcon,
  Briefcase,
  Building,
  Building2,
  CalendarDays,
  Construction,
  FilePen,
  LayoutTemplate,
  Layers,
  LineChart,
  Mail,
  MessageSquare,
  Paperclip,
  Users,
  Contact,
  ClipboardList,
  BarChart,
  ShoppingBag,
  FileCheck,
  Network,
  Info,
  Shield,
  ListChecks,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { InstructionsDialog } from "./instructions-dialog";


const NavLink = ({
  href,
  icon,
  children,
  tooltip,
  exact = false,
}: {
  href: string
  icon: React.ElementType
  children: React.ReactNode
  tooltip?: string
  exact?: boolean
}) => {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== '/';

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        href={href}
        isActive={isActive}
        tooltip={tooltip}
        className="h-10 justify-start"
      >
        <div className="flex items-center gap-3">
          {React.createElement(icon, { className: "h-5 w-5" })}
          <span className="flex-1">{children}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function SidebarNav() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth()

  const ecoIsActive = pathname.startsWith("/eco/");

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">TASIA</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <SidebarGroup>
            <SidebarMenu>
                 <NavLink href="/" icon={HomeIcon} tooltip="Αρχική" exact={true}>
                    Αρχική
                </NavLink>
            </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
                <Construction className="h-4 w-4" />
                TASIA Real Estate
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <NavLink href="/projects?view=construction" icon={Network} tooltip="Στάδια Εργασιών">
                        Στάδια Εργασιών
                    </NavLink>
                    <NavLink href="/construction/calendar" icon={CalendarDays} tooltip="Ημερολόγιο">
                        Ημερολόγιο
                    </NavLink>
                    <NavLink href="/architect-dashboard" icon={FilePen} tooltip="Architect's Desk">
                        Architect’s Desk
                    </NavLink>
                    <NavLink href="/assignments" icon={ClipboardList} tooltip="Οι Αναθέσεις μου">
                        Οι Αναθέσεις μου
                    </NavLink>
                    <NavLink href="/contacts" icon={Contact} tooltip="Επαφές">
                        Επαφές
                    </NavLink>
                    <NavLink href="/companies" icon={Building2} tooltip="Εταιρείες">
                        Εταιρείες
                    </NavLink>
                    <NavLink href="/projects" icon={FolderKanban} tooltip="Έργα">
                        Έργα
                    </NavLink>
                    <NavLink href="/buildings" icon={Building} tooltip="Κτίρια">
                        Κτίρια
                    </NavLink>
                    <NavLink href="/floors" icon={Layers} tooltip="Όροφοι">
                        Όροφοι
                    </NavLink>
                    <NavLink href="/units" icon={LayoutTemplate} tooltip="Ακίνητα">
                        Ακίνητα
                    </NavLink>
                    <NavLink href="/attachments" icon={Paperclip} tooltip="Παρακολουθήματα">
                        Παρακολουθήματα
                    </NavLink>
                    <NavLink href="/leads" icon={Mail} tooltip="Leads">
                        Leads
                    </NavLink>
                    <NavLink href="/meetings" icon={MessageSquare} tooltip="Meetings">
                        Συσκέψεις
                    </NavLink>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    hasSubmenu
                    isActive={ecoIsActive}
                    tooltip="NESTOR Εξοικονομώ"
                    className="h-10 justify-start"
                >
                    <div className="flex items-center gap-3">
                        <HomeIcon className="h-5 w-5" />
                        <span className="flex-1">NESTOR Εξοικονομώ</span>
                    </div>
                </SidebarMenuButton>
                <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/dashboard")}>
                            <Link href="/eco/dashboard">
                                <LayoutGrid />
                                <span>Πίνακας Ελέγχου</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/projects")}>
                            <Link href="/eco/projects">
                                <FolderKanban />
                                <span>Λίστα Έργων</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/contacts")}>
                            <Link href="/eco/contacts">
                                <BookUser />
                                <span>Λίστα Επαφών</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/reports")}>
                            <Link href="/eco/reports">
                                <BarChart />
                                <span>Αναφορές</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/supplier-offers")}>
                            <Link href="/eco/supplier-offers">
                                <ShoppingBag />
                                <span>Προσφορές Προμηθευτών</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    
                    <SidebarGroup className="p-0 mt-1">
                        <SidebarGroupLabel className="h-7 pl-2">
                           <FileCheck className="mr-2" /> Λογοδοσία
                        </SidebarGroupLabel>
                         <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/project-interventions")}>
                            <Link href="/eco/project-interventions">
                                <ClipboardList />
                                <span>Παρεμβάσεις Έργων</span>
                            </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/intervention-stages")}>
                            <Link href="/eco/intervention-stages">
                                <Network />
                                <span>Στάδια Παρεμβάσεων</span>
                            </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarGroup>
                     <SidebarMenuSubItem>
                         <InstructionsDialog>
                            <SidebarMenuSubButton>
                                <Info />
                                <span>Οδηγίες</span>
                            </SidebarMenuSubButton>
                        </InstructionsDialog>
                    </SidebarMenuSubItem>

                     <SidebarGroup className="p-0 mt-1">
                        <SidebarGroupLabel className="h-7 pl-2">
                           Διαχείριση
                        </SidebarGroupLabel>
                         <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/interventions-catalog")}>
                            <Link href="/eco/interventions-catalog">
                                <Shield />
                                <span>Κατάλογος Παρεμβάσεων</span>
                            </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname.startsWith("/eco/custom-lists")}>
                            <Link href="/eco/custom-lists">
                                <ListChecks />
                                <span>Προσ. Λίστες</span>
                            </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarGroup>


                </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                    <NavLink href="/users" icon={Users} tooltip="User Management">
                    Users
                    </NavLink>
                    <NavLink href="/audit-log" icon={LineChart} tooltip="Audit Log">
                    Audit Log
                    </NavLink>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="/settings"
              isActive={pathname.startsWith("/settings")}
              tooltip="Settings"
              className="h-10 justify-start"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <span className="flex-1">Settings</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
