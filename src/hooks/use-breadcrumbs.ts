
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
  'architect-dashboard': 'Architect\'s Dashboard',
  'assignments': 'Οι Αναθέσεις μου',
  'construction': 'Κατασκευή',
  'calendar': 'Ημερολόγιο',
  'leads': 'Leads',
  'meetings': 'Συσκέψεις',
  'templates': 'Πρότυπα',
  'work-stages': 'Πρότυπα Εργασιών',
  'new': 'Δημιουργία',
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

      // Handle simple static pages first
      if (segments.length === 1 && STATIC_LABELS[segments[0]]) {
         setBreadcrumbs([{ href: `/${segments[0]}`, label: STATIC_LABELS[segments[0]] }]);
         return;
      }

      const crumbs: BreadcrumbItem[] = [];
      const mainCollectionSegment = segments[0];
      const mainCollectionName = COLLECTION_NAMES[mainCollectionSegment];
      const entityId = segments[1];

      // Early exit for non-detail pages or unhandled routes
      if (!mainCollectionName || !entityId) {
          // Build from static labels if possible for multi-segment static paths like /construction/calendar
          let currentPath = '';
          for (const segment of segments) {
              currentPath += `/${segment}`;
              if (STATIC_LABELS[segment]) {
                  crumbs.push({ href: currentPath, label: STATIC_LABELS[segment] });
              }
          }
          setBreadcrumbs(crumbs);
          return;
      }
      
      const currentEntity = await getDocFromFirestore(mainCollectionName, entityId);
      if (!currentEntity) {
        setBreadcrumbs([]);
        return;
      }
      
      // --- Start the bottom-up traversal to find all parent IDs ---
      let companyId: string | undefined;
      let projectId: string | undefined;
      let buildingId: string | undefined;
      let floorId: string | undefined;
      let unitId: string | undefined;

      // Initialize IDs based on the current entity type
      switch(mainCollectionName) {
        case 'units':
          unitId = currentEntity.id;
          floorId = currentEntity.floorIds?.[0];
          buildingId = currentEntity.buildingId;
          projectId = currentEntity.projectId;
          companyId = currentEntity.companyId; // Assumes denormalization
          break;
        case 'floors':
          floorId = currentEntity.id;
          buildingId = currentEntity.buildingId;
          // Need to fetch parents
          break;
        case 'buildings':
          buildingId = currentEntity.id;
          projectId = currentEntity.projectId;
          // Need to fetch parents
          break;
        case 'projects':
          projectId = currentEntity.id;
          companyId = currentEntity.companyId;
          break;
      }

      // Fetch missing parent documents to complete the hierarchy
      // This runs sequentially but could be parallelized if needed.
      if (buildingId && !projectId) {
          const buildingDoc = await getDocFromFirestore('buildings', buildingId);
          projectId = buildingDoc?.projectId;
      }
      if (projectId && !companyId) {
          const projectDoc = await getDocFromFirestore('projects', projectId);
          companyId = projectDoc?.companyId;
      }
      
      // Fetch all necessary documents in parallel
      const docsToFetch = [
        companyId ? getDocFromFirestore('companies', companyId) : Promise.resolve(null),
        projectId ? getDocFromFirestore('projects', projectId) : Promise.resolve(null),
        buildingId ? getDocFromFirestore('buildings', buildingId) : Promise.resolve(null),
        floorId ? getDocFromFirestore('floors', floorId) : Promise.resolve(null),
        unitId ? getDocFromFirestore('units', unitId) : Promise.resolve(null),
      ];
      
      const [company, project, building, floor, unit] = await Promise.all(docsToFetch);

      // Build the breadcrumbs array in the correct hierarchical order
      if (company) crumbs.push({ href: `/companies`, label: company.name || 'Company', tooltip: "Go to Companies List" });
      if (project) crumbs.push({ href: `/projects`, label: 'Έργα' });
      if (project) crumbs.push({ href: `/projects/${project.id}`, label: project.title || 'Project' });
      if (building) crumbs.push({ href: `/buildings/${building.id}`, label: building.address || 'Building' });
      if (floor) crumbs.push({ href: `/floors/${floor.id}`, label: `Όροφος ${floor.level || ''}`.trim() });
      if (unit) crumbs.push({ href: `/units/${unit.id}`, label: unit.name || 'Unit' });
      
      setBreadcrumbs(crumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return breadcrumbs;
}
