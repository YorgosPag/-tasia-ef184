
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
      
      let currentPath = '';
      const pathSegments = pathname.split('/').filter(Boolean);
      const isDetailsPage = pathSegments.length > 1 && isLikelyId(pathSegments[pathSegments.length - 1]);

      if (!isDetailsPage) {
        // Handle list pages
        const staticCrumbs: BreadcrumbItem[] = [];
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
      const entityId = pathSegments[pathSegments.length - 1];
      const collectionSegment = pathSegments[pathSegments.length - 2];
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

      // --- Build hierarchy bottom-up ---
      let companyId: string | undefined;
      let projectId: string | undefined;
      let buildingId: string | undefined;
      let floorId: string | undefined;
      let unitId: string | undefined;
      let attachmentId: string | undefined = (mainCollectionName === 'attachments') ? currentEntity.id : undefined;

      if(attachmentId) {
          unitId = currentEntity.unitId;
      } else if (mainCollectionName === 'units') {
          unitId = currentEntity.id;
      } else if (mainCollectionName === 'floors') {
          floorId = currentEntity.id;
      } else if (mainCollectionName === 'buildings') {
          buildingId = currentEntity.id;
      } else if (mainCollectionName === 'projects') {
          projectId = currentEntity.id;
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

      // --- Construct breadcrumbs top-down ---
      const crumbs: BreadcrumbItem[] = [];
      crumbs.push({ href: '/companies', label: 'Εταιρείες', tooltip: 'Μετάβαση στις Εταιρείες' });

      if (companyDoc) {
        // Since there is no company detail page, this just links to the list.
        // If there was a page /companies/[id], the link would be different.
      }
      if (projectDoc) crumbs.push({ href: `/projects/${projectDoc.id}`, label: projectDoc.title || 'Έργο', tooltip: `Μετάβαση σε ${projectDoc.title}` });
      if (buildingDoc) crumbs.push({ href: `/buildings/${buildingDoc.id}`, label: buildingDoc.address || 'Κτίριο', tooltip: `Μετάβαση σε ${buildingDoc.address}` });
      if (floorDoc) crumbs.push({ href: `/floors/${floorDoc.id}`, label: `Όροφος ${floorDoc.level || ''}`.trim(), tooltip: `Μετάβαση στον Όροφο ${floorDoc.level}` });
      if (unitDoc) crumbs.push({ href: `/units/${unitDoc.id}`, label: unitDoc.name || 'Ακίνητο', tooltip: `Μετάβαση στο ${unitDoc.name}` });
      
      if (attachmentId) {
          const attachmentDoc = await getDocFromFirestore('attachments', attachmentId);
          if (attachmentDoc) {
               crumbs.push({ href: pathname, label: attachmentDoc.details || 'Παρακολούθημα', tooltip: `Μετάβαση στο ${attachmentDoc.details}` });
          }
      }
      
      setBreadcrumbs(crumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return breadcrumbs;
}
