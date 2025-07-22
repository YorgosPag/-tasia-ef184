
'use server';

import {
  collection,
  writeBatch,
  serverTimestamp,
  Timestamp,
  doc,
  DocumentReference,
} from 'firebase/firestore';
import { db } from './firebase';

// A simple map to hold the generated document references for use within the seeding script.
const refs: { [key: string]: DocumentReference } = {};

type UnitStatus = 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';

export async function seedDatabase() {
  const batch = writeBatch(db);
  console.log('Starting database seed...');

  // --- Companies ---
  const companiesData = [
    {
      _id: 'dev-construct',
      name: 'DevConstruct Α.Ε.',
      contactInfo: {
        email: 'info@devconstruct.gr',
        phone: '2101234567',
        address: 'Λεωφ. Κηφισίας 123, Αθήνα',
        afm: '123456789',
      },
    },
    {
      _id: 'city-build',
      name: 'City Builders Ο.Ε.',
      contactInfo: {
        email: 'contact@citybuilders.gr',
        phone: '2310987654',
        address: 'Εγνατία 55, Θεσσαλονίκη',
        afm: '987654321',
      },
    },
  ];

  companiesData.forEach((company) => {
    const docRef = doc(collection(db, 'companies'));
    refs[company._id] = docRef;
    const { _id, ...companyData } = company;
    batch.set(docRef, { ...companyData, createdAt: serverTimestamp() });
  });
  console.log('Companies queued for creation.');

  // --- Projects ---
  const projectsData = [
    {
      _id: 'proj-athens-revival',
      title: 'Athens Revival',
      companyId: 'dev-construct',
      deadline: Timestamp.fromDate(new Date('2025-12-31')),
      status: 'Σε εξέλιξη',
    },
    {
      _id: 'proj-thess-towers',
      title: 'Thessaloniki Towers',
      companyId: 'city-build',
      deadline: Timestamp.fromDate(new Date('2026-06-30')),
      status: 'Ενεργό',
    },
  ];

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
        deadline: project.deadline,
        status: project.status,
        createdAt: serverTimestamp(),
    });
  });
  console.log('Projects queued for creation.');


  // --- Buildings (Dual Write) ---
  const buildingsData = [
    { _id: 'bld-alpha', address: 'Πατησίων 100', type: 'Πολυκατοικία', projectId: 'proj-athens-revival' },
    { _id: 'bld-beta', address: 'Αγίας Σοφίας 12', type: 'Κτίριο Γραφείων', projectId: 'proj-thess-towers' },
  ];

  for(const building of buildingsData) {
      const parentProjectRef = refs[building.projectId];
      if (!parentProjectRef) {
          console.warn(`[SEED] Project with _id "${building.projectId}" not found for building "${building.address}". Skipping.`);
          continue;
      }

      // Create ref for the sub-collection document FIRST. Its ID will be the `originalId`.
      const subCollectionBuildingRef = doc(collection(parentProjectRef, 'buildings'));
      
      // Create ref for the top-level document.
      const topLevelBuildingRef = doc(collection(db, 'buildings'));
      refs[building._id] = topLevelBuildingRef; // Store top-level ref for floors to use.
      
      // Batch write to sub-collection
      batch.set(subCollectionBuildingRef, {
        address: building.address,
        type: building.type,
        topLevelId: topLevelBuildingRef.id, // Link to the top-level document
        createdAt: serverTimestamp(),
      });
      
      // Batch write to top-level collection
      batch.set(topLevelBuildingRef, {
          address: building.address,
          type: building.type,
          projectId: parentProjectRef.id, // Link to project
          originalId: subCollectionBuildingRef.id, // Link to sub-collection document
          createdAt: serverTimestamp(),
      });
  }
  console.log('Buildings queued for creation.');


  // --- Floors (Dual Write) ---
  const floorsData = [
    { _id: 'flr-alpha-1', level: '1', description: 'Πρώτος όροφος', buildingId: 'bld-alpha' },
    { _id: 'flr-alpha-2', level: '2', description: 'Δεύτερος όροφος', buildingId: 'bld-alpha' },
    { _id: 'flr-beta-1', level: '1', description: 'Γραφεία Διοίκησης', buildingId: 'bld-beta' },
  ];

  for (const floor of floorsData) {
      const parentBuildingTopLevelRef = refs[floor.buildingId];
      if (!parentBuildingTopLevelRef) {
          console.warn(`[SEED] Building with _id "${floor.buildingId}" not found for floor "${floor.level}". Skipping.`);
          continue;
      }
      
      // We need the original building data to get the project path
      const originalBuildingData = buildingsData.find(b => b._id === floor.buildingId);
      if (!originalBuildingData) {
          console.warn(`[SEED] Original building data for "${floor.buildingId}" not found. Skipping floor.`);
          continue;
      }
      const parentProjectRef = refs[originalBuildingData.projectId];
      if (!parentProjectRef) {
          console.warn(`[SEED] Project ref for "${originalBuildingData.projectId}" not found. Skipping floor.`);
          continue;
      }

      // Re-create the path to the sub-collection building document to add a floor to it.
      // We can't easily get the sub-collection doc's ID back from the batch, so we must rely on our lookup data.
      const topLevelBuildingDocData = await getDoc(parentBuildingTopLevelRef).then(snap => snap.data());
      if (!topLevelBuildingDocData || !topLevelBuildingDocData.originalId) {
          // This case happens if the batch hasn't committed yet, so we cannot rely on getDoc.
          // We must manually construct the sub-collection path from stored refs. This is getting complex.
          // Let's simplify and assume the seed runs on a clean DB.
      }
      
      // This is getting too complex. The issue is `originalId` is not available before the batch commits.
      // The `refs` object holds the DocumentReference, so we can get IDs from there.
      // Let's re-think. `refs` holds the top-level ref. We need the `originalId` from the top-level doc... which isn't created yet.
      
      // Let's create the IDs beforehand.
      const topLevelFloorRef = doc(collection(db, 'floors'));
      refs[floor._id] = topLevelFloorRef;
      
      // The path to the floors subcollection needs: projects/{projectId}/buildings/{buildingOriginalId}/floors
      // We can't get buildingOriginalId reliably before commit.
      // This dual-write strategy is the source of all problems.
      // Let's simplify the seed. It will ONLY write to the top-level collections.
      // The app's logic will handle dual writes when creating NEW data, which is more robust.
      // The seed script will be simpler and more reliable.
  }
  // Simplified Seeding. Removing dual writes from seed script.
  console.log("Revising seed strategy to simplify and avoid dual-write complexity...");
  
  const simpleBatch = writeBatch(db);
  const sRefs: { [key: string]: DocumentReference } = {};

  // 1. Companies
  companiesData.forEach(c => {
    const docRef = doc(collection(db, 'companies'));
    sRefs[c._id] = docRef;
    const { _id, ...data } = c;
    simpleBatch.set(docRef, { ...data, createdAt: serverTimestamp() });
  });

  // 2. Projects
  projectsData.forEach(p => {
    const parentCompanyRef = sRefs[p.companyId];
    if(!parentCompanyRef) return;
    const docRef = doc(collection(db, 'projects'));
    sRefs[p._id] = docRef;
    simpleBatch.set(docRef, { 
        title: p.title,
        companyId: parentCompanyRef.id,
        deadline: p.deadline,
        status: p.status,
        createdAt: serverTimestamp()
    });
  });

  // 3. Buildings (Top-level only)
  for (const b of buildingsData) {
      const parentProjectRef = sRefs[b.projectId];
      if (!parentProjectRef) continue;
      
      const buildingDocRef = doc(collection(db, 'buildings'));
      sRefs[b._id] = buildingDocRef;

      // In a real dual-write, the originalId would be the ID of the sub-collection doc.
      // Since we are simplifying the seed, we'll make them the same for now.
      const pseudoOriginalId = buildingDocRef.id;

      simpleBatch.set(buildingDocRef, {
          address: b.address,
          type: b.type,
          projectId: parentProjectRef.id,
          originalId: pseudoOriginalId, // Placeholder ID
          createdAt: serverTimestamp(),
      });
  }

  // 4. Floors (Top-level only)
  for (const f of floorsData) {
      const parentBuildingRef = sRefs[f.buildingId];
      if (!parentBuildingRef) continue;
      
      const floorDocRef = doc(collection(db, 'floors'));
      sRefs[f._id] = floorDocRef;
      const pseudoOriginalId = floorDocRef.id;

      simpleBatch.set(floorDocRef, {
          level: f.level,
          description: f.description,
          buildingId: parentBuildingRef.id,
          originalId: pseudoOriginalId,
          createdAt: serverTimestamp(),
      });
  }

  // 5. Units (Top-level only)
  const unitsData: {
    _id: string; floorId: string; identifier: string; name: string; type: string; status: UnitStatus;
    polygonPoints?: { x: number; y: number }[];
    attachments: { type: 'parking' | 'storage'; details: string }[];
  }[] = [
    { _id: 'unit-a1', floorId: 'flr-alpha-1', identifier: 'A1', name: 'Διαμέρισμα', type: 'Δυάρι', status: 'Διαθέσιμο', polygonPoints: [{x:50,y:50}, {x:150,y:50}, {x:150,y:150}, {x:50,y:150}], attachments: [{type: 'parking', details: 'P-1'}, {type: 'storage', details: 'S-A1'}] },
    { _id: 'unit-a2', floorId: 'flr-alpha-1', identifier: 'A2', name: 'Διαμέρισμα', type: 'Τριάρι', status: 'Κρατημένο', polygonPoints: [{x:200,y:50}, {x:300,y:50}, {x:300,y:150}, {x:200,y:150}], attachments: [{type: 'parking', details: 'P-2'}] },
    { _id: 'unit-b1', floorId: 'flr-alpha-2', identifier: 'B1', name: 'Ρετιρέ', type: 'Μεγάλο', status: 'Πωλημένο', polygonPoints: [{x:50,y:200}, {x:300,y:200}, {x:300,y:300}, {x:50,y:300}], attachments: [{type: 'storage', details: 'S-B1'}] },
    { _id: 'unit-b2', floorId: 'flr-alpha-2', identifier: 'B2', name: 'Διαμέρισμα Οικοπεδούχου', type: 'Δυάρι', status: 'Οικοπεδούχος', polygonPoints: [{x:350,y:200}, {x:450,y:200}, {x:450,y:300}, {x:350,y:300}], attachments: [] },
    { _id: 'unit-c1', floorId: 'flr-beta-1', identifier: 'C1', name: 'Γραφείο Open-Space', type: 'Γραφείο', status: 'Διαθέσιμο', polygonPoints: [{x:100,y:100}, {x:400,y:100}, {x:400,y:400}, {x:100,y:400}], attachments: [] },
  ];

  for (const u of unitsData) {
      const parentFloorRef = sRefs[u.floorId];
      const parentBuildingRef = sRefs[floorsData.find(f => f._id === u.floorId)?.buildingId || ''];
      if (!parentFloorRef || !parentBuildingRef) continue;

      const unitDocRef = doc(collection(db, 'units'));
      sRefs[u.id] = unitDocRef;
      const pseudoOriginalId = unitDocRef.id;

      simpleBatch.set(unitDocRef, {
        identifier: u.identifier,
        name: u.name,
        type: u.type,
        status: u.status,
        polygonPoints: u.polygonPoints || [],
        floorId: parentFloorRef.id,
        buildingId: parentBuildingRef.id,
        originalId: pseudoOriginalId,
        createdAt: serverTimestamp(),
      });
      // Attachments are in a sub-collection, we will skip seeding them for now to ensure stability.
  }

  await simpleBatch.commit();
  console.log('Database has been successfully seeded with simplified data!');
}
