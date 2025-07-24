
'use server';

import {
  collection,
  writeBatch,
  serverTimestamp,
  doc,
  DocumentReference,
} from 'firebase/firestore';
import { db } from './firebase';
import { companiesData, projectsData, buildingsData, floorsData, unitsData, contactsData } from './seed-data';

export async function seedDatabase() {
  const refs: { [key: string]: DocumentReference } = {};
  const originalIds: { [key: string]: { building: string, floor?: string } } = {};
  const batch = writeBatch(db);
  console.log('Starting database seed...');

  // --- Contacts ---
  // Seed all contacts from the dedicated contactsData array
  contactsData.forEach((contact) => {
    const docRef = doc(collection(db, 'contacts'));
    refs[contact._id] = docRef;
    const { _id, ...contactData } = contact;
    batch.set(docRef, { ...contactData, createdAt: serverTimestamp() });
  });
  console.log('All contacts from contactsData queued for creation.');

  // --- Companies ---
  // Companies are seeded into their own collection for business logic,
  // but they are already in the contacts list for relational purposes.
  companiesData.forEach((company) => {
    const companyRef = doc(collection(db, 'companies'));
    refs[company._id] = companyRef; // Use the company _id for project linking
    const { _id, ...companyData } = company;
    batch.set(companyRef, { ...companyData, createdAt: serverTimestamp() });
  });
  console.log('Companies queued for creation.');


  // --- Projects ---
  projectsData.forEach((project) => {
    const parentCompanyRef = refs[project.companyId];
    if (!parentCompanyRef) {
      console.warn(`[SEED] Company with _id "${project.companyId}" not found for project "${project.title}". Skipping.`);
      return;
    }
    const docRef = doc(collection(db, 'projects'));
    refs[project._id] = docRef;
    batch.set(docRef, {
        title: project.title,
        companyId: parentCompanyRef.id,
        location: project.location,
        description: project.description,
        deadline: project.deadline,
        status: project.status,
        photoUrl: project.photoUrl,
        tags: project.tags,
        createdAt: serverTimestamp(),
    });
  });
  console.log('Projects queued for creation.');

  // --- Buildings (Dual Write) ---
  for(const building of buildingsData) {
      const parentProjectRef = refs[building.projectId];
      if (!parentProjectRef) continue;

      const subCollectionBuildingRef = doc(collection(parentProjectRef, 'buildings'));
      const topLevelBuildingRef = doc(collection(db, 'buildings'));
      
      refs[building._id] = topLevelBuildingRef; 
      originalIds[building._id] = { building: subCollectionBuildingRef.id };

      const { _id, projectId, ...buildingCoreData } = building;
      const buildingData = {
        ...buildingCoreData,
        createdAt: serverTimestamp(),
      };

      batch.set(subCollectionBuildingRef, {
        ...buildingData,
        topLevelId: topLevelBuildingRef.id, 
      });
      batch.set(topLevelBuildingRef, {
          ...buildingData,
          projectId: parentProjectRef.id, 
          originalId: subCollectionBuildingRef.id, 
      });
  }
  console.log('Buildings queued for creation.');

  // --- Floors (Dual Write) ---
  for (const floor of floorsData) {
      const parentBuildingTopLevelRef = refs[floor.buildingId];
      if (!parentBuildingTopLevelRef) continue;
      
      const originalBuildingData = buildingsData.find(b => b._id === floor.buildingId);
      if (!originalBuildingData) continue;
      
      const parentProjectRef = refs[originalBuildingData.projectId];
      const buildingOriginalId = originalIds[floor.buildingId]?.building;
      if (!parentProjectRef || !buildingOriginalId) continue;

      const topLevelFloorRef = doc(collection(db, 'floors'));
      refs[floor._id] = topLevelFloorRef;
      
      const subCollectionFloorRef = doc(collection(db, 'projects', parentProjectRef.id, 'buildings', buildingOriginalId, 'floors'));
      originalIds[floor._id] = { ...originalIds[floor._id], floor: subCollectionFloorRef.id };

      const floorData = {
        level: floor.level,
        description: floor.description,
        floorPlanUrl: floor.floorPlanUrl,
        createdAt: serverTimestamp(),
      }

      batch.set(subCollectionFloorRef, {
          ...floorData,
          topLevelId: topLevelFloorRef.id,
      });
      batch.set(topLevelFloorRef, {
          ...floorData,
          buildingId: parentBuildingTopLevelRef.id,
          originalId: subCollectionFloorRef.id,
      });
  }
   console.log('Floors queued for creation.');

  // --- Units and Attachments ---
  for (const unit of unitsData) {
      if (!unit.floorIds || unit.floorIds.length === 0) continue;
      
      const parentFloorTopLevelRef = refs[unit.floorIds[0]];
      if (!parentFloorTopLevelRef) continue;

      const parentFloorData = floorsData.find(f => f._id === unit.floorIds[0]);
      if (!parentFloorData) continue;
      
      const parentBuildingData = buildingsData.find(b => b._id === parentFloorData.buildingId);
      if (!parentBuildingData) continue;

      const parentProjectRef = refs[parentBuildingData.projectId];
      const parentBuildingTopLevelRef = refs[parentFloorData.buildingId];
      
      if (!parentProjectRef || !parentBuildingTopLevelRef) continue;
      
      const { _id, attachments, ...unitCoreData } = unit;
      const unitData = {
        ...unitCoreData,
        floorIds: unit.floorIds.map(fid => refs[fid]?.id).filter(Boolean),
        polygonPoints: unit.polygonPoints || [],
        buildingId: parentBuildingTopLevelRef.id,
        createdAt: serverTimestamp(),
      };
      
      // Dual-Write for Units - simplified to one subcollection entry for simplicity
      const buildingOriginalId = originalIds[parentFloorData.buildingId]?.building;
      const floorOriginalId = originalIds[unit.floorIds[0]]?.floor;
      if (!buildingOriginalId || !floorOriginalId) continue;
      
      const subCollectionUnitRef = doc(collection(db, 'projects', parentProjectRef.id, 'buildings', buildingOriginalId, 'floors', floorOriginalId, 'units'));
      const topLevelUnitRef = doc(collection(db, 'units'));
      
      batch.set(subCollectionUnitRef, { ...unitData, topLevelId: topLevelUnitRef.id });
      batch.set(topLevelUnitRef, { ...unitData, originalId: subCollectionUnitRef.id });
      
      refs[unit._id] = topLevelUnitRef; // Store top-level ref for attachments
      
      // Seed attachments into the top-level 'attachments' collection
      for (const att of unit.attachments) {
          const attachmentRef = doc(collection(db, 'attachments'));
          const { type, details, area, price, photoUrl, sharePercentage, isBundle, isStandalone } = att;
          
          const attachmentData: { [key: string]: any } = {
            type, details, area, price, sharePercentage, isBundle, isStandalone,
            bundleUnitId: isBundle ? topLevelUnitRef.id : undefined,
            unitId: topLevelUnitRef.id, // Link to the top-level unit
            createdAt: serverTimestamp(),
          };

          if (photoUrl) {
            attachmentData.photoUrl = photoUrl;
          }
          
          // Remove undefined keys before writing to Firestore
          Object.keys(attachmentData).forEach(key => attachmentData[key] === undefined && delete attachmentData[key]);

          batch.set(attachmentRef, attachmentData);
      }
  }
   console.log('Units and Attachments queued for creation.');

  await batch.commit();
  console.log('Database has been successfully seeded!');
}
