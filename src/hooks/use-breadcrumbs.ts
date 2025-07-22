
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BreadcrumbItem } from '@/components/layout/breadcrumbs';

// Maps path segments to their parent path and human-readable name
const pathSegmentMap: Record<string, { parent: string; name: string }> = {
    'projects': { parent: '/', name: 'Έργα' },
    'companies': { parent: '/', name: 'Εταιρείες' },
    'buildings': { parent: '/', name: 'Κτίρια' },
    'floors': { parent: '/', name: 'Όροφοι' },
    'units': { parent: '/', name: 'Ακίνητα' },
};

/**
 * A custom hook to dynamically generate breadcrumb navigation items.
 * It analyzes the current URL pathname and fetches necessary data from Firestore
 * to build a meaningful breadcrumb trail.
 */
export function useBreadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { href: '/', label: 'Αρχική' },
  ]);

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const pathSegments = pathname.split('/').filter(Boolean);
      const newBreadcrumbs: BreadcrumbItem[] = [{ href: '/', label: 'Αρχική' }];
      
      let currentPath = '';

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        currentPath += `/${segment}`;
        
        const isDynamicSegment = i > 0 && pathSegments[i-1] in pathSegmentMap;
        
        if (isDynamicSegment) {
          // This is an ID, so fetch the document to get its name
          const parentSegment = pathSegments[i-1];
          try {
            const docRef = doc(db, parentSegment, segment);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              const label = data.title || data.address || data.level || data.name || data.identifier || segment;
              newBreadcrumbs.push({ href: currentPath, label });
            } else {
               newBreadcrumbs.push({ href: currentPath, label: segment }); // Fallback to ID
            }
          } catch (e) {
            console.error("Breadcrumb fetch error:", e);
            newBreadcrumbs.push({ href: currentPath, label: segment }); // Fallback
          }
        } else if (pathSegmentMap[segment]) {
           // This is a static segment like 'projects'
           newBreadcrumbs.push({ href: currentPath, label: pathSegmentMap[segment].name });
        }
      }
      
      setBreadcrumbs(newBreadcrumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return breadcrumbs;
}
