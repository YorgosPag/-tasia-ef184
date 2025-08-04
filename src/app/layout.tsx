import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/hooks/use-query-provider";
import { DataProvider } from "@/hooks/use-data-store";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TASIA",
  description: "A Next-Gen Real Estate Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontSans.className}>
        <QueryProvider>
          <DataProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </DataProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
