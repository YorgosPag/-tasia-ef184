
'use client';

import { AppSidebar } from '@/shared/components/layout/sidebar';
import { AppShell } from '@/shared/components/layout/AppShell';

export default function NestorLayout({
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
