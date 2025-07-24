"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarContent,
} from "@/components/ui/sidebar";
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  FolderKanban,
  Settings,
  LogOut,
  BookUser,
  Shield,
  Info,
  ListChecks,
  BarChart,
  ShoppingBag,
  BellRing,
  ClipboardList,
  Network,
  FileCheck,
  Sparkles,
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
} from "lucide-react";
import { InstructionsDialog } from "./instructions-dialog";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const EcoFlowLogo = () => (
  <div className="flex items-center gap-2">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="font-semibold">NESTOR eco</span>
  </div>
);

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
                    <NavLink href="/projects?view=construction" icon={Construction} tooltip="Στάδια Εργασιών">
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
                    <NavLink href="/projects" icon={Briefcase} tooltip="Έργα">
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
            <SidebarGroupLabel className="flex items-center gap-2">
                <HomeIcon className="h-4 w-4" />
                Εξοικονομώ
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith("/eco/dashboard")}
                        tooltip="Πίνακας Ελέγχου"
                    >
                        <Link href="/eco/dashboard">
                        <LayoutGrid />
                        <span>Πίνακας Ελέγχου</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith("/eco/projects")}
                        tooltip="Λίστα Έργων"
                    >
                        <Link href="/eco/projects">
                        <FolderKanban />
                        <span>Λίστα Έργων</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith("/eco/contacts")}
                        tooltip="Λίστα Επαφών"
                    >
                        <Link href="/eco/contacts">
                        <BookUser />
                        <span>Λίστα Επαφών</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarMenu>
                <NavLink href="/users" icon={Users} tooltip="User Management">
                  Users
                </NavLink>
                <NavLink href="/audit-log" icon={LineChart} tooltip="Audit Log">
                  Audit Log
                </NavLink>
              </SidebarMenu>
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