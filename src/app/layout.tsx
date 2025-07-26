
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/tasia/theme/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/hooks/use-query-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DataProvider } from '@/hooks/use-data-store';
import { DomainLayout } from './DomainLayout';

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
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
      </ThemeProvider>
    </html>
  );
}
