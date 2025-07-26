
'use client';

import React from 'react';
import { AppShell } from '@/shared/components/layout/app-shell';
import { ThemeProvider } from '@/tasia/components/theme-provider';
import { AuthProvider } from '@/shared/hooks/use-auth';
import { DataProvider } from '@/shared/hooks/use-data-store';
import { QueryProvider } from '@/shared/hooks/use-query-provider';
import { Toaster } from '@/shared/components/ui/toaster';
import { SidebarProvider } from '@/shared/components/ui/sidebar';

import '@/tasia/theme/global.tasia.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <DataProvider>
                <SidebarProvider>
                   <AppShell>{children}</AppShell>
                   <Toaster />
                </SidebarProvider>
              </DataProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
