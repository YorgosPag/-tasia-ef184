
'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/shared/hooks/use-auth';
import { Toaster } from '@/shared/components/ui/toaster';
import { QueryProvider } from '@/shared/hooks/use-query-provider';
import { SidebarProvider } from '@/shared/components/ui/sidebar';
import { DataProvider } from '@/shared/hooks/use-data-store';
import React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from "@/shared/components/theme-provider";
import TasiaLayout from '@/tasia/app/layout';
import NestorLayout from '@/nestor/app/layout';

import '@/tasia/theme/global.tasia.css';
import '@/nestor/theme/global.nestor.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


function DomainSpecificLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNestor = pathname.startsWith('/nestor');
  
  if (isNestor) {
      return <NestorLayout>{children}</NestorLayout>;
  }
  
  return <TasiaLayout>{children}</TasiaLayout>
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const domainClass = pathname.startsWith('/nestor') ? 'nestor' : 'tasia';

  return (
    <html lang="el" suppressHydrationWarning>
      <body className={`${inter.variable} ${domainClass}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
