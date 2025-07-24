
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
      
      const mainCollectionSegment = segments[0];
      const mainCollectionName = COLLECTION_NAMES[mainCollectionSegment];
      const entityId = segments[1];

      // Handle static pages or list pages
      if (!mainCollectionName || !entityId || entityId === 'new') {
        const staticCrumbs: BreadcrumbItem[] = [];
        let currentPath = '';
        for (const segment of segments) {
            currentPath += `/${segment}`;
            if (STATIC_LABELS[segment]) {
                staticCrumbs.push({ href: currentPath, label: STATIC_LABELS[segment] });
            }
        }
        setBreadcrumbs(staticCrumbs);
        return;
      }

      // --- Logic for detail pages ---
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
          // companyId may or may not be denormalized, we'll fetch it from the project just in case
          break;
        case 'floors':
          floorId = currentEntity.id;
          buildingId = currentEntity.buildingId;
          break;
        case 'buildings':
          buildingId = currentEntity.id;
          projectId = currentEntity.projectId;
          break;
        case 'projects':
          projectId = currentEntity.id;
          companyId = currentEntity.companyId;
          break;
      }

      // Fetch missing parent documents to complete the hierarchy
      const floorDoc = floorId ? await getDocFromFirestore('floors', floorId) : null;
      if (floorDoc && !buildingId) buildingId = floorDoc.buildingId;
      
      const buildingDoc = buildingId ? await getDocFromFirestore('buildings', buildingId) : null;
      if (buildingDoc && !projectId) projectId = buildingDoc.projectId;

      const projectDoc = projectId ? await getDocFromFirestore('projects', projectId) : null;
      if (projectDoc && !companyId) companyId = projectDoc.companyId;

      const companyDoc = companyId ? await getDocFromFirestore('companies', companyId) : null;
      
      const crumbs: BreadcrumbItem[] = [];

      // Build the breadcrumbs array in the correct hierarchical order
      if (companyDoc) crumbs.push({ href: '/companies', label: companyDoc.name || 'Companies', tooltip: `Go to Company: ${companyDoc.name}`});
      if (projectDoc) {
          if (crumbs.length === 0) crumbs.push({ href: '/projects', label: 'Έργα' });
          crumbs.push({ href: `/projects/${projectDoc.id}`, label: projectDoc.title || 'Project' });
      }
      if (buildingDoc) {
          if (crumbs.length === 0) crumbs.push({ href: '/buildings', label: 'Κτίρια' });
          crumbs.push({ href: `/buildings/${buildingDoc.id}`, label: buildingDoc.address || 'Building' });
      }
      if (floorDoc) {
          if (crumbs.length === 0) crumbs.push({ href: '/floors', label: 'Όροφοι' });
          crumbs.push({ href: `/floors/${floorDoc.id}`, label: `Όροφος ${floorDoc.level || ''}`.trim() });
      }
      if (unitId === currentEntity.id) { // Ensure we're on the unit page itself
        if (crumbs.length === 0) crumbs.push({ href: '/units', label: 'Ακίνητα' });
        crumbs.push({ href: `/units/${unitId}`, label: currentEntity.name || 'Unit' });
      }
      
      setBreadcrumbs(crumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return breadcrumbs;
}
