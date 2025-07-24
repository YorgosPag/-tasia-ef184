
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
  attachments: 'attachments',
};

// Determines if a segment is likely a Firestore document ID (alphanumeric, usually > 15 chars)
const isLikelyId = (segment: string) => /^[a-zA-Z0-9]{16,}$/.test(segment);

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
      
      const lastSegment = segments[segments.length - 1];
      const collectionSegment = segments[segments.length - 2];
      
      // Handle static pages or list pages
      if (!isLikelyId(lastSegment)) {
          const staticCrumbs: BreadcrumbItem[] = [];
          let currentPath = '';
          for (const segment of segments) {
              currentPath += `/${segment}`;
              if (STATIC_LABELS[segment]) {
                  staticCrumbs.push({ href: currentPath, label: STATIC_LABELS[segment], tooltip: STATIC_LABELS[segment] });
              }
          }
          setBreadcrumbs(staticCrumbs);
          return;
      }

      // Handle details pages
      const entityId = lastSegment;
      const mainCollectionName = COLLECTION_NAMES[collectionSegment];
      
      if (!mainCollectionName) {
        setBreadcrumbs([]);
        return;
      }

      const currentEntity = await getDocFromFirestore(mainCollectionName, entityId);
      if (!currentEntity) {
        setBreadcrumbs([]);
        return;
      }

      let companyId: string | undefined;
      let projectId: string | undefined;
      let buildingId: string | undefined;
      let floorId: string | undefined;
      let unitId: string | undefined;

      switch(mainCollectionName) {
        case 'attachments':
            unitId = currentEntity.unitId;
            break;
        case 'units':
          unitId = currentEntity.id;
          break;
        case 'floors':
          floorId = currentEntity.id;
          break;
        case 'buildings':
          buildingId = currentEntity.id;
          break;
        case 'projects':
          projectId = currentEntity.id;
          break;
      }
      
      const unitDoc = unitId ? await getDocFromFirestore('units', unitId) : null;
      if (unitDoc) {
          floorId = unitDoc.floorIds?.[0];
          buildingId = unitDoc.buildingId;
          projectId = unitDoc.projectId;
      }

      const floorDoc = floorId ? await getDocFromFirestore('floors', floorId) : null;
      if (floorDoc) {
          buildingId = floorDoc.buildingId;
      }
      
      const buildingDoc = buildingId ? await getDocFromFirestore('buildings', buildingId) : null;
      if (buildingDoc) {
          projectId = buildingDoc.projectId;
      }

      const projectDoc = projectId ? await getDocFromFirestore('projects', projectId) : null;
      if (projectDoc) {
          companyId = projectDoc.companyId;
      }

      const companyDoc = companyId ? await getDocFromFirestore('companies', companyId) : null;
      
      const crumbs: BreadcrumbItem[] = [];
      
      // Always start with the root list page
      crumbs.push({ href: '/companies', label: 'Εταιρείες', tooltip: 'Μετάβαση στις Εταιρείες' });

      if (projectDoc) crumbs.push({ href: `/projects/${projectDoc.id}`, label: projectDoc.title || 'Project', tooltip: `Μετάβαση σε ${projectDoc.title}` });
      if (buildingDoc) crumbs.push({ href: `/buildings/${buildingDoc.id}`, label: buildingDoc.address || 'Building', tooltip: `Μετάβαση σε ${buildingDoc.address}` });
      if (floorDoc) crumbs.push({ href: `/floors/${floorDoc.id}`, label: `Όροφος ${floorDoc.level || ''}`.trim(), tooltip: `Μετάβαση στον Όροφο ${floorDoc.level}` });
      if (unitDoc) crumbs.push({ href: `/units/${unitDoc.id}`, label: unitDoc.name || 'Unit', tooltip: `Μετάβαση στο ${unitDoc.name}` });
      
      if (mainCollectionName === 'attachments') {
          crumbs.push({ href: pathname, label: currentEntity.details || 'Attachment', tooltip: `Μετάβαση στο ${currentEntity.details}` });
      }

      setBreadcrumbs(crumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return breadcrumbs;
}
