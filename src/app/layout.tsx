
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/shared/components/layout/AppShell';
import { AppSidebar } from '@/shared/components/layout/Sidebar';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Toaster } from '@/components/ui/toaster';
import { QueryProvider } from '@/hooks/use-query-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DataProvider } from '@/hooks/use-data-store';
import { useCurrentDomain } from '@/shared/hooks/useCurrentDomain';


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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} tasia`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <DataProvider>
                <SidebarProvider>
                   <ProtectedRoute>
                      <div className="flex min-h-screen">
                        <AppSidebar />
                        <AppShell>{children}</AppShell>
                      </div>
                    </ProtectedRoute>
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
