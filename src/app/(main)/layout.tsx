
'use client';

import React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
