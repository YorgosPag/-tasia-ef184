
'use server';

import {
  collection,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export async function seedDatabase() {
  const batch = writeBatch(db);

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

  const companyRefs: { [key: string]: any } = {};
  companiesData.forEach((company) => {
    const companyRef = collection(db, 'companies');
    const docRef = companyRef.doc();
    companyRefs[company._id] = docRef;
    batch.set(docRef, { ...company, createdAt: serverTimestamp() });
  });

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

  const projectRefs: { [key: string]: any } = {};
  projectsData.forEach((project) => {
    const projectRef = collection(db, 'projects');
    const docRef = projectRef.doc();
    projectRefs[project._id] = docRef;
    batch.set(docRef, {
        title: project.title,
        companyId: project.companyId,
        deadline: project.deadline,
        status: project.status,
        createdAt: serverTimestamp(),
    });
  });

  // --- Buildings ---
  const buildingsData = [
    { 
      _id: 'bld-alpha', 
      address: 'Πατησίων 100', 
      type: 'Πολυκατοικία', 
      projectId: 'proj-athens-revival' 
    },
    { 
      _id: 'bld-beta', 
      address: 'Αγίας Σοφίας 12', 
      type: 'Κτίριο Γραφείων', 
      projectId: 'proj-thess-towers' 
    },
  ];

  const buildingRefs: { [key: string]: any } = {};
  for(const building of buildingsData) {
      const parentProjectRef = projectRefs[building.projectId];
      if (!parentProjectRef) continue;

      // Add to subcollection
      const buildingSubRef = collection(db, 'projects', parentProjectRef.id, 'buildings').doc();
      batch.set(buildingSubRef, {
        address: building.address,
        type: building.type,
        createdAt: serverTimestamp(),
      });

      // Add to top-level collection
      const buildingTopRef = collection(db, 'buildings').doc();
      buildingRefs[building._id] = buildingTopRef;
      batch.set(buildingTopRef, {
          address: building.address,
          type: building.type,
          projectId: parentProjectRef.id,
          originalId: buildingSubRef.id,
          createdAt: serverTimestamp(),
      })
  }

  // --- Floors ---
  const floorsData = [
    { _id: 'flr-alpha-1', level: '1', description: 'Πρώτος όροφος', buildingId: 'bld-alpha' },
    { _id: 'flr-alpha-2', level: '2', description: 'Δεύτερος όροφος', buildingId: 'bld-alpha' },
    { _id: 'flr-beta-1', level: '1', description: 'Γραφεία Διοίκησης', buildingId: 'bld-beta' },
  ];

  const floorRefs: { [key: string]: any } = {};
  for (const floor of floorsData) {
      const parentBuildingRef = buildingRefs[floor.buildingId];
      if (!parentBuildingRef) continue;
      
      const parentBuildingDoc = (await parentBuildingRef.get());
      const parentBuildingData = parentBuildingDoc.data() as any;
      if (!parentBuildingData || !parentBuildingData.originalId) continue;
      
      const parentProjectRef = projectRefs[parentBuildingData.projectId];
      if (!parentProjectRef) continue;

      // Add to subcollection
      const floorSubRef = collection(db, 'projects', parentProjectRef.id, 'buildings', parentBuildingData.originalId, 'floors').doc();
       batch.set(floorSubRef, {
           level: floor.level,
           description: floor.description,
           createdAt: serverTimestamp(),
       });
       
      // Add to top-level collection
      const floorTopRef = collection(db, 'floors').doc();
      floorRefs[floor._id] = floorTopRef;
      batch.set(floorTopRef, {
          level: floor.level,
          description: floor.description,
          buildingId: parentBuildingRef.id,
          originalId: floorSubRef.id,
          createdAt: serverTimestamp(),
      });
  }

  // --- Units & Attachments ---
  const unitsData = [
    { _id: 'unit-a1', floorId: 'flr-alpha-1', identifier: 'A1', name: 'Διαμέρισμα', type: 'Δυάρι', status: 'Διαθέσιμο', polygonPoints: [[50,50], [150,50], [150,150], [50,150]], attachments: [{type: 'parking', details: 'P-1'}, {type: 'storage', details: 'S-A1'}] },
    { _id: 'unit-a2', floorId: 'flr-alpha-1', identifier: 'A2', name: 'Διαμέρισμα', type: 'Τριάρι', status: 'Κρατημένο', polygonPoints: [[200,50], [300,50], [300,150], [200,150]], attachments: [{type: 'parking', details: 'P-2'}] },
    { _id: 'unit-b1', floorId: 'flr-alpha-2', identifier: 'B1', name: 'Ρετιρέ', type: 'Μεγάλο', status: 'Πωλημένο', polygonPoints: [[50,200], [300,200], [300,300], [50,300]], attachments: [{type: 'storage', details: 'S-B1'}] },
    { _id: 'unit-c1', floorId: 'flr-beta-1', identifier: 'C1', name: 'Γραφείο Open-Space', type: 'Γραφείο', status: 'Διαθέσιμο', polygonPoints: [[100,100], [400,100], [400,400], [100,400]], attachments: [] },
  ];
  
  for (const unit of unitsData) {
      const parentFloorRef = floorRefs[unit.floorId];
      if (!parentFloorRef) continue;
      
      const parentFloorDoc = (await parentFloorRef.get());
      const parentFloorData = parentFloorDoc.data() as any;
      if (!parentFloorData || !parentFloorData.originalId) continue;
      
      const parentBuildingRef = buildingRefs[parentFloorData.buildingId];
      if (!parentBuildingRef) continue;

      const parentBuildingDoc = (await parentBuildingRef.get());
      const parentBuildingData = parentBuildingDoc.data() as any;
      if (!parentBuildingData || !parentBuildingData.originalId) continue;

      const parentProjectRef = projectRefs[parentBuildingData.projectId];
      if (!parentProjectRef) continue;

      const unitData = {
          identifier: unit.identifier,
          name: unit.name,
          type: unit.type,
          status: unit.status,
          polygonPoints: unit.polygonPoints.map(p => ({x: p[0], y: p[1]})),
      };

      // Add to subcollection
      const unitSubRef = collection(db, 'projects', parentProjectRef.id, 'buildings', parentBuildingData.originalId, 'floors', parentFloorData.originalId, 'units').doc();
      batch.set(unitSubRef, {
          ...unitData,
          buildingId: parentBuildingRef.id,
          floorId: parentFloorRef.id,
          createdAt: serverTimestamp(),
      });
      
      // Add to top-level collection
      const unitTopRef = collection(db, 'units').doc(unitSubRef.id);
      batch.set(unitTopRef, {
          ...unitData,
          originalId: unitSubRef.id,
          buildingId: parentBuildingRef.id,
          floorId: parentFloorRef.id,
          createdAt: serverTimestamp(),
      });
      
      // Add attachments
      unit.attachments.forEach(att => {
          const attachmentRef = collection(db, 'projects', parentProjectRef.id, 'buildings', parentBuildingData.originalId, 'floors', parentFloorData.originalId, 'units', unitSubRef.id, 'attachments').doc();
          batch.set(attachmentRef, {
              ...att,
              createdAt: serverTimestamp(),
          });
      });
  }

  await batch.commit();
}
