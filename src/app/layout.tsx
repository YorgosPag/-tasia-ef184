"use client";

import React, { useEffect } from "react";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { DataProvider } from "@/hooks/use-data-store";
import { QueryProvider } from "@/hooks/use-query-provider";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";

import "@/app/globals.css";

const fontSans = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) =>
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          ),
        )
        .catch((error) =>
          console.error("Service Worker registration failed:", error),
        );
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
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
                  <ProtectedRoute>{children}</ProtectedRoute>
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
