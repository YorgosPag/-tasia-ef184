// Storage unit types and interfaces for building management system

export type StorageType = 'storage' | 'parking';

export type StorageStatus = 'available' | 'sold' | 'reserved' | 'maintenance';

export interface Coordinates {
  x: number;
  y: number;
}

export interface StorageUnit {
  id: string;
  code: string;
  type: StorageType;
  floor: string;
  area: number; // in square meters
  price: number; // in euros
  status: StorageStatus;
  description: string;
  building: string;
  project: string;
  company: string;
  linkedProperty: string | null; // Code of linked property/apartment
  coordinates: Coordinates; // Position on building map
  features: string[]; // Array of features like "Ηλεκτρικό ρεύμα", "Φωτισμός", etc.
  createdAt?: string;
  updatedAt?: string;
  soldAt?: string;
  soldTo?: string; // Customer who bought it
  notes?: string;
}

export interface StorageFilter {
  type?: StorageType | 'all';
  status?: StorageStatus | 'all';
  floor?: string | 'all';
  minArea?: number;
  maxArea?: number;
  minPrice?: number;
  maxPrice?: number;
  hasLinkedProperty?: boolean;
  searchTerm?: string;
}

export interface StorageStats {
  total: number;
  byType: {
    storage: number;
    parking: number;
  };
  byStatus: {
    available: number;
    sold: number;
    reserved: number;
    maintenance: number;
  };
  byFloor: Record<string, number>;
  totalValue: number;
  totalArea: number;
  averagePricePerSqm: number;
  linkedUnits: number;
  unlinkedUnits: number;
}

export interface StorageTransaction {
  id: string;
  storageUnitId: string;
  type: 'sale' | 'reservation' | 'cancellation';
  amount: number;
  customerName: string;
  customerContact: string;
  date: string;
  notes?: string;
  linkedPropertyCode?: string;
}

// Building hierarchy interfaces
export interface Contact {
  id: string;
  name: string;
  type: 'individual' | 'company' | 'government';
  email?: string;
  phone?: string;
  address?: string;
}

export interface Project {
  id: string;
  name: string;
  contactId: string; // References Contact
  description?: string;
  startDate?: string;
  expectedCompletionDate?: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  totalValue?: number;
}

export interface Building {
  id: string;
  name: string;
  projectId: string; // References Project
  description?: string;
  address?: string;
  city?: string;
  totalArea: number;
  floors: number;
  status: 'planning' | 'construction' | 'completed';
  progress: number; // 0-100
}

export interface Floor {
  id: string;
  buildingId: string; // References Building
  name: string; // "Υπόγειο", "Ισόγειο", "1ος Όροφος", etc.
  level: number; // -2, -1, 0, 1, 2, etc.
  area: number;
  properties: Property[];
  storageUnits: StorageUnit[];
}

export interface Property {
  id: string;
  floorId: string; // References Floor
  code: string;
  type: 'studio' | 'apartment_1br' | 'apartment_2br' | 'apartment_3br' | 'maisonette' | 'store';
  area: number;
  price: number;
  status: 'available' | 'sold' | 'reserved';
  rooms?: number;
  bathrooms?: number;
  hasBalcony?: boolean;
  balconyArea?: number;
  features: string[];
  linkedStorageUnits?: string[]; // Array of StorageUnit IDs
}

// Utility functions type definitions
export type StorageValidator = (unit: Partial<StorageUnit>) => { isValid: boolean; errors: string[] };

export type StorageCalculator = {
  calculatePricePerSqm: (unit: StorageUnit) => number;
  calculateTotalValue: (units: StorageUnit[]) => number;
  calculateAverageArea: (units: StorageUnit[]) => number;
  calculateOccupancyRate: (units: StorageUnit[]) => number;
};

export type StorageReportData = {
  summary: StorageStats;
  salesData: StorageTransaction[];
  availabilityByFloor: Record<string, { available: number; total: number }>;
  priceAnalysis: {
    averageStoragePrice: number;
    averageParkingPrice: number;
    priceRangeStorage: { min: number; max: number };
    priceRangeParking: { min: number; max: number };
  };
  revenueProjection: {
    currentRevenue: number;
    potentialRevenue: number;
    projectedMonthlyRevenue: number;
  };
};

// Export default storage unit template
export const defaultStorageUnit: Partial<StorageUnit> = {
  type: 'storage',
  status: 'available',
  floor: 'Υπόγειο',
  area: 0,
  price: 0,
  linkedProperty: null,
  coordinates: { x: 0, y: 0 },
  features: [],
  description: '',
  notes: ''
};

// Common storage features by type
export const commonStorageFeatures: Record<StorageType, string[]> = {
  storage: [
    'Ηλεκτρικό ρεύμα',
    'Φυσικός φωτισμός',
    'Τεχνητός φωτισμός',
    'Αεροθαλάμος',
    'Ασφάλεια',
    'Πρόσβαση ανελκυστήρα',
    'Υδραυλικές εγκαταστάσεις',
    'Κλιματισμός',
    'Συναγερμός'
  ],
  parking: [
    'Καλυμμένη θέση',
    'Ανοιχτή θέση',
    'Πρίζα φόρτισης',
    'Ηλεκτρικό ρεύμα',
    'Φωτισμός',
    'Ασφάλεια',
    'Εύκολη πρόσβαση',
    'Θέση για μεγάλο όχημα',
    'Συναγερμός',
    'Κάμερες παρακολούθησης'
  ]
};

// Status labels in Greek
export const statusLabels: Record<StorageStatus, string> = {
  available: 'Διαθέσιμο',
  sold: 'Πωλήθηκε',
  reserved: 'Κρατημένο',
  maintenance: 'Συντήρηση'
};

// Type labels in Greek
export const typeLabels: Record<StorageType, string> = {
  storage: 'Αποθήκη',
  parking: 'Θέση Στάθμευσης'
};

// Standard floor names
export const standardFloors: string[] = [
  'Υπόγειο 3',
  'Υπόγειο 2',
  'Υπόγειο 1',
  'Υπόγειο',
  'Ισόγειο',
  '1ος Όροφος',
  '2ος Όροφος',
  '3ος Όροφος',
  '4ος Όροφος',
  '5ος Όροφος',
  '6ος Όροφος',
  '7ος Όροφος',
  '8ος Όροφος',
  '9ος Όροφος',
  '10ος Όροφος'
];