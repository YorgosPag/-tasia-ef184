'use client';

import { AppSidebar } from '@/components/layout/sidebar';
import { AppShell } from '@/components/layout/app-shell';

export default function EcoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AppSidebar />
      <AppShell>{children}</AppShell>
    </div>
  );
}
