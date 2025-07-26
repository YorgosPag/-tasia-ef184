

'use client';
import { AppShell } from '@/tasia/components/layout/app-shell';
import { ProtectedRoute } from '@/shared/components/auth/protected-route';
import React from 'react';

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
