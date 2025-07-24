
"use client"

import * as React from "react"
import {
  Briefcase,
  Building,
  Building2,
  CalendarDays,
  ClipboardList,
  Construction,
  FileCog,
  FilePen,
  LayoutTemplate,
  Layers,
  LineChart,
  Mail,
  MessageSquare,
  Paperclip,
  Settings,
  SquareKanban,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

const NavLink = ({
  href,
  icon,
  children,
  tooltip,
}: {
  href: string
  icon: React.ElementType
  children: React.ReactNode
  tooltip?: string
}) => {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

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

export function AppSidebar() {
  const { user, isAdmin } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">TASIA</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-0">
        
        <SidebarGroup>
          <SidebarGroupLabel>Κατασκευαστική Διαχείριση</SidebarGroupLabel>
          <SidebarMenu>
            <NavLink href="/projects" icon={Construction} tooltip="Στάδια Εργασιών">
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
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Ευρετήριο Ακινήτων</SidebarGroupLabel>
          <SidebarMenu>
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
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarMenu>
            <NavLink href="/leads" icon={Mail} tooltip="Leads">
              Leads
            </NavLink>
            <NavLink href="/meetings" icon={MessageSquare} tooltip="Meetings">
              Συσκέψεις
            </NavLink>
            <NavLink href="/templates/work-stages" icon={SquareKanban} tooltip="Work Stage Templates">
              Πρότυπα Εργασιών
            </NavLink>
          </SidebarMenu>
        </SidebarGroup>

        {isAdmin && (
          <>
            <SidebarSeparator />
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
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              href="/settings"
              isActive={isActive("/settings")}
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
    </Sidebar>
  )
}
