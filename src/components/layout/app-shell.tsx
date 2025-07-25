'use client';

import { AppHeader } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
