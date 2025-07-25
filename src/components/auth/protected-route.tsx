
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

  // useEffect(() => {
  //   if (isLoading) {
  //     // Don't do anything while auth state is loading
  //     return;
  //   }

  //   const pathIsPublic = publicPaths.includes(pathname);

  //   if (!user && !pathIsPublic) {
  //     // If user is not logged in and trying to access a protected route
  //     router.push('/login');
  //   } else if (user && pathIsPublic) {
  //     // If user is logged in and trying to access a public route (like login)
  //     router.push('/');
  //   }

  // }, [user, isLoading, pathname, router]);
  
  // While determining auth status, show a loader
  if (isLoading && !publicPaths.includes(pathname)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }
  
  // For public pages, render them immediately without the main layout
  if (publicPaths.includes(pathname)) {
      return <>{children}</>;
  }

  // Since we are bypassing login, we will no longer show a loader here.
  // The app will just render.
  // if (!isLoading && !user && !publicPaths.includes(pathname)) {
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center">
  //       <Loader2 className="h-16 w-16 animate-spin" />
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
