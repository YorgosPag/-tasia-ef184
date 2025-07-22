
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { doc, getDoc, DocumentData, getDocs, collection, query, where, Query, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BreadcrumbItem } from '@/components/layout/breadcrumbs';

// Cache to store fetched documents and avoid redundant Firestore reads
const docCache = new Map<string, DocumentData>();

async function getDocFromFirestore(collectionName: string, id: string): Promise<DocumentData | null> {
  if (!id || !collectionName) return null;
  const cacheKey = `${collectionName}/${id}`;
  if (docCache.has(cacheKey)) {
    return docCache.get(cacheKey) || null;
  }
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      docCache.set(cacheKey, data);
      return data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch from ${collectionName}/${id}:`, error);
    return null;
  }
}

async function getDocsFromFirestore(collectionName: string, ids: string[]): Promise<DocumentData[]> {
    if (!ids || ids.length === 0) return [];
    
    const results: DocumentData[] = [];
    const idsToFetch: string[] = [];

    // Check cache first
    for (const id of ids) {
        const cacheKey = `${collectionName}/${id}`;
        if (docCache.has(cacheKey)) {
            results.push(docCache.get(cacheKey)!);
        } else {
            idsToFetch.push(id);
        }
    }
    
    if (idsToFetch.length > 0) {
        try {
            // Firestore 'in' query is limited to 30 elements
            const chunks = [];
            for (let i = 0; i < idsToFetch.length; i += 30) {
                chunks.push(idsToFetch.slice(i, i + 30));
            }

            for (const chunk of chunks) {
                const q = query(collection(db, collectionName), where('__name__', 'in', chunk));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(docSnap => {
                    const data = { id: docSnap.id, ...docSnap.data() };
                    const cacheKey = `${collectionName}/${docSnap.id}`;
                    docCache.set(cacheKey, data);
                    results.push(data);
                });
            }
        } catch (error) {
            console.error(`Failed to fetch from ${collectionName} with ids:`, error);
        }
    }
    
    // Return in the original order
    return ids.map(id => results.find(res => res.id === id)).filter(Boolean) as DocumentData[];
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
    let newBreadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    for (let i = 0; i < pathSegments.length; i++) {
        currentPath += `/${pathSegments[i]}`;
        const segment = pathSegments[i];

        if (staticPathLabels[segment]) {
            newBreadcrumbs.push({ href: currentPath, label: staticPathLabels[segment] });
        } else if (i > 0) {
            const parentSegment = pathSegments[i - 1];
            const collectionName = collectionNameMap[parentSegment];
            
            if (collectionName) {
                const docData = await getDocFromFirestore(collectionName, segment);
                if (docData) {
                    const currentItemLabel = docData.title || docData.address || docData.name || docData.identifier || segment;
                    
                    let companyData: DocumentData | null = null;
                    let projectData: DocumentData | null = null;
                    let buildingData: DocumentData | null = null;
                    let floorData: DocumentData | null = null;
                    let unitData: DocumentData | null = null;

                    // --- Build hierarchy upwards from the current document ---
                    if (collectionName === 'units') {
                        unitData = docData;
                        if (unitData?.floorIds?.length > 0) {
                             const floors = await getDocsFromFirestore('floors', unitData.floorIds);
                             if (floors.length > 0) {
                                floorData = floors[0]; // Use first floor for hierarchy lookup
                                if(unitData.levelSpan) {
                                    unitData.displayLevel = unitData.levelSpan;
                                } else {
                                    unitData.displayLevel = "Όροφοι: " + floors.map(f => f.level).join(', ');
                                }
                             }
                        }
                        if (unitData?.buildingId) buildingData = await getDocFromFirestore('buildings', unitData.buildingId);
                    } else if (collectionName === 'floors') {
                        floorData = docData;
                        if (floorData?.buildingId) buildingData = await getDocFromFirestore('buildings', floorData.buildingId);
                    } else if (collectionName === 'buildings') {
                        buildingData = docData;
                    } else if (collectionName === 'projects') {
                        projectData = docData;
                    } else if (collectionName === 'companies') {
                        companyData = docData;
                    }

                    if (buildingData?.projectId && !projectData) {
                        projectData = await getDocFromFirestore('projects', buildingData.projectId);
                    }
                    if (projectData?.companyId && !companyData) {
                        companyData = await getDocFromFirestore('companies', projectData.companyId);
                    }

                    // --- Construct the final breadcrumb array ---
                    let constructedCrumbs: BreadcrumbItem[] = [];
                    if (companyData) constructedCrumbs.push({ href: `/companies`, label: companyData.name || 'Εταιρείες' });
                    if (projectData) constructedCrumbs.push({ href: `/projects/${projectData.id}`, label: projectData.title || 'Έργο' });
                    if (buildingData) constructedCrumbs.push({ href: `/buildings/${buildingData.id}`, label: buildingData.address || 'Κτίριο' });
                    
                    if (floorData && collectionName !== 'units') {
                         constructedCrumbs.push({ href: `/floors/${floorData.id}`, label: `Όροφος ${floorData.level}` || 'Όροφος' });
                    }
                    if(unitData) {
                        const floorLabel = unitData.displayLevel || 'Όροφος';
                        constructedCrumbs.push({ href: `/floors/${floorData?.id}`, label: floorLabel });
                    }

                    newBreadcrumbs = [...constructedCrumbs, { href: currentPath, label: currentItemLabel }];

                } else {
                     newBreadcrumbs.push({ href: currentPath, label: segment }); // Fallback to ID
                }
            }
        }
    }
    
    // Remove duplicate breadcrumbs by href (important for deep hierarchies)
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
