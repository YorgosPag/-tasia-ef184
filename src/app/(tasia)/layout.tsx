
'use client';

import React from 'react';
import { AppShell } from '@/tasia/components/layout/app-shell';
import { ProtectedRoute } from '@/shared/components/auth/protected-route';

export default function TasiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
