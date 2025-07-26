
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

// Dynamically import CSS files
import '@/tasia/theme/global.tasia.css';
import '@/nestor/theme/global.nestor.css';

// Dynamically import shell components
const TasiaAppShell = React.lazy(() => import('@/tasia/components/layout/app-shell').then(module => ({ default: module.AppShell })));
const NestorAppShell = React.lazy(() => import('@/nestor/app/(main)/layout').then(module => ({ default: module.default })));


export function DomainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isNestor = pathname.startsWith('/nestor');
  const domainClass = isNestor ? 'nestor' : 'tasia';
  
  const AppShell = isNestor ? NestorAppShell : TasiaAppShell;
  
  return (
      <body className={`${domainClass}`}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <AppShell>{children}</AppShell>
          </React.Suspense>
      </body>
  );
}
