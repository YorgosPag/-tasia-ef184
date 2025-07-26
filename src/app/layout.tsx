
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/shared/components/theme-provider';
import { AuthProvider } from '@/shared/hooks/use-auth';
import { Toaster } from '@/shared/components/ui/toaster';
import { QueryProvider } from '@/shared/hooks/use-query-provider';
import { SidebarProvider } from '@/shared/components/ui/sidebar/sidebar-provider';
import { DataProvider } from '@/shared/hooks/use-data-store';
import { DomainLayout } from './DomainLayout';
import '@/tasia/theme/global.tasia.css';
import '@/nestor/theme/global.nestor.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TASIA',
  description: 'Real Estate Management Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <QueryProvider>
          <AuthProvider>
            <DataProvider>
              <SidebarProvider>
                  <DomainLayout>
                      {children}
                  </DomainLayout>
                  <Toaster />
              </SidebarProvider>
            </DataProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
