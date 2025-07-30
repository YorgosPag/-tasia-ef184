
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        // You can redirect to a login page here if you have one
        // For now, it will just stay on a blank page or you can show a message.
        // router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}
