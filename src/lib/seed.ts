
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

// Simple maps to hold the generated document references for use within the seeding script.
const refs: { [key: string]: DocumentReference } = {};
const originalIds: { [key: string]: { building: string, floor?: string } } = {};

type UnitStatus = 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';

export async function seedDatabase() {
  const batch = writeBatch(db);
  console.log('Starting database seed...');

  // --- Companies ---
  const companiesData = [
    {
      _id: 'dev-construct',
      name: 'DevConstruct Α.Ε.',
      logoUrl: 'https://placehold.co/40x40.png',
      website: 'https://devconstruct.example.com',
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
      logoUrl: 'https://placehold.co/40x40.png',
      website: 'https://citybuilders.example.com',
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
      location: 'Κέντρο Αθήνας',
      description: 'Ολοκληρωμένη ανάπλαση ιστορικού κτιρίου γραφείων σε σύγχρονες κατοικίες υψηλών προδιαγραφών.',
      deadline: Timestamp.fromDate(new Date('2025-12-31')),
      status: 'Σε εξέλιξη',
    },
    {
      _id: 'proj-thess-towers',
      title: 'Thessaloniki Towers',
      companyId: 'city-build',
      location: 'Ανατολική Θεσσαλονίκη',
      description: 'Ανέγερση δύο πύργων μεικτής χρήσης (κατοικίες, καταστήματα και γραφεία) με θέα στη θάλασσα.',
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
        location: project.location,
        description: project.description,
        deadline: project.deadline,
        status: project.status,
        createdAt: serverTimestamp(),
    });
  });
  console.log('Projects queued for creation.');

  // --- Buildings (Dual Write) ---
  const buildingsData = [
    { 
        _id: 'bld-alpha', 
        address: 'Πατησίων 100', 
        type: 'Πολυκατοικία', 
        projectId: 'proj-athens-revival', 
        description: 'Ιστορικό κτίριο του 1960 με πλήρη ανακαίνιση.',
        photoUrl: 'https://placehold.co/600x400.png'
    },
    { 
        _id: 'bld-beta', 
        address: 'Αγίας Σοφίας 12', 
        type: 'Κτίριο Γραφείων', 
        projectId: 'proj-thess-towers',
        description: 'Μοντέρνο κτίριο με γυάλινη πρόσοψη.',
        photoUrl: 'https://placehold.co/600x400.png'
    },
  ];

  for(const building of buildingsData) {
      const parentProjectRef = refs[building.projectId];
      if (!parentProjectRef) continue;

      const subCollectionBuildingRef = doc(collection(parentProjectRef, 'buildings'));
      const topLevelBuildingRef = doc(collection(db, 'buildings'));
      
      refs[building._id] = topLevelBuildingRef; 
      originalIds[building._id] = { building: subCollectionBuildingRef.id };

      const buildingData = {
        address: building.address,
        type: building.type,
        description: building.description,
        photoUrl: building.photoUrl,
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
  const floorsData = [
    { _id: 'flr-alpha-1', level: '1', description: 'Πρώτος όροφος', buildingId: 'bld-alpha' },
    { _id: 'flr-alpha-2', level: '2', description: 'Δεύτερος όροφος', buildingId: 'bld-alpha' },
    { _id: 'flr-beta-1', level: '1', description: 'Γραφεία Διοίκησης', buildingId: 'bld-beta' },
  ];

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

  for (const unit of unitsData) {
      const parentFloorTopLevelRef = refs[unit.floorId];
      if (!parentFloorTopLevelRef) continue;

      const parentFloorData = floorsData.find(f => f._id === unit.floorId);
      if (!parentFloorData) continue;
      
      const parentBuildingData = buildingsData.find(b => b._id === parentFloorData.buildingId);
      if (!parentBuildingData) continue;

      const parentProjectRef = refs[parentBuildingData.projectId];
      const parentBuildingTopLevelRef = refs[parentFloorData.buildingId];
      const buildingOriginalId = originalIds[parentFloorData.buildingId]?.building;
      const floorOriginalId = originalIds[unit.floorId]?.floor;

      if (!parentProjectRef || !parentBuildingTopLevelRef || !buildingOriginalId || !floorOriginalId) continue;
      
      const unitData = {
        identifier: unit.identifier,
        name: unit.name,
        type: unit.type,
        status: unit.status,
        polygonPoints: unit.polygonPoints || [],
        floorId: parentFloorTopLevelRef.id,
        buildingId: parentBuildingTopLevelRef.id,
        createdAt: serverTimestamp(),
      };
      
      // Correct Dual-Write for Units
      const subCollectionUnitRef = doc(collection(db, 'projects', parentProjectRef.id, 'buildings', buildingOriginalId, 'floors', floorOriginalId, 'units'));
      const topLevelUnitRef = doc(collection(db, 'units'));
      
      batch.set(subCollectionUnitRef, { ...unitData, topLevelId: topLevelUnitRef.id });
      batch.set(topLevelUnitRef, { ...unitData, originalId: subCollectionUnitRef.id });
      
      refs[unit._id] = topLevelUnitRef; // Store top-level ref for attachments
      
      // Seed attachments into the top-level 'attachments' collection
      for (const att of unit.attachments) {
          const attachmentRef = doc(collection(db, 'attachments'));
          batch.set(attachmentRef, {
              ...att,
              unitId: topLevelUnitRef.id, // Link to the top-level unit
              createdAt: serverTimestamp(),
          });
      }
  }
   console.log('Units and Attachments queued for creation.');

  await batch.commit();
  console.log('Database has been successfully seeded!');
}
