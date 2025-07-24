
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BreadcrumbItem } from '@/components/layout/breadcrumbs';

// Cache to avoid re-fetching the same documents within a session
const docCache = new Map<string, DocumentData | null>();

async function getDocFromFirestore(collectionName: string, id: string): Promise<DocumentData | null> {
  if (!id || !collectionName) return null;
  
  const cacheKey = `${collectionName}/${id}`;
  // For this hook, we want fresh data on each navigation to avoid stale breadcrumbs.
  // if (docCache.has(cacheKey)) {
  //   return docCache.get(cacheKey) || null;
  // }

  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      docCache.set(cacheKey, data);
      return data;
    }
    docCache.set(cacheKey, null); // Cache the miss
    return null;
  } catch (error) {
    console.error(`Failed to fetch from ${collectionName}/${id}:`, error);
    return null;
  }
}

const STATIC_LABELS: Record<string, string> = {
  'companies': 'Εταιρείες',
  'projects': 'Έργα',
  'buildings': 'Κτίρια',
  'floors': 'Όροφοι',
  'units': 'Ακίνητα',
  'attachments': 'Παρακολουθήματα',
  'audit-log': 'Audit Log',
  'users': 'User Management',
  'settings': 'Ρυθμίσεις',
};

const COLLECTION_NAMES: Record<string, string> = {
  companies: 'companies',
  projects: 'projects',
  buildings: 'buildings',
  floors: 'floors',
  units: 'units',
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const segments = pathname.split('/').filter(Boolean);
      
      if (segments.length === 0) {
        setBreadcrumbs([]);
        return;
      }
      
      const mainSegment = segments[0];
      
      // Handle static pages first (list pages, settings, etc.)
      if (segments.length === 1 && STATIC_LABELS[mainSegment]) {
          setBreadcrumbs([{ href: `/${mainSegment}`, label: STATIC_LABELS[mainSegment] }]);
          return;
      }

      // Handle detail pages
      const collectionName = COLLECTION_NAMES[mainSegment];
      if (!collectionName || segments.length < 2) {
        setBreadcrumbs([]);
        return;
      }

      const entityId = segments[1];
      const currentEntity = await getDocFromFirestore(collectionName, entityId);

      if (!currentEntity) {
          if (STATIC_LABELS[mainSegment]) {
              setBreadcrumbs([{ href: `/${mainSegment}`, label: STATIC_LABELS[mainSegment] }]);
          } else {
              setBreadcrumbs([]);
          }
          return;
      }
      
      let company: DocumentData | null = null;
      let project: DocumentData | null = null;
      let building: DocumentData | null = null;
      let floor: DocumentData | null = null;
      let unit: DocumentData | null = null;
      
      // Follow the hierarchy up from the current entity
      switch (collectionName) {
          case 'units':
              unit = currentEntity;
              if (unit?.floorIds?.length > 0) floor = await getDocFromFirestore('floors', unit.floorIds[0]);
              // Fallthrough is intentional
          case 'floors':
              floor = floor || (collectionName === 'floors' ? currentEntity : null);
              if (floor?.buildingId) building = await getDocFromFirestore('buildings', floor.buildingId);
              // Fallthrough is intentional
          case 'buildings':
              building = building || (collectionName === 'buildings' ? currentEntity : null);
              if (building?.projectId) project = await getDocFromFirestore('projects', building.projectId);
              // Fallthrough is intentional
          case 'projects':
              project = project || (collectionName === 'projects' ? currentEntity : null);
              if (project?.companyId) company = await getDocFromFirestore('companies', project.companyId);
              break;
      }
      
      const newCrumbs: BreadcrumbItem[] = [];

      if (company) {
        newCrumbs.push({ href: `/companies`, label: company.name, tooltip: 'Go to company list' });
      }

      if (project) {
        newCrumbs.push({ href: `/projects`, label: 'Έργα' });
        newCrumbs.push({ href: `/projects/${project.id}`, label: project.title });
      }

      if (building) {
          newCrumbs.push({ href: `/buildings`, label: 'Κτίρια' });
          newCrumbs.push({ href: `/buildings/${building.id}`, label: building.address });
      }
      if (floor) {
          newCrumbs.push({ href: `/floors`, label: 'Όροφοι' });
          newCrumbs.push({ href: `/floors/${floor.id}`, label: `Όροφος ${floor.level}` });
      }
      if (unit) {
          newCrumbs.push({ href: `/units`, label: 'Ακίνητα' });
          newCrumbs.push({ href: `/units/${unit.id}`, label: unit.name });
      }
      
      const uniqueCrumbs = newCrumbs.filter((crumb, index, self) =>
          index === self.findIndex((c) => c.href === crumb.href)
      );

      setBreadcrumbs(uniqueCrumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return breadcrumbs;
}
