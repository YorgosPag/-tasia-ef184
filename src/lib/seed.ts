
'use server';

import {
  collection,
  writeBatch,
  serverTimestamp,
  Timestamp,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';

// A simple map to hold the generated document references for use within the seeding script.
const refs: { [key: string]: any } = {};

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

  companiesData.forEach((company) => {
    const docRef = doc(collection(db, 'companies'));
    refs[company._id] = { id: docRef.id, ref: docRef };
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

  projectsData.forEach((project) => {
    const docRef = doc(collection(db, 'projects'));
    refs[project._id] = { id: docRef.id, ref: docRef };
    batch.set(docRef, {
        title: project.title,
        companyId: refs[project.companyId].id,
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

  for(const building of buildingsData) {
      const parentProjectRef = refs[building.projectId].ref;
      if (!parentProjectRef) continue;

      const subCollectionBuildingRef = doc(collection(parentProjectRef, 'buildings'));
      
      const topLevelBuildingRef = doc(collection(db, 'buildings'));
      refs[building._id] = { 
          id: topLevelBuildingRef.id, 
          ref: topLevelBuildingRef,
          originalId: subCollectionBuildingRef.id,
          projectId: parentProjectRef.id,
      };

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
      })
  }

  // --- Floors ---
  const floorsData = [
    { _id: 'flr-alpha-1', level: '1', description: 'Πρώτος όροφος', buildingId: 'bld-alpha' },
    { _id: 'flr-alpha-2', level: '2', description: 'Δεύτερος όροφος', buildingId: 'bld-alpha' },
    { _id: 'flr-beta-1', level: '1', description: 'Γραφεία Διοίκησης', buildingId: 'bld-beta' },
  ];

  for (const floor of floorsData) {
      const parentBuildingMeta = refs[floor.buildingId];
      if (!parentBuildingMeta) continue;

      const parentProjectRef = refs[parentBuildingMeta.projectId].ref;
      if (!parentProjectRef) continue;

      const floorSubRef = doc(collection(parentProjectRef, 'buildings', parentBuildingMeta.originalId, 'floors'));
       
      const floorTopRef = doc(collection(db, 'floors'));
      refs[floor._id] = {
          id: floorTopRef.id,
          ref: floorTopRef,
          originalId: floorSubRef.id,
          buildingId: parentBuildingMeta.id,
          buildingOriginalId: parentBuildingMeta.originalId,
          projectId: parentBuildingMeta.projectId,
      };

       batch.set(floorSubRef, {
           level: floor.level,
           description: floor.description,
           createdAt: serverTimestamp(),
       });
       
      batch.set(floorTopRef, {
          level: floor.level,
          description: floor.description,
          buildingId: parentBuildingMeta.id,
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
      const parentFloorMeta = refs[unit.floorId];
      if (!parentFloorMeta) continue;
      
      const parentProjectRef = refs[parentFloorMeta.projectId].ref;
      if (!parentProjectRef) continue;

      const unitData = {
          identifier: unit.identifier,
          name: unit.name,
          type: unit.type,
          status: unit.status,
          polygonPoints: unit.polygonPoints.map(p => ({x: p[0], y: p[1]})),
      };

      const unitSubRef = doc(collection(parentProjectRef, 'buildings', parentFloorMeta.buildingOriginalId, 'floors', parentFloorMeta.originalId, 'units'));

      batch.set(unitSubRef, {
          ...unitData,
          buildingId: parentFloorMeta.buildingId,
          floorId: parentFloorMeta.id,
          createdAt: serverTimestamp(),
      });
      
      const unitTopRef = doc(db, 'units', unitSubRef.id);
      batch.set(unitTopRef, {
          ...unitData,
          originalId: unitSubRef.id,
          buildingId: parentFloorMeta.buildingId,
          floorId: parentFloorMeta.id,
          createdAt: serverTimestamp(),
      });
      
      unit.attachments.forEach(att => {
          const attachmentRef = doc(collection(unitSubRef, 'attachments'));
          batch.set(attachmentRef, {
              ...att,
              createdAt: serverTimestamp(),
          });
      });
  }

  await batch.commit();
}
