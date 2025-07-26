
'use client';

import { usePathname } from 'next/navigation';
import type { Domain } from '../types/domain';

/**
 * A simple hook to determine the current application domain ('tasia' or 'nestor')
 * based on the URL pathname.
 * 
 * @returns {Domain} The current domain.
 */
export function useCurrentDomain(): Domain {
  const pathname = usePathname();

  if (pathname.startsWith('/nestor')) {
    return 'nestor';
  }
  
  return 'tasia';
}
