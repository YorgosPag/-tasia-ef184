
'use client';

import { AppSidebar } from '@/shared/components/layout/Sidebar';
import { AppShell as SharedAppShell } from '@/shared/components/layout/AppShell';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
       <div className="flex flex-1">
          <AppSidebar />
          <SharedAppShell>{children}</SharedAppShell>
        </div>
    </div>
  );
}
