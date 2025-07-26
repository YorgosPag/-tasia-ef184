
'use client';

import React from 'react';
import { AppSidebar } from './sidebar';
import { AppHeader } from './Header';
import { useCurrentDomain } from '@/shared/hooks/useCurrentDomain';
import { cn } from '@/shared/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const domain = useCurrentDomain();

  return (
    <div className={cn("flex min-h-screen", domain)}>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
