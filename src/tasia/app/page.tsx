
'use client';

// This page is now a client component that redirects to the dashboard.
// The actual redirect logic is handled in next.config.js for a permanent server-side redirect.
// This file serves as a fallback.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
