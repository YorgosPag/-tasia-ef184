
'use client';
import { AppShell } from '@/tasia/components/layout/app-shell';
import { ProtectedRoute } from '@/shared/components/auth/protected-route';
import React from 'react';
import { usePathname } from 'next/navigation';

export default function TasiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const domainClass = pathname.startsWith('/nestor') ? 'nestor' : 'tasia';

  return (
    <div className={domainClass}>
        <ProtectedRoute>
          <AppShell>{children}</AppShell>
        </ProtectedRoute>
    </div>
  );
}
