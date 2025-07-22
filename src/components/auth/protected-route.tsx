
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/register'];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give time for the auth state to be determined
    const timer = setTimeout(() => {
        if (user === undefined) {
            // Still loading auth state
            return;
        }

        const pathIsPublic = publicPaths.includes(pathname);

        if (!user && !pathIsPublic) {
            // If user is not logged in and trying to access a protected route
            router.push('/login');
        } else if (user && pathIsPublic) {
            // If user is logged in and trying to access a public route (like login)
            router.push('/');
        } else {
            // Allow access
            setIsLoading(false);
        }
    }, 100); // A small delay to avoid flicker as auth state loads

    return () => clearTimeout(timer);

  }, [user, pathname, router]);
  
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


  return <>{children}</>;
}
