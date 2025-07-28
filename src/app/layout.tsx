
'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/shared/lib/utils';
import { ThemeProvider } from '@/shared/components/theme-provider';
import { AuthProvider } from '@/shared/hooks/use-auth';
import { DataProvider } from '@/shared/hooks/use-data-store';
import { QueryProvider } from '@/shared/hooks/use-query-provider';
import { Toaster } from '@/shared/components/ui/toaster';

import '@/app/globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <DataProvider>
                   {children}
                   <Toaster />
              </DataProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
