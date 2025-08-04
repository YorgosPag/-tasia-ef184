"use client";

import React from "react";
import { AppSidebar } from "./sidebar";
import { AppHeader } from "./Header";
import { useCurrentDomain } from "@/hooks/useCurrentDomain";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();
  const { isMobile, state } = useSidebar();
  const isCollapsed = isMobile ? false : state === "collapsed";
  
  // Debug values
  console.log("Debug AppShell:", { isMobile, state, isCollapsed });

  return (
    <div className={cn("min-h-screen w-full relative", domain)}>
      {/* Sidebar με absolute positioning */}
      <div 
        className="absolute top-0 left-0 z-50 h-full bg-gray-900 border-r border-gray-700"
        style={{
          width: isMobile ? "15rem" : (isCollapsed ? "3.25rem" : "16rem"),
        }}
      >
        <AppSidebar />
      </div>
      
      {/* Main content με fixed margin */}
      <div
        className="min-h-screen flex flex-col bg-background"
        style={{
          marginLeft: isMobile ? "0px" : (isCollapsed ? "3.25rem" : "16rem"),
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => {/* close sidebar */}}
        />
      )}
    </div>
  );
}