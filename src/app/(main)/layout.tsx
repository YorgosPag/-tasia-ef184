
'use client';

import React from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { SidebarProvider } from "@/shared/components/ui/sidebar";

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
