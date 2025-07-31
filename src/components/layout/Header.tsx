"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar/sidebar-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Breadcrumbs } from "./breadcrumbs";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const ModeToggle = dynamic(
  () =>
    import("@/components/layout/mode-toggle.tsx").then(
      (mod) => mod.ModeToggle,
    ),
  {
    loading: () => <Skeleton className="h-8 w-8 rounded-full" />,
    ssr: false,
  },
);

export function AppHeader() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const pathname = usePathname();
  const breadcrumbs = useBreadcrumbs();

  const showBreadcrumbs =
    breadcrumbs.length > 0 &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register") &&
    pathname !== "/";

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-sidebar-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex-1">
        {showBreadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        {isAuthLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.photoURL ?? ""}
                    alt={user.displayName ?? "User"}
                  />
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName ?? "My Account"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleLogin}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
