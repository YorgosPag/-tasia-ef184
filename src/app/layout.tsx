
'use client';

import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { DataProvider } from '@/hooks/use-data-store';
import { QueryProvider } from '@/hooks/use-query-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ThemeProvider } from '@/components/theme-provider';
import { Suspense } from 'react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>TASIA</title>
        <meta name="description" content="Ευρετήριο Ακινήτων" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Suspense>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <DataProvider>
                <ProtectedRoute>
                  <SidebarProvider defaultOpen>
                    <div className="flex">
                      <AppSidebar />
                      <AppShell>{children}</AppShell>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
                <Toaster />
              </DataProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
