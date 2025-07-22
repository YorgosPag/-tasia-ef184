
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BreadcrumbItem } from '@/components/layout/breadcrumbs';

// Cache to store fetched documents and avoid redundant Firestore reads
const docCache = new Map<string, DocumentData>();

async function getDocFromFirestore(collection: string, id: string): Promise<DocumentData | null> {
  if (!id) return null;
  const cacheKey = `${collection}/${id}`;
  if (docCache.has(cacheKey)) {
    return docCache.get(cacheKey) || null;
  }
  try {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      docCache.set(cacheKey, data);
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch from ${collection}/${id}:`, error);
    return null;
  }
}


const staticPathLabels: Record<string, string> = {
  projects: 'Έργα',
  companies: 'Εταιρείες',
  buildings: 'Κτίρια',
  floors: 'Όροφοι',
  units: 'Ακίνητα',
};

const collectionNameMap: Record<string, string> = {
    projects: 'projects',
    companies: 'companies',
    buildings: 'buildings',
    floors: 'floors',
    units: 'units',
};

/**
 * A custom hook to dynamically generate breadcrumb navigation items.
 * It analyzes the current URL pathname and fetches necessary data from Firestore
 * to build a meaningful, hierarchical breadcrumb trail.
 */
export function useBreadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const generateBreadcrumbs = useCallback(async () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const newBreadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    for (let i = 0; i < pathSegments.length; i++) {
        currentPath += `/${pathSegments[i]}`;
        const segment = pathSegments[i];
        const isLastSegment = i === pathSegments.length - 1;

        if (staticPathLabels[segment]) {
            newBreadcrumbs.push({ href: currentPath, label: staticPathLabels[segment] });
        } else if (i > 0) {
            const parentSegment = pathSegments[i - 1];
            const collectionName = collectionNameMap[parentSegment];
            
            if (collectionName) {
                const docData = await getDocFromFirestore(collectionName, segment);
                if (docData) {
                    const label = docData.title || docData.address || docData.level || docData.name || docData.identifier || segment;
                    
                    const parentCrumbs: BreadcrumbItem[] = [];

                    let companyData, projectData, buildingData;
                    
                    if (docData.companyId) {
                        companyData = await getDocFromFirestore('companies', docData.companyId);
                    }
                    if (docData.projectId) {
                        projectData = await getDocFromFirestore('projects', docData.projectId);
                        if(projectData && !companyData) {
                             companyData = await getDocFromFirestore('companies', projectData.companyId);
                        }
                    }
                     if (docData.buildingId) {
                         buildingData = await getDocFromFirestore('buildings', docData.buildingId);
                         if(buildingData && !projectData) {
                             projectData = await getDocFromFirestore('projects', buildingData.projectId);
                             if(projectData && !companyData) {
                                 companyData = await getDocFromFirestore('companies', projectData.companyId);
                             }
                         }
                    }
                    
                    // Build breadcrumbs in correct order: Company > Project > Building > Floor
                    if (companyData) parentCrumbs.push({ href: `/companies`, label: companyData.name || 'Εταιρείες' });
                    if (projectData) parentCrumbs.push({ href: `/projects/${projectData.id || docData.projectId}`, label: projectData.title || docData.projectId });
                    if (buildingData) parentCrumbs.push({ href: `/buildings/${docData.buildingId}`, label: buildingData.address || docData.buildingId });
                    
                    if(docData.floorId) {
                        const floorData = await getDocFromFirestore('floors', docData.floorId);
                        if(floorData) parentCrumbs.push({ href: `/floors/${docData.floorId}`, label: `Όροφος ${floorData.level}` || docData.floorId});
                    }

                    // Replace the generic list item (e.g., "Έργα") with the full path
                    const staticParentIndex = newBreadcrumbs.findIndex(crumb => crumb.href === `/${parentSegment}`);
                    if (staticParentIndex !== -1) {
                        newBreadcrumbs.splice(staticParentIndex, 1, ...parentCrumbs);
                    } else {
                        newBreadcrumbs.push(...parentCrumbs);
                    }
                    
                    newBreadcrumbs.push({ href: currentPath, label });
                } else {
                     newBreadcrumbs.push({ href: currentPath, label: segment }); // Fallback to ID
                }
            }
        }
    }
    
    // Remove duplicate breadcrumbs by href
    const uniqueBreadcrumbs = newBreadcrumbs.filter((crumb, index, self) =>
        index === self.findIndex((c) => c.href === crumb.href)
    );

    setBreadcrumbs(uniqueBreadcrumbs);
  }, [pathname]);


  useEffect(() => {
    generateBreadcrumbs();
  }, [pathname, generateBreadcrumbs]);

  return breadcrumbs;
}
