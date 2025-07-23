
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { doc, getDoc, DocumentData, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BreadcrumbItem } from '@/components/layout/breadcrumbs';

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

    for (const id of ids) {
        const cacheKey = `${collectionName}/${id}`;
        if (docCache.has(cacheKey)) {
            const doc = docCache.get(cacheKey);
            if(doc) results.push(doc);
        } else {
            idsToFetch.push(id);
        }
    }
    
    if (idsToFetch.length > 0) {
        try {
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

export function useBreadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  const generateBreadcrumbs = useCallback(async () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) {
        setBreadcrumbs([]);
        return;
    }

    let tempBreadcrumbs: BreadcrumbItem[] = [];
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // Handle top-level list pages e.g., /projects
    if (pathSegments.length === 1 && staticPathLabels[lastSegment]) {
        tempBreadcrumbs.push({ 
            href: `/${lastSegment}`, 
            label: staticPathLabels[lastSegment],
            tooltip: 'Λίστα',
        });
        setBreadcrumbs(tempBreadcrumbs);
        return;
    }
    
    // Handle details pages e.g., /units/some-id
    if (pathSegments.length > 1 && collectionNameMap[pathSegments[0]]) {
      const collectionSlug = pathSegments[0];
      const entityId = pathSegments[1];
      const collectionName = collectionNameMap[collectionSlug];
      
      const currentEntity = await getDocFromFirestore(collectionName, entityId);
      if (!currentEntity) {
        // Fallback for list pages if direct fetch fails
        if (staticPathLabels[collectionSlug]) {
             setBreadcrumbs([{ href: `/${collectionSlug}`, label: staticPathLabels[collectionSlug], tooltip: 'Λίστα' }]);
        }
        return;
      }

      let company: DocumentData | null = null;
      let project: DocumentData | null = null;
      let building: DocumentData | null = null;
      let floor: DocumentData | null = null;
      let unit: DocumentData | null = null;
      
      // Build hierarchy upwards from the current entity
      switch(collectionName) {
        case 'units':
            unit = currentEntity;
            if (unit?.floorIds?.length > 0) {
                const floors = await getDocsFromFirestore('floors', unit.floorIds);
                if (floors.length > 0) floor = floors[0];
            }
            if (unit?.buildingId) building = await getDocFromFirestore('buildings', unit.buildingId);
            if (unit?.projectId) project = await getDocFromFirestore('projects', unit.projectId);
            if (unit?.companyId) company = await getDocFromFirestore('companies', unit.companyId);
            break;
        case 'floors':
            floor = currentEntity;
            if (floor?.buildingId) building = await getDocFromFirestore('buildings', floor.buildingId);
            if (building?.projectId) project = await getDocFromFirestore('projects', building.projectId);
            if (project?.companyId) company = await getDocFromFirestore('companies', project.companyId);
            break;
        case 'buildings':
            building = currentEntity;
            if (building?.projectId) project = await getDocFromFirestore('projects', building.projectId);
            if (project?.companyId) company = await getDocFromFirestore('companies', project.companyId);
            break;
        case 'projects':
            project = currentEntity;
            if (project?.companyId) company = await getDocFromFirestore('companies', project.companyId);
            break;
        case 'companies':
            company = currentEntity;
            break;
      }

      // Assemble breadcrumbs from the fetched hierarchy
      if (company) {
        tempBreadcrumbs.push({ 
            href: `/companies`, 
            label: 'Εταιρείες',
        });
      }

      if (project) {
        tempBreadcrumbs.push({ 
            href: `/projects`, 
            label: 'Έργα',
        });
        tempBreadcrumbs.push({ 
            href: `/projects/${project.id}`, 
            label: project.title,
            tooltip: project.title,
        });
      }
      if (building) {
        tempBreadcrumbs.push({ 
            href: `/buildings`, 
            label: 'Κτίρια',
        });
        tempBreadcrumbs.push({ 
            href: `/buildings/${building.id}`, 
            label: building.address,
            tooltip: building.address,
        });
      }
      if (floor) {
        let floorLabel = `Όροφος ${floor.level}`;
        if(unit?.levelSpan) {
            floorLabel = unit.levelSpan;
        } else if (unit?.floorIds?.length > 1) {
            const floorsData = await getDocsFromFirestore('floors', unit.floorIds);
            floorLabel = "Όροφοι: " + floorsData.map(f => f.level).join(', ');
        }
        tempBreadcrumbs.push({ 
            href: `/floors`, 
            label: 'Όροφοι',
        });
        tempBreadcrumbs.push({ 
            href: `/floors/${floor.id}`, 
            label: floorLabel,
            tooltip: 'Όροφος/οι',
        });
      }

      if (unit) {
        tempBreadcrumbs.push({ 
            href: `/units`, 
            label: 'Ακίνητα',
        });
        tempBreadcrumbs.push({ 
            href: `/units/${unit.id}`, 
            label: unit.name,
            tooltip: 'Ακίνητο',
        });
      }

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
