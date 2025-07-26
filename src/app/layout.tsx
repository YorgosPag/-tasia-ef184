
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/shared/hooks/use-auth';
import { Toaster } from '@/shared/components/ui/toaster';
import { QueryProvider } from '@/shared/hooks/use-query-provider';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { DataProvider } from '@/shared/hooks/use-data-store';
import React from 'react';
import { ThemeProvider } from "@/shared/components/theme-provider";
import { ProtectedRoute } from '@/shared/components/auth/protected-route';
import { AppShell } from '@/shared/components/layout/app-shell';

import '@/tasia/theme/global.tasia.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// This metadata is now static as the dynamic parts were causing issues.
// export const metadata: Metadata = {
//   title: 'TASIA',
//   description: 'Real Estate Management Platform',
// };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="el" suppressHydrationWarning>
      <head>
          <title>TASIA</title>
          <meta name="description" content="Real Estate Management Platform" />
      </head>
      <body className={`${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <QueryProvider>
              <AuthProvider>
                <DataProvider>
                  <SidebarProvider>
                    <ProtectedRoute>
                        <AppShell>
                            {children}
                        </AppShell>
                    </ProtectedRoute>
                  </SidebarProvider>
                </DataProvider>
              </AuthProvider>
            </QueryProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
