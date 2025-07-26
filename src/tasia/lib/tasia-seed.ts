
'use server';

import {
  collection,
  writeBatch,
  serverTimestamp,
  doc,
  DocumentReference,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { companiesData, projectsData, buildingsData, floorsData, unitsData, contactsData } from './tasia-seed-data';

export async function seedTasiaData() {
  const batch = writeBatch(db);
  console.log('Starting TASIA database seed...');

  const contactIdMap = new Map<string, DocumentReference>();
  const companyIdMap = new Map<string, DocumentReference>();
  const projectIdMap = new Map<string, DocumentReference>();
  const buildingIdMap = new Map<string, { topLevelId: DocumentReference, originalId: DocumentReference }>();
  const floorIdMap = new Map<string, { topLevelId: DocumentReference, originalId: DocumentReference }>();

  // 1. Seed Contacts
  for (const contact of contactsData) {
    const docRef = doc(collection(db, 'contacts'));
    contactIdMap.set(contact._id, docRef);
    const { _id, ...contactData } = contact;
    batch.set(docRef, { ...contactData, createdAt: serverTimestamp() });
  }
  console.log(`${contactsData.length} contacts queued for creation.`);

  // 2. Seed Companies (linked to contacts)
  for (const company of companiesData) {
    const contactRef = contactIdMap.get(company._contactId);
    if (!contactRef) {
        console.warn(`[SEED] Contact with _id "${company._contactId}" not found for company "${company.name}". Skipping company.`);
        continue;
    }
    const companyRef = doc(collection(db, 'companies'));
    companyIdMap.set(company._id, companyRef);
    const { _id, _contactId, ...companyData } = company;
    batch.set(companyRef, { ...companyData, contactId: contactRef.id, createdAt: serverTimestamp() });
  }
  console.log(`${companiesData.length} companies queued for creation.`);

  // 3. Seed Projects
  for (const project of projectsData) {
    const parentCompanyRef = companyIdMap.get(project.companyId);
    if (!parentCompanyRef) {
      console.warn(`[SEED] Company with _id "${project.companyId}" not found for project "${project.title}". Skipping.`);
      continue;
    }
    const docRef = doc(collection(db, 'projects'));
    projectIdMap.set(project._id, docRef);
    const { _id, companyId, ...projectData } = project;
    batch.set(docRef, {
        ...projectData,
        deadline: Timestamp.fromDate(projectData.deadline),
        companyId: parentCompanyRef.id,
        createdAt: serverTimestamp(),
    });
  }
  console.log('Projects queued for creation.');

  // 4. Seed Buildings (Dual Write)
  for(const building of buildingsData) {
      const parentProjectRef = projectIdMap.get(building.projectId);
      if (!parentProjectRef) continue;

      const topLevelBuildingRef = doc(collection(db, 'buildings'));
      const subCollectionBuildingRef = doc(collection(parentProjectRef, 'buildings'));
      
      buildingIdMap.set(building._id, { topLevelId: topLevelBuildingRef, originalId: subCollectionBuildingRef });

      const { _id, projectId, ...buildingCoreData } = building;
      const buildingData = { ...buildingCoreData, createdAt: serverTimestamp() };

      batch.set(subCollectionBuildingRef, { ...buildingData, topLevelId: topLevelBuildingRef.id });
      batch.set(topLevelBuildingRef, { ...buildingData, projectId: parentProjectRef.id, originalId: subCollectionBuildingRef.id });
  }
  console.log('Buildings queued for creation.');

  // 5. Seed Floors (Dual Write)
  for (const floor of floorsData) {
      const parentBuildingRefs = buildingIdMap.get(floor.buildingId);
      if (!parentBuildingRefs) continue;
      
      const topLevelFloorRef = doc(collection(db, 'floors'));
      const subCollectionFloorRef = doc(collection(parentBuildingRefs.originalId, 'floors'));
      floorIdMap.set(floor._id, { topLevelId: topLevelFloorRef, originalId: subCollectionFloorRef });

      const { _id, buildingId, ...floorData } = floor;
      batch.set(subCollectionFloorRef, { ...floorData, topLevelId: topLevelFloorRef.id, createdAt: serverTimestamp() });
      batch.set(topLevelFloorRef, { ...floorData, buildingId: parentBuildingRefs.topLevelId.id, originalId: subCollectionFloorRef.id, createdAt: serverTimestamp() });
  }
  console.log('Floors queued for creation.');

  // 6. Seed Units and Attachments
  for (const unit of unitsData) {
      if (!unit.floorIds || unit.floorIds.length === 0) continue;
      
      const parentFloorRefs = floorIdMap.get(unit.floorIds[0]);
      if (!parentFloorRefs) continue;

      const parentBuildingData = buildingsData.find(b => b._id === floorsData.find(f => f._id === unit.floorIds[0])?.buildingId);
      if(!parentBuildingData) continue;
      const parentProjectRef = projectIdMap.get(parentBuildingData.projectId);
      const parentBuildingRef = buildingIdMap.get(parentBuildingData._id);
      if(!parentProjectRef || !parentBuildingRef) continue;
      
      const topLevelUnitRef = doc(collection(db, 'units'));
      const subCollectionUnitRef = doc(collection(parentFloorRefs.originalId, 'units'));

      const { _id, attachments, ...unitCoreData } = unit;
      const unitData = {
        ...unitCoreData,
        floorIds: unit.floorIds.map(fid => floorIdMap.get(fid)?.topLevelId.id).filter(Boolean),
        buildingId: parentBuildingRef.topLevelId.id,
        projectId: parentProjectRef.id,
        createdAt: serverTimestamp(),
      };
      
      batch.set(subCollectionUnitRef, { ...unitData, topLevelId: topLevelUnitRef.id });
      batch.set(topLevelUnitRef, { ...unitData, originalId: subCollectionUnitRef.id });
      
      for (const att of unit.attachments) {
          const attachmentRef = doc(collection(db, 'attachments'));
          const attachmentData: { [key: string]: any } = {
            ...att,
            unitId: topLevelUnitRef.id,
            createdAt: serverTimestamp(),
          };
          Object.keys(attachmentData).forEach(key => attachmentData[key] === undefined && delete attachmentData[key]);
          batch.set(attachmentRef, attachmentData);
      }
  }
  console.log('Units and Attachments queued for creation.');

  await batch.commit();
  console.log('TASIA database has been successfully seeded!');
}
