'use client';

import { AppSidebar } from '@/shared/components/layout/Sidebar';
import { AppShell } from '@/shared/components/layout/AppShell';

export default function TasiaLayout({
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
