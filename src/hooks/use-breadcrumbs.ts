
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
      const isDetailsPage = segments.length > 1 && segments[1] !== 'new';

      if (!isDetailsPage) {
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
      
      const mainCollectionName = COLLECTION_NAMES[mainCollectionSegment];
      const entityId = segments[1];
      
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
      let attachmentId: string | undefined;

      switch(mainCollectionName) {
        case 'attachments':
            attachmentId = currentEntity.id;
            unitId = currentEntity.unitId;
            break;
        case 'units':
          unitId = currentEntity.id;
          floorId = currentEntity.floorIds?.[0];
          buildingId = currentEntity.buildingId;
          projectId = currentEntity.projectId;
          break;
        case 'floors':
          floorId = currentEntity.id;
          buildingId = currentEntity.buildingId;
          projectId = currentEntity.projectId;
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
      
      const unitDoc = unitId ? await getDocFromFirestore('units', unitId) : null;
      if (unitDoc) {
          if (!floorId) floorId = unitDoc.floorIds?.[0];
          if (!buildingId) buildingId = unitDoc.buildingId;
          if (!projectId) projectId = unitDoc.projectId;
      }

      const floorDoc = floorId ? await getDocFromFirestore('floors', floorId) : null;
      if (floorDoc && !buildingId) buildingId = floorDoc.buildingId;
      if (floorDoc && !projectId) projectId = floorDoc.projectId;
      
      const buildingDoc = buildingId ? await getDocFromFirestore('buildings', buildingId) : null;
      if (buildingDoc && !projectId) projectId = buildingDoc.projectId;

      const projectDoc = projectId ? await getDocFromFirestore('projects', projectId) : null;
      if (projectDoc && !companyId) companyId = projectDoc.companyId;

      const companyDoc = companyId ? await getDocFromFirestore('companies', companyId) : null;
      
      const crumbs: BreadcrumbItem[] = [];
      
      if (companyDoc) crumbs.push({ href: `/companies`, label: companyDoc.name || 'Company', tooltip: `Μετάβαση σε ${companyDoc.name}` });
      if (projectDoc) crumbs.push({ href: `/projects/${projectDoc.id}`, label: projectDoc.title || 'Project', tooltip: `Μετάβαση σε ${projectDoc.title}` });
      if (buildingDoc) crumbs.push({ href: `/buildings/${buildingDoc.id}`, label: buildingDoc.address || 'Building', tooltip: `Μετάβαση σε ${buildingDoc.address}` });
      if (floorDoc) crumbs.push({ href: `/floors/${floorDoc.id}`, label: `Όροφος ${floorDoc.level || ''}`.trim(), tooltip: `Μετάβαση στον Όροφο ${floorDoc.level}` });
      if (unitDoc) crumbs.push({ href: `/units/${unitDoc.id}`, label: unitDoc.name || 'Unit', tooltip: `Μετάβαση στο ${unitDoc.name}` });
      if (attachmentId) {
          const attachmentDoc = attachmentId === currentEntity.id ? currentEntity : await getDocFromFirestore('attachments', attachmentId);
          if (attachmentDoc) crumbs.push({ href: `/attachments/${attachmentDoc.id}`, label: attachmentDoc.details || 'Attachment', tooltip: `Μετάβαση στο ${attachmentDoc.details}` });
      }

      setBreadcrumbs(crumbs);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return breadcrumbs;
}
