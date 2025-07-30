
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/register'];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const pathIsPublic = publicPaths.includes(pathname);
  
  // --- START TEMPORARY AUTH BYPASS ---
  const bypassAuth = false; 
  if (bypassAuth) {
    return <>{children}</>;
  }
  // --- END TEMPORARY AUTH BYPASS ---

  useEffect(() => {
    if (isLoading) {
      // Don't do anything while auth state is loading
      return;
    }

    if (!user && !pathIsPublic) {
      // If user is not logged in and trying to access a protected route
      router.push('/login');
    } else if (user && pathIsPublic) {
      // If user is logged in and trying to access a public route (like login)
      router.push('/dashboard');
    }

  }, [user, isLoading, pathname, router, pathIsPublic]);
  
  if (isLoading && !pathIsPublic) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  // If the path is public, we can show it immediately
  // Otherwise, we wait for the user object to be resolved
  if (pathIsPublic || user) {
      return <>{children}</>;
  }

  // Fallback for non-auth'd users on protected pages, while redirecting
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}
