
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
    {
      _id: 'island-devs',
      name: 'Island Developers',
      logoUrl: 'https://placehold.co/40x40.png',
      website: 'https://island-devs.example.com',
      contactInfo: {
        email: 'sales@island-devs.gr',
        phone: '2810123456',
        address: '25ης Αυγούστου, Ηράκλειο',
        afm: '112233445',
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
    {
      _id: 'proj-crete-villas',
      title: 'Crete Seafront Villas',
      companyId: 'island-devs',
      location: 'Ελούντα, Κρήτη',
      description: 'Συγκρότημα 12 πολυτελών παραθαλάσσιων βιλών με ιδιωτικές πισίνες.',
      deadline: Timestamp.fromDate(new Date('2024-08-31')),
      status: 'Ολοκληρωμένο',
      photoUrl: 'https://placehold.co/800x600.png',
      tags: ['villas', 'luxury', 'holiday-home'],
    },
  ];

  export const buildingsData = [
    { 
        _id: 'bld-ar-main', 
        address: 'Πατησίων 100', 
        type: 'Πολυκατοικία', 
        projectId: 'proj-athens-revival', 
        description: 'Το κεντρικό κτίριο του έργου Athens Revival.',
        photoUrl: 'https://placehold.co/600x400.png',
        floorsCount: 5,
        constructionYear: 1960,
        tags: ['ιστορικό', 'ανακαίνιση'],
    },
    { 
        _id: 'bld-tt-towerA', 
        address: 'Λεωφόρος Γεωργικής Σχολής 55', 
        type: 'Πύργος Κατοικιών', 
        projectId: 'proj-thess-towers',
        description: 'Πύργος Α, με 20 ορόφους κατοικιών.',
        photoUrl: 'https://placehold.co/600x400.png',
        floorsCount: 20,
        constructionYear: 2025,
        tags: ['νεόδμητο', 'υψηλό'],
    },
    { 
        _id: 'bld-tt-towerB', 
        address: 'Λεωφόρος Γεωργικής Σχολής 57', 
        type: 'Πύργος Γραφείων', 
        projectId: 'proj-thess-towers',
        description: 'Πύργος Β, με 15 ορόφους γραφείων και καταστήματα στο ισόγειο.',
        photoUrl: 'https://placehold.co/600x400.png',
        floorsCount: 15,
        constructionYear: 2026,
        tags: ['νεόδμητο', 'εμπορικό'],
    },
    {
      _id: 'bld-cv-villa1',
      address: 'Villa 1, Elounda',
      type: 'Βίλα',
      projectId: 'proj-crete-villas',
      description: 'Ανεξάρτητη βίλα 250 τ.μ.',
      photoUrl: 'https://placehold.co/600x400.png',
      floorsCount: 2,
      constructionYear: 2024,
      tags: ['πισίνα', 'θέα θάλασσα'],
    }
  ];

  export const floorsData = [
    { _id: 'flr-ar-main-1', level: '1', description: 'Πρώτος όροφος', buildingId: 'bld-ar-main', floorPlanUrl: 'https://firebasestorage.googleapis.com/v0/b/tasia-6f77i.appspot.com/o/floor_plans%2Fsample-floor-plan.pdf?alt=media&token=8a536968-3b2a-4303-a178-6512822c7595' },
    { _id: 'flr-ar-main-2', level: '2', description: 'Δεύτερος όροφος', buildingId: 'bld-ar-main', floorPlanUrl: '' },
    { _id: 'flr-ar-main-3', level: '3', description: 'Τρίτος όροφος', buildingId: 'bld-ar-main', floorPlanUrl: '' },
    { _id: 'flr-tt-towerA-18', level: '18', description: '18ος Όροφος', buildingId: 'bld-tt-towerA', floorPlanUrl: '' },
    { _id: 'flr-tt-towerB-ground', level: 'Ισόγειο', description: 'Εμπορικά Καταστήματα', buildingId: 'bld-tt-towerB', floorPlanUrl: '' },
    { _id: 'flr-cv-villa1-ground', level: 'Ισόγειο', description: 'Κύριοι χώροι', buildingId: 'bld-cv-villa1', floorPlanUrl: '' },
    { _id: 'flr-cv-villa1-first', level: '1ος', description: 'Υπνοδωμάτια', buildingId: 'bld-cv-villa1', floorPlanUrl: '' },
  ];

  export const unitsData: {
    _id: string; floorIds: string[]; levelSpan?: string; identifier: string; name: string; type: string; status: UnitStatus;
    area: number; price?: number; bedrooms?: number; bathrooms?: number; orientation?: string; amenities?: string[];
    polygonPoints?: { x: number; y: number }[];
    attachments: { type: 'parking' | 'storage'; details: string; area?: number; price?: number; photoUrl?: string, sharePercentage?: number, isBundle?: boolean, isStandalone?: boolean }[];
  }[] = [
    // --- Athens Revival Units (bld-ar-main) ---
    { _id: 'unit-ar-101', floorIds: ['flr-ar-main-1'], identifier: 'A101', name: 'Διαμέρισμα 101', type: 'Δυάρι', status: 'Διαθέσιμο', area: 75.5, price: 280000, bedrooms: 2, bathrooms: 1, orientation: 'Νότιο', amenities: ['Μπαλκόνι', 'Τζάκι'], polygonPoints: [{x:50,y:50}, {x:150,y:50}, {x:150,y:150}, {x:50,y:150}], attachments: [{type: 'parking', details: 'P-1', area: 12.5, price: 15000, isBundle: true}, {type: 'storage', details: 'S-101', area: 5, price: 5000, isBundle: true}] },
    { _id: 'unit-ar-102', floorIds: ['flr-ar-main-1'], identifier: 'A102', name: 'Διαμέρισμα 102', type: 'Τριάρι', status: 'Κρατημένο', area: 102, price: 350000, bedrooms: 3, bathrooms: 2, orientation: 'Νότιο-Δυτικό', amenities: ['Μεγάλο Μπαλκόνι'], polygonPoints: [{x:200,y:50}, {x:300,y:50}, {x:300,y:150}, {x:200,y:150}], attachments: [{type: 'parking', details: 'P-2', area: 12.5, price: 15000, isStandalone: true}] },
    { _id: 'unit-ar-201', floorIds: ['flr-ar-main-2'], identifier: 'A201', name: 'Διαμέρισμα 201', type: 'Δυάρι', status: 'Πωλημένο', area: 78, price: 295000, bedrooms: 2, bathrooms: 1, amenities: ['Μπαλκόνι'], polygonPoints: [], attachments: [] },
    { _id: 'unit-ar-301', floorIds: ['flr-ar-main-3'], identifier: 'A301', name: 'Ρετιρέ', type: 'Μεζονέτα', status: 'Οικοπεδούχος', area: 150, levelSpan: '3-4', bedrooms: 4, bathrooms: 3, amenities: ['Ταράτσα', 'BBQ', 'Jacuzzi'], polygonPoints: [], attachments: [{type: 'storage', details: 'S-301', area: 15, isBundle: true}] },
    
    // --- Thessaloniki Towers Units (bld-tt-towerA & bld-tt-towerB) ---
    { _id: 'unit-tt-A1801', floorIds: ['flr-tt-towerA-18'], identifier: 'TA-1801', name: 'Sky Apartment', type: 'Τριάρι', status: 'Διαθέσιμο', area: 120, price: 850000, bedrooms: 3, bathrooms: 2, amenities: ['Πανοραμική Θέα', 'Smart Home'], polygonPoints: [], attachments: [{type: 'parking', details: 'P-A181', isBundle: true}, {type: 'parking', details: 'P-A182', isBundle: true}] },
    { _id: 'unit-tt-B-G01', floorIds: ['flr-tt-towerB-ground'], identifier: 'TB-G01', name: 'Κατάστημα Γωνιακό', type: 'Εμπορικό Κατάστημα', status: 'Διαθέσιμο', area: 250, price: 1200000, amenities: ['Πρόσοψη', 'WC'], polygonPoints: [], attachments: [] },
    
    // --- Crete Villas Units (bld-cv-villa1) ---
    { _id: 'unit-cv-V1', floorIds: ['flr-cv-villa1-ground', 'flr-cv-villa1-first'], levelSpan: 'Ισόγειο - 1ος', identifier: 'Villa 1', name: 'Sea-view Villa', type: 'Βίλα', status: 'Πωλημένο', area: 250, price: 2500000, bedrooms: 5, bathrooms: 5, amenities: ['Ιδιωτική Πισίνα', 'Κήπος', 'Άμεση πρόσβαση στη θάλασσα'], polygonPoints: [], attachments: [] },
  ];
