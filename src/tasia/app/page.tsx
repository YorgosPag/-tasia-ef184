
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the projects page by default
    router.replace('/tasia/projects');
  }, [router]);

  return null;
}
