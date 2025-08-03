export interface Property {
    id: string;
    code: string;
    type: 'apartment' | 'studio' | 'maisonette' | 'shop' | 'office' | 'storage';
    building: string;
    floor: string;
    orientation: string;
    rooms: number;
    bathrooms: number;
    area: number;
    balconyArea: number;
    price: number;
    status: 'available' | 'sold' | 'reserved' | 'owner';
    buyer?: string;
    saleDate?: string;
    salePrice?: number;
    projectId: number;
    buildingId: string;
    floorNumber: number;
    description?: string;
    features: string[];
    storageUnits: StorageUnit[];
    parkingSpots: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface StorageUnit {
    id: string;
    code: string;
    type: 'storage' | 'basement';
    floor: string;
    area: number;
    price: number;
    status: 'available' | 'sold' | 'reserved' | 'owner';
    linkedPropertyId?: string;
    buyer?: string;
    saleDate?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PropertyStats {
    totalProperties: number;
    availableProperties: number;
    soldProperties: number;
    reservedProperties: number;
    totalValue: number;
    totalArea: number;
    averagePrice: number;
    propertiesByType: Record<string, number>;
    propertiesByFloor: Record<string, number>;
    propertiesByStatus: Record<string, number>;
    totalStorageUnits: number;
    availableStorageUnits: number;
    soldStorageUnits: number;
  }
  
  export interface PropertyFilters {
    searchTerm: string;
    type: string;
    status: string;
    floor: string;
    building: string;
    minArea: number | null;
    maxArea: number | null;
    minPrice: number | null;
    maxPrice: number | null;
  }
  
  export type PropertyType = 'apartment' | 'studio' | 'maisonette' | 'shop' | 'office' | 'storage';
  export type PropertyStatus = 'available' | 'sold' | 'reserved' | 'owner';
  
  export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    apartment: 'Διαμέρισμα',
    studio: 'Στούντιο',
    maisonette: 'Μεζονέτα',
    shop: 'Κατάστημα',
    office: 'Γραφείο',
    storage: 'Αποθήκη'
  };
  
  export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
    available: 'Διαθέσιμο',
    sold: 'Πουλημένο',
    reserved: 'Κρατημένο',
    owner: 'Οικοπεδούχου'
  };
  
  export const PROPERTY_STATUS_COLORS: Record<PropertyStatus, string> = {
    available: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    sold: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    reserved: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    owner: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  };
  
  export const STORAGE_TYPE_LABELS = {
    storage: 'Αποθήκη',
    basement: 'Υπόγειο'
  };
