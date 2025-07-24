
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
    docCache.set(cacheKey, null);
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
      const entityId = segments[1];

      // Handle static/list pages first
      if (segments.length === 1 && STATIC_LABELS[mainSegment]) {
        setBreadcrumbs([{ href: `/${mainSegment}`, label: STATIC_LABELS[mainSegment] }]);
        return;
      }

      // Handle detail pages
      const collectionName = COLLECTION_NAMES[mainSegment];
      if (!collectionName || !entityId) {
        setBreadcrumbs([]);
        return;
      }
      
      const currentEntity = await getDocFromFirestore(collectionName, entityId);
      if (!currentEntity) {
        setBreadcrumbs([]);
        return;
      }

      // --- Start the bottom-up traversal ---
      let companyId: string | undefined;
      let projectId: string | undefined;
      let buildingId: string | undefined;
      let floorId: string | undefined;
      let unitId: string | undefined;

      switch(collectionName) {
        case 'units':
          unitId = currentEntity.id;
          floorId = currentEntity.floorIds?.[0];
          buildingId = currentEntity.buildingId;
          projectId = currentEntity.projectId;
          companyId = currentEntity.companyId;
          break;
        case 'floors':
          floorId = currentEntity.id;
          buildingId = currentEntity.buildingId;
          // Need to fetch building to get project/company
          break;
        case 'buildings':
          buildingId = currentEntity.id;
          projectId = currentEntity.projectId;
          // Need to fetch project to get company
          break;
        case 'projects':
          projectId = currentEntity.id;
          companyId = currentEntity.companyId;
          break;
        case 'companies':
          companyId = currentEntity.id;
          break;
      }

      // Fetch any missing parent documents based on the traversal
      if (floorId && !buildingId) {
        const floorDoc = await getDocFromFirestore('floors', floorId);
        buildingId = floorDoc?.buildingId;
      }
      if (buildingId && !projectId) {
        const buildingDoc = await getDocFromFirestore('buildings', buildingId);
        projectId = buildingDoc?.projectId;
      }
      if (projectId && !companyId) {
        const projectDoc = await getDocFromFirestore('projects', projectId);
        companyId = projectDoc?.companyId;
      }
      
      // Fetch all documents in parallel
      const [company, project, building, floor, unit] = await Promise.all([
        companyId ? getDocFromFirestore('companies', companyId) : Promise.resolve(null),
        projectId ? getDocFromFirestore('projects', projectId) : Promise.resolve(null),
        buildingId ? getDocFromFirestore('buildings', buildingId) : Promise.resolve(null),
        floorId ? getDocFromFirestore('floors', floorId) : Promise.resolve(null),
        unitId ? getDocFromFirestore('units', unitId) : Promise.resolve(null),
      ]);

      // Build the breadcrumbs array in the correct order
      const crumbs: BreadcrumbItem[] = [];
      if (company) crumbs.push({ href: `/companies`, label: company.name, tooltip: "Go to Companies List" });
      if (project) crumbs.push({ href: `/projects/${project.id}`, label: project.title });
      if (building) crumbs.push({ href: `/buildings/${building.id}`, label: building.address || "Building" });
      if (floor) crumbs.push({ href: `/floors/${floor.id}`, label: `Όροφος ${floor.level}` });
      if (unit) crumbs.push({ href: `/units/${unit.id}`, label: unit.name || "Unit" });
      
      setBreadcrumbs(crumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return breadcrumbs;
}
