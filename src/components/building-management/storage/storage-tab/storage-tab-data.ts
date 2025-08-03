'use client';

import { StorageUnit } from '@/lib/types/storage';

export const mockStorageUnits: StorageUnit[] = [
  {
    id: 'A_A2_1',
    code: 'A_A2_1',
    type: 'storage',
    floor: 'Υπόγειο',
    area: 4.08,
    price: 1590.00,
    status: 'available',
    description: 'ΜΑΥΡΑΚΗ ΑΙΚΑΤΕΡΙΝΗ',
    building: 'ΚΤΙΡΙΟ Α',
    project: 'Παλαιολόγου',
    company: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.',
    linkedProperty: null,
    coordinates: { x: 10, y: 15 },
    features: ['Ηλεκτρικό ρεύμα', 'Αεροθαλάμος']
  },
  {
    id: 'A_A2_2',
    code: 'A_A2_2', 
    type: 'storage',
    floor: 'Υπόγειο',
    area: 4.09,
    price: 1590.00,
    status: 'sold',
    description: 'ΜΑΥΡΑΚΗ ΑΙΚΑΤΕΡΙΝΗ',
    building: 'ΚΤΙΡΙΟ Α',
    project: 'Παλαιολόγου',
    company: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.',
    linkedProperty: 'Δ2.1',
    coordinates: { x: 20, y: 15 },
    features: ['Ηλεκτρικό ρεύμα']
  },
  {
    id: 'A_A3_1',
    code: 'A_A3_1',
    type: 'parking',
    floor: 'Ισόγειο',
    area: 12.5,
    price: 2500.00,
    status: 'reserved',
    description: 'ΤΕΖΑΨΙΔΗΣ ΛΕΩΝΙΔΑΣ',
    building: 'ΚΤΙΡΙΟ Α',
    project: 'Παλαιολόγου', 
    company: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.',
    linkedProperty: 'Δ3.1',
    coordinates: { x: 5, y: 25 },
    features: ['Καλυμμένη θέση', 'Πρίζα φόρτισης']
  },
  {
    id: 'A_A4_7',
    code: 'A_A4_7',
    type: 'storage',
    floor: 'Υπόγειο',
    area: 3.76,
    price: 1490.00,
    status: 'available',
    description: 'ΑΣΛΑΝΙΔΗΣ ΑΝΑΣΤΑΣΙΟΣ',
    building: 'ΚΤΙΡΙΟ Α',
    project: 'Παλαιολόγου',
    company: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.',
    linkedProperty: null,
    coordinates: { x: 30, y: 10 },
    features: ['Φυσικός φωτισμός']
  }
];
