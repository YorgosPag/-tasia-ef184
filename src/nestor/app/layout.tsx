
'use client';

import React from 'react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { AppSidebar } from '@/shared/components/layout/sidebar';
import { useCurrentDomain } from '@/shared/hooks/useCurrentDomain';

export default function NestorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domain = useCurrentDomain();

  return (
    <div className={domain}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <AppShell>{children}</AppShell>
      </div>
    </div>
  );
}
