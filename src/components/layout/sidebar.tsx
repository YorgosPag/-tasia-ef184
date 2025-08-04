"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Logo } from "@/components/logo";
import { InstructionsDialog } from "./instructions-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  User, 
  Bell, 
  Settings,
  ChevronUp,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r-0"
      style={{
        backgroundColor: 'var(--sidebar-background, hsl(var(--sidebar-background)))'
      }}
    >
      <SidebarHeader className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Logo className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col group-data-[state=collapsed]:hidden">
            <span className="text-lg font-bold text-sidebar-foreground">
              TASIA
            </span>
            <span className="text-xs text-sidebar-muted-foreground">
              Construction CRM
            </span>
          </div>
        </div>
        
        {/* Status indicator - only visible when expanded */}
        <div className="mt-3 group-data-[state=collapsed]:hidden">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              Σύστημα Online
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarNav />
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        {/* Quick Actions - only visible when expanded */}
        <div className="space-y-2 group-data-[state=collapsed]:hidden">
          <div className="flex items-center justify-between text-xs text-sidebar-muted-foreground px-2 mb-3">
            <span>Γρήγορες Ενέργειες</span>
            <Badge variant="outline" className="h-5 px-1.5 text-xs">
              3
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 justify-start gap-2 text-xs hover:bg-sidebar-accent"
            >
              <Bell className="h-3 w-3" />
              <span>Ειδοποιήσεις</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 justify-start gap-2 text-xs hover:bg-sidebar-accent"
            >
              <User className="h-3 w-3" />
              <span>Προφίλ</span>
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 px-3 py-2 h-auto hover:bg-sidebar-accent group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                    ΓΠ
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start group-data-[state=collapsed]:hidden">
                  <span className="text-sm font-medium text-sidebar-foreground">
                    Γιάννης Παπαδόπουλος
                  </span>
                  <span className="text-xs text-sidebar-muted-foreground">
                    Project Manager
                  </span>
                </div>
                <ChevronUp className="ml-auto h-4 w-4 text-sidebar-muted-foreground group-data-[state=collapsed]:hidden" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56"
              side="top"
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">Γιάννης Παπαδόπουλος</p>
                <p className="text-xs text-muted-foreground">giannis@company.gr</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                <span>Το Προφίλ μου</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Ρυθμίσεις</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="gap-2"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span>{isDarkMode ? 'Φωτεινό θέμα' : 'Σκοτεινό θέμα'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Αποσύνδεση</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Help Section */}
        <InstructionsDialog>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 px-3 py-2 mt-2 text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-2"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm group-data-[state=collapsed]:hidden">
              Οδηγίες Χρήσης
            </span>
          </Button>
        </InstructionsDialog>

        {/* Version info - only when expanded */}
        <div className="mt-3 px-3 group-data-[state=collapsed]:hidden">
          <div className="text-xs text-sidebar-muted-foreground/60 text-center">
            <p>TASIA v2.1.0</p>
            <p>© 2025 Construction CRM</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
