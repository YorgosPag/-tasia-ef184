
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
      router.push('/');
    }

  }, [user, isLoading, pathname, router, pathIsPublic]);
  
  // While determining auth status on non-public pages, show a loader.
  if (isLoading && !pathIsPublic) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  // If the user is authenticated OR if the page is public, show the children.
  if (user || pathIsPublic) {
      return <>{children}</>;
  }

  // Otherwise, the user is not logged in and not on a public page,
  // the useEffect above will handle the redirect, so we show a loader while redirecting.
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}
