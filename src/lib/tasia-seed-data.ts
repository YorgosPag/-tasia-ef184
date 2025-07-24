
import { Timestamp } from 'firebase/firestore';

type UnitStatus = 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';

// Authoritative list of all contacts
export const contactsData: any[] = [
    { _id: 'contact_comp1', type: 'Company', name: 'DevConstruct AE', website: 'https://devconstruct.example.com', contactInfo: { email: 'info@devconstruct.example.com', phone: '2101111111', afm: '123456789' }, logoUrl: 'https://placehold.co/100x100.png' },
    { _id: 'contact_comp2', type: 'Company', name: 'UrbanScapes ΕΠΕ', website: 'https://urbanscapes.example.com', contactInfo: { email: 'contact@urbanscapes.example.com', phone: '2102222222', afm: '987654321' }, logoUrl: 'https://placehold.co/100x100.png' },
    { _id: 'contact_ind1', type: 'Individual', name: 'Γιώργος Παπαδόπουλος', contactInfo: { email: 'gpapadopoulos@email.com', phone: '6971234567' } },
    { _id: 'contact_law1', type: 'Lawyer', name: 'Αθηνά Νομικού', contactInfo: { email: 'anomikou@lawfirm.gr', phone: '2109876543' } },
    { _id: 'contact_law2', type: 'Lawyer', name: 'Αλέξανδρος Παύλου', contactInfo: { email: 'apavlou@law.gr', phone: '2101231231' } },
    { _id: 'contact_not1', type: 'Notary', name: 'Ελένη Συμβολαιογράφου', contactInfo: { email: 'eleni.s@notary.gr', phone: '2155554433' } },
    { _id: 'contact_sup1', type: 'Supplier', name: 'Marmara Granites ΑΕ', contactInfo: { email: 'sales@marmara.gr', phone: '2310123456' } },
    { _id: 'contact_eng1', type: 'Individual', name: 'Μαρία Μηχανικού', contactInfo: { email: 'maria.m@engineering.gr', phone: '2112345678' } }
];

// Companies that can own projects, linking to their contact entry
export const companiesData: any[] = [
    { _id: 'comp1', _contactId: 'contact_comp1', name: 'DevConstruct AE', website: 'https://devconstruct.example.com', contactInfo: { email: 'info@devconstruct.example.com', phone: '2101111111', afm: '123456789' }, logoUrl: 'https://placehold.co/100x100.png' },
    { _id: 'comp2', _contactId: 'contact_comp2', name: 'UrbanScapes ΕΠΕ', website: 'https://urbanscapes.example.com', contactInfo: { email: 'contact@urbanscapes.example.com', phone: '2102222222', afm: '987654321' }, logoUrl: 'https://placehold.co/100x100.png' }
];

export const projectsData: any[] = [
    { _id: 'proj1', companyId: 'comp1', title: 'Athens Revival I', location: 'Κέντρο, Αθήνα', description: 'Μοντέρνα κτίρια κατοικιών στην καρδιά της Αθήνας.', deadline: Timestamp.fromDate(new Date('2025-12-31')), status: 'Σε εξέλιξη', photoUrl: 'https://placehold.co/600x400.png', tags: ['residential', 'luxury'] },
    { _id: 'proj2', companyId: 'comp2', title: 'Thessaloniki Waterfront', location: 'Παραλία, Θεσσαλονίκη', description: 'Συγκρότημα γραφείων με θέα στη θάλασσα.', deadline: Timestamp.fromDate(new Date('2026-06-30')), status: 'Ενεργό', photoUrl: 'https://placehold.co/600x400.png', tags: ['commercial', 'offices'] }
];

export const buildingsData: any[] = [
    { _id: 'build1', projectId: 'proj1', address: 'Πατησίων 100, Αθήνα', type: 'Πολυκατοικία', identifier: 'A', photoUrl: 'https://placehold.co/400x300.png' },
    { _id: 'build2', projectId: 'proj1', address: 'Πατησίων 102, Αθήνα', type: 'Πολυκατοικία', identifier: 'B', photoUrl: 'https://placehold.co/400x300.png' },
    { _id: 'build3', projectId: 'proj2', address: 'Λεωφόρος Νίκης 5, Θεσσαλονίκη', type: 'Κτίριο Γραφείων', identifier: 'W', photoUrl: 'https://placehold.co/400x300.png' }
];

export const floorsData: any[] = [
    { _id: 'floor1', buildingId: 'build1', level: '1', description: 'Πρώτος όροφος', floorPlanUrl: '' },
    { _id: 'floor2', buildingId: 'build1', level: '2', description: 'Δεύτερος όροφος', floorPlanUrl: '' },
    { _id: 'floor3', buildingId: 'build3', level: '5', description: 'Γραφεία 5ου ορόφου', floorPlanUrl: '' }
];

export const unitsData: {
  _id: string; floorIds: string[]; levelSpan?: number; identifier: string; name: string; type: string; status: UnitStatus;
  area: number; price?: number; bedrooms?: number; bathrooms?: string; orientation?: string; amenities?: string[];
  polygonPoints?: { x: number; y: number }[];
  attachments: { type: 'parking' | 'storage'; details: string; area?: number; price?: number; photoUrl?: string, sharePercentage?: number, isBundle?: boolean, isStandalone?: boolean }[];
}[] = [
    { 
        _id: 'unit1', floorIds: ['floor1'], identifier: 'Α1', name: 'Διαμέρισμα Α1', type: 'Δυάρι', status: 'Διαθέσιμο',
        area: 85, price: 250000, bedrooms: 2, bathrooms: '1', orientation: 'Νοτιοανατολικός', amenities: ['Τζάκι', 'Κλιματισμός'],
        polygonPoints: [{x: 100, y: 100}, {x: 200, y: 100}, {x: 200, y: 200}, {x: 100, y: 200}],
        attachments: [
            { type: 'parking', details: 'P-1', area: 12, price: 15000, isBundle: true },
            { type: 'storage', details: 'S-1', area: 8, price: 5000, isBundle: true }
        ]
    },
    { 
        _id: 'unit2', floorIds: ['floor1'], identifier: 'Α2', name: 'Διαμέρισμα Α2', type: 'Τριάρι', status: 'Πωλημένο',
        area: 110, price: 320000, bedrooms: 3, bathrooms: '2', orientation: 'Δυτικός', amenities: ['Αυτόνομη θέρμανση'],
        attachments: [
            { type: 'parking', details: 'P-2', area: 12, isBundle: true }
        ]
    },
    { 
        _id: 'unit3', floorIds: ['floor2'], identifier: 'Β1', name: 'Ρετιρέ Β1', type: 'Μεζονέτα', status: 'Κρατημένο',
        area: 150, price: 450000, bedrooms: 4, bathrooms: '3', orientation: 'Προσόψεως', amenities: ['Μεγάλη Βεράντα', 'BBQ'],
        attachments: []
    },
    { 
        _id: 'unit4', floorIds: ['floor3'], identifier: 'Γ501', name: 'Γραφείο 501', type: 'Open Space', status: 'Διαθέσιμο',
        area: 250, price: 800000, orientation: 'Θέα στη θάλασσα',
        attachments: [
             { type: 'parking', details: 'VIP-1', area: 15, isBundle: false, isStandalone: true, price: 50000 },
             { type: 'parking', details: 'VIP-2', area: 15, isBundle: false, isStandalone: true, price: 50000 }
        ]
    }
];
