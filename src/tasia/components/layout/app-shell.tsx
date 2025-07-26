
'use client';

import { AppHeader } from '@/shared/components/layout/Header';
import { AppSidebar } from '@/shared/components/layout/Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
       <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 p-4">{children}</main>
        </div>
    </div>
  );
}
