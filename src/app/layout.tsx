
'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { DataProvider } from '@/hooks/use-data-store';
import { QueryProvider } from '@/hooks/use-query-provider';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from "@/components/ui/sidebar";

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
                      <SidebarProvider>
                        {children}
                      </SidebarProvider>
                      <Toaster />
                    </DataProvider>
                </AuthProvider>
            </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
