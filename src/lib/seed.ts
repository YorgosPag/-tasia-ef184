
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
const buildingOriginalIds: { [key: string]: string } = {};


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

      const subCollectionBuildingRef = doc(collection(parentProjectRef, 'buildings'));
      const topLevelBuildingRef = doc(collection(db, 'buildings'));
      refs[building._id] = topLevelBuildingRef; 
      buildingOriginalIds[building._id] = subCollectionBuildingRef.id;

      batch.set(subCollectionBuildingRef, {
        address: building.address,
        type: building.type,
        topLevelId: topLevelBuildingRef.id, 
        createdAt: serverTimestamp(),
      });
      
      batch.set(topLevelBuildingRef, {
          address: building.address,
          type: building.type,
          projectId: parentProjectRef.id, 
          originalId: subCollectionBuildingRef.id, 
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
      
      const originalBuildingData = buildingsData.find(b => b._id === floor.buildingId);
      if (!originalBuildingData) continue;
      
      const parentProjectRef = refs[originalBuildingData.projectId];
      if (!parentProjectRef) continue;
      
      const buildingOriginalId = buildingOriginalIds[floor.buildingId];
      if (!buildingOriginalId) continue;

      const topLevelFloorRef = doc(collection(db, 'floors'));
      refs[floor._id] = topLevelFloorRef;
      
      const subCollectionFloorRef = doc(collection(db, 'projects', parentProjectRef.id, 'buildings', buildingOriginalId, 'floors'));

      batch.set(subCollectionFloorRef, {
          level: floor.level,
          description: floor.description,
          topLevelId: topLevelFloorRef.id,
          createdAt: serverTimestamp(),
      });
      
      batch.set(topLevelFloorRef, {
          level: floor.level,
          description: floor.description,
          buildingId: parentBuildingTopLevelRef.id,
          originalId: subCollectionFloorRef.id,
          createdAt: serverTimestamp(),
      });
  }
   console.log('Floors queued for creation.');


  // --- Units and Attachments ---
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
      const parentFloorRef = refs[u.floorId];
      if (!parentFloorRef) {
        console.warn(`[SEED] Floor with _id "${u.floorId}" not found for unit "${u.name}". Skipping.`);
        continue;
      }
      
      const parentFloorData = floorsData.find(f => f._id === u.floorId);
      if (!parentFloorData) continue;
      
      const parentBuildingRef = refs[parentFloorData.buildingId];
      if (!parentBuildingRef) continue;

      const unitDocRef = doc(collection(db, 'units'));
      refs[u._id] = unitDocRef;

      // This is a placeholder since we can't know the sub-collection doc id beforehand.
      // In a real app, this linkage would happen differently, but for seeding it's okay.
      const subCollectionUnitId = doc(collection(db, 'dummy')).id;

      batch.set(unitDocRef, {
        identifier: u.identifier,
        name: u.name,
        type: u.type,
        status: u.status,
        polygonPoints: u.polygonPoints || [],
        floorId: parentFloorRef.id,
        buildingId: parentBuildingRef.id,
        originalId: subCollectionUnitId, // Placeholder
        createdAt: serverTimestamp(),
      });
      
      // Seed attachments into the top-level 'attachments' collection
      for (const att of u.attachments) {
          const attachmentRef = doc(collection(db, 'attachments'));
          batch.set(attachmentRef, {
              ...att,
              unitId: unitDocRef.id, // Link to the top-level unit
              createdAt: serverTimestamp(),
          });
      }
  }
   console.log('Units and Attachments queued for creation.');

  await batch.commit();
  console.log('Database has been successfully seeded!');
}
