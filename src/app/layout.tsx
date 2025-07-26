
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/shared/components/theme-provider';
import { AuthProvider } from '@/shared/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/shared/hooks/use-query-provider';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { DataProvider } from '@/shared/hooks/use-data-store';
import React from 'react';
import { usePathname } from 'next/navigation';
import { AppShell as TasiaAppShell } from '@/tasia/components/layout/app-shell';
import NestorLayout from '@/nestor/app/(main)/layout';

import '@/tasia/theme/global.tasia.css';
import '@/nestor/theme/global.nestor.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const NestorAppShell = React.lazy(() => import('@/nestor/app/(main)/layout').then(module => ({ default: module.default })));

function DomainSpecificLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNestor = pathname.startsWith('/nestor');
  const domainClass = isNestor ? 'nestor' : 'tasia';
  
  const AppShell = isNestor ? NestorAppShell : TasiaAppShell;
  
  return (
      <body className={`${inter.variable} ${domainClass}`}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <AppShell>{children}</AppShell>
          </React.Suspense>
          <Toaster />
      </body>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <DataProvider>
              <SidebarProvider>
                <DomainSpecificLayout>
                  {children}
                </DomainSpecificLayout>
              </SidebarProvider>
            </DataProvider>
          </AuthProvider>
        </QueryProvider>
    </html>
  );
}
