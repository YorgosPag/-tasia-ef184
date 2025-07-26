
'use client';
import React from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';

export default function TasiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AppShell>{children}</AppShell>
  );
}
