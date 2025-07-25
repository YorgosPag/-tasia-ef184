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
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// Conditionally import styles
import '@/tasia/theme/global.tasia.css';
import '@/nestor/theme/global.nestor.css';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const domainClass = pathname.startsWith('/nestor') ? 'nestor' : 'tasia';

  return (
    <html lang="el" suppressHydrationWarning>
      <head>
        <title>TASIA</title>
        <meta name="description" content="Ευρετήριο Ακινήτων" />
      </head>
      <body className={cn('font-sans', inter.variable, domainClass)}>
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
                    {children}
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
