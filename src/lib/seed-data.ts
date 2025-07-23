
import { Timestamp } from 'firebase/firestore';

type UnitStatus = 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';

export const companiesData = [
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

export const projectsData = [
    {
      _id: 'proj-athens-revival',
      title: 'Athens Revival',
      companyId: 'dev-construct',
      location: 'Κέντρο Αθήνας',
      description: 'Ολοκληρωμένη ανάπλαση ιστορικού κτιρίου γραφείων σε σύγχρονες κατοικίες υψηλών προδιαγραφών.',
      deadline: Timestamp.fromDate(new Date('2025-12-31')),
      status: 'Σε εξέλιξη',
      photoUrl: 'https://placehold.co/800x600.png',
      tags: ['residential', 'luxury', 'renovation'],
    },
    {
      _id: 'proj-thess-towers',
      title: 'Thessaloniki Towers',
      companyId: 'city-build',
      location: 'Ανατολική Θεσσαλονίκη',
      description: 'Ανέγερση δύο πύργων μεικτής χρήσης (κατοικίες, καταστήματα και γραφεία) με θέα στη θάλασσα.',
      deadline: Timestamp.fromDate(new Date('2026-06-30')),
      status: 'Ενεργό',
      photoUrl: 'https://placehold.co/800x600.png',
      tags: ['commercial', 'residential', 'new-build'],
    },
  ];

  export const buildingsData = [
    { 
        _id: 'bld-alpha', 
        address: 'Πατησίων 100', 
        type: 'Πολυκατοικία', 
        projectId: 'proj-athens-revival', 
        description: 'Ιστορικό κτίριο του 1960 με πλήρη ανακαίνιση.',
        photoUrl: 'https://placehold.co/600x400.png',
        floorsCount: 5,
        constructionYear: 1960,
        tags: ['ιστορικό', 'ανακαίνιση'],
    },
    { 
        _id: 'bld-beta', 
        address: 'Αγίας Σοφίας 12', 
        type: 'Κτίριο Γραφείων', 
        projectId: 'proj-thess-towers',
        description: 'Μοντέρνο κτίριο με γυάλινη πρόσοψη.',
        photoUrl: 'https://placehold.co/600x400.png',
        floorsCount: 12,
        constructionYear: 2024,
        tags: ['νεόδμητο', 'γωνιακό'],
    },
  ];

  export const floorsData = [
    { _id: 'flr-alpha-1', level: '1', description: 'Πρώτος όροφος', buildingId: 'bld-alpha', floorPlanUrl: 'https://firebasestorage.googleapis.com/v0/b/tasia-6f77i.appspot.com/o/floor_plans%2Fsample-floor-plan.pdf?alt=media&token=8a536968-3b2a-4303-a178-6512822c7595' },
    { _id: 'flr-alpha-2', level: '2', description: 'Δεύτερος όροφος', buildingId: 'bld-alpha', floorPlanUrl: '' },
    { _id: 'flr-beta-1', level: '1', description: 'Γραφεία Διοίκησης', buildingId: 'bld-beta', floorPlanUrl: '' },
  ];

  export const unitsData: {
    _id: string; floorIds: string[]; levelSpan?: string; identifier: string; name: string; type: string; status: UnitStatus;
    area: number; price?: number; bedrooms?: number; bathrooms?: number; orientation?: string; amenities?: string[];
    polygonPoints?: { x: number; y: number }[];
    attachments: { type: 'parking' | 'storage'; details: string; area?: number; price?: number; photoUrl?: string, sharePercentage?: number, isBundle?: boolean, isStandalone?: boolean }[];
  }[] = [
    { _id: 'unit-a1', floorIds: ['flr-alpha-1'], identifier: 'A1', name: 'Διαμέρισμα', type: 'Δυάρι', status: 'Διαθέσιμο', area: 75.5, price: 280000, bedrooms: 2, bathrooms: 1, orientation: 'Νότιο', amenities: ['Μπαλκόνι', 'Τζάκι'], polygonPoints: [{x:50,y:50}, {x:150,y:50}, {x:150,y:150}, {x:50,y:150}], attachments: [{type: 'parking', details: 'P-1', area: 12.5, price: 15000, photoUrl: 'https://placehold.co/100x100.png', sharePercentage: 1.2, isBundle: true, isStandalone: false}, {type: 'storage', details: 'S-A1', area: 5, price: 5000, isBundle: true, isStandalone: false}] },
    { _id: 'unit-a2', floorIds: ['flr-alpha-1'], identifier: 'A2', name: 'Διαμέρισμα', type: 'Τριάρι', status: 'Κρατημένο', area: 102, price: 350000, bedrooms: 3, bathrooms: 2, orientation: 'Νότιο-Δυτικό', amenities: ['Μεγάλο Μπαλκόνι'], polygonPoints: [{x:200,y:50}, {x:300,y:50}, {x:300,y:150}, {x:200,y:150}], attachments: [{type: 'parking', details: 'P-2', area: 12.5, price: 15000, isStandalone: true}] },
    { _id: 'unit-b1', floorIds: ['flr-alpha-2'], identifier: 'B1', name: 'Ρετιρέ', type: 'Μεγάλο', status: 'Πωλημένο', area: 150, price: 550000, bedrooms: 4, bathrooms: 3, orientation: 'Πανοραμικός', amenities: ['Ταράτσα', 'BBQ', 'Jacuzzi'], polygonPoints: [{x:50,y:200}, {x:300,y:200}, {x:300,y:300}, {x:50,y:300}], attachments: [{type: 'storage', details: 'S-B1', area: 15, price: 20000, isBundle: true}] },
    { _id: 'unit-b2', floorIds: ['flr-alpha-2'], identifier: 'B2', name: 'Διαμέρισμα Οικοπεδούχου', type: 'Δυάρι', status: 'Οικοπεδούχος', area: 80, bedrooms: 2, bathrooms: 1, amenities: [], polygonPoints: [{x:350,y:200}, {x:450,y:200}, {x:450,y:300}, {x:350,y:300}], attachments: [] },
    { _id: 'unit-c1', floorIds: ['flr-beta-1'], identifier: 'C1', name: 'Γραφείο Open-Space', type: 'Γραφείο', status: 'Διαθέσιμο', area: 250, price: 1200000, amenities: ['Κουζίνα', 'Server Room'], polygonPoints: [{x:100,y:100}, {x:400,y:100}, {x:400,y:400}, {x:100,y:400}], attachments: [] },
  ];
