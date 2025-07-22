
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
    if (pathSegments.length === 0) {
        setBreadcrumbs([]);
        return;
    }

    let currentPath = '';
    const breadcrumbPromises: Promise<BreadcrumbItem | null>[] = [];

    let companyData: DocumentData | null = null;
    let projectData: DocumentData | null = null;
    let buildingData: DocumentData | null = null;
    let floorData: DocumentData | null = null;
    let unitData: DocumentData | null = null;

    const parentSegment = pathSegments[pathSegments.length - 2];
    const currentSegment = pathSegments[pathSegments.length - 1];
    const collectionName = collectionNameMap[parentSegment];
    
    if (collectionName) {
        const docData = await getDocFromFirestore(collectionName, currentSegment);

        if (docData) {
            if (collectionName === 'units') unitData = docData;
            if (collectionName === 'floors') floorData = docData;
            if (collectionName === 'buildings') buildingData = docData;
            if (collectionName === 'projects') projectData = docData;
            if (collectionName === 'companies') companyData = docData;

            if (unitData?.floorIds?.length > 0) {
                const floors = await getDocsFromFirestore('floors', unitData.floorIds);
                if (floors.length > 0) floorData = floors[0]; // Use first floor for hierarchy lookup
            }
            if (floorData?.buildingId) buildingData = await getDocFromFirestore('buildings', floorData.buildingId);
            if (buildingData?.projectId) projectData = await getDocFromFirestore('projects', buildingData.projectId);
            if (projectData?.companyId) companyData = await getDocFromFirestore('companies', projectData.companyId);
        }
    }
    
    let tempBreadcrumbs: BreadcrumbItem[] = [];

    if (companyData) tempBreadcrumbs.push({ href: `/companies`, label: companyData.name || 'Εταιρείες' });
    if (projectData) tempBreadcrumbs.push({ href: `/projects/${projectData.id}`, label: projectData.title || 'Έργο' });
    if (buildingData) tempBreadcrumbs.push({ href: `/buildings/${buildingData.id}`, label: buildingData.address || 'Κτίριο' });
    
    if (floorData) {
        let label = `Όροφος ${floorData.level}`;
        if(unitData?.levelSpan) {
            label = unitData.levelSpan;
        } else if (unitData?.floorIds?.length > 1) {
            const floors = await getDocsFromFirestore('floors', unitData.floorIds);
            label = "Όροφοι: " + floors.map(f => f.level).join(', ');
        }
        tempBreadcrumbs.push({ href: `/floors/${floorData.id}`, label: label || 'Όροφος' });
    }
    
    if (unitData) tempBreadcrumbs.push({ href: `/units/${unitData.id}`, label: unitData.name || 'Ακίνητο' });
    
    if (tempBreadcrumbs.length === 0 && staticPathLabels[currentSegment]) {
        tempBreadcrumbs.push({ href: `/${currentSegment}`, label: staticPathLabels[currentSegment] });
    }

    const uniqueCrumbs = tempBreadcrumbs.reduce((acc, current) => {
        if (!acc.find(item => item.href === current.href)) {
            acc.push(current);
        }
        return acc;
    }, [] as BreadcrumbItem[]);

    setBreadcrumbs(uniqueCrumbs);

  }, [pathname]);


  useEffect(() => {
    generateBreadcrumbs();
  }, [pathname, generateBreadcrumbs]);

  return breadcrumbs;
}
