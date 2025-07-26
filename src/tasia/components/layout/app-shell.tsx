
'use client';

import { AppSidebar } from '@/shared/components/layout/sidebar';
import { AppShell as SharedAppShell } from '@/shared/components/layout/AppShell';
import { AppHeader } from '@/shared/components/layout/Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
       <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
    </div>
  );
}
