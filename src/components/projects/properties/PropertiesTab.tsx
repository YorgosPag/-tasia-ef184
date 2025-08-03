'use client';

import React, { useState, useMemo } from 'react';
import { PropertyList } from './PropertyList';
import { PropertyDetails } from './PropertyDetails';
import type { Property, PropertyFilters, PropertyStats } from '@/types/property';

// Mock data based on the images provided
const mockProperties: Property[] = [
  {
    id: '1',
    code: 'B_D1.1',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'south',
    rooms: 2,
    bathrooms: 1,
    area: 57.75,
    balconyArea: 9.83,
    price: 100000,
    status: 'sold',
    buyer: 'ΚΕΛΕΣΙΔΗ ΠΕΛΛΕΝΑ',
    saleDate: '2008-01-25',
    salePrice: 104490,
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα δύο δωματίων στο ισόγειο',
    features: ['Μπαλκόνι', 'Αποθήκη', 'Θέση Στάθμευσης'],
    storageUnits: [
      {
        id: 's1',
        code: 'B_A1.7',
        type: 'storage',
        floor: 'Υπόγειο',
        area: 11.16,
        price: 4490,
        status: 'sold',
        linkedPropertyId: '1',
        buyer: 'ΚΕΛΕΣΙΔΗ ΠΕΛΛΕΝΑ',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: ['B_S1.7'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'B_D1.2',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'north',
    rooms: 2,
    bathrooms: 1,
    area: 62.20,
    balconyArea: 8.50,
    price: 105000,
    status: 'sold',
    buyer: 'ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ',
    saleDate: '2008-03-15',
    salePrice: 110000,
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα δύο δωματίων στο ισόγειο',
    features: ['Μπαλκόνι', 'Αποθήκη'],
    storageUnits: [
      {
        id: 's2',
        code: 'B_A1.2',
        type: 'storage',
        floor: 'Υπόγειο',
        area: 10.35,
        price: 4200,
        status: 'sold',
        linkedPropertyId: '2',
        buyer: 'ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    code: 'B_D1.3',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'east',
    rooms: 1,
    bathrooms: 1,
    area: 45.30,
    balconyArea: 6.20,
    price: 85000,
    status: 'available',
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα ενός δωματίου στο ισόγειο',
    features: ['Μπαλκόνι'],
    storageUnits: [],
    parkingSpots: [],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    code: 'B_D1.7',
    type: 'apartment',
    building: 'B',
    floor: 'Ισόγειο',
    orientation: 'west',
    rooms: 3,
    bathrooms: 2,
    area: 78.45,
    balconyArea: 12.30,
    price: 125000,
    status: 'owner',
    projectId: 1,
    buildingId: 'B',
    floorNumber: 0,
    description: 'Διαμέρισμα τριών δωματίων στο ισόγειο',
    features: ['Μεγάλο Μπαλκόνι', 'Αποθήκη', 'Θέση Στάθμευσης'],
    storageUnits: [
      {
        id: 's4',
        code: 'B_A1.7',
        type: 'basement',
        floor: 'Υπόγειο',
        area: 15.20,
        price: 0,
        status: 'owner',
        linkedPropertyId: '4',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      }
    ],
    parkingSpots: ['B_S1.7'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
];

interface PropertiesTabProps {
  properties?: Property[];
}

export function PropertiesTab({ properties = mockProperties }: PropertiesTabProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0] || null);
  const [filters, setFilters] = useState<PropertyFilters>({
    searchTerm: '',
    type: 'all',
    status: 'all',
    floor: 'all',
    building: 'all',
    minArea: null,
    maxArea: null,
    minPrice: null,
    maxPrice: null
  });

  const stats = useMemo<PropertyStats>(() => {
    const totalProperties = properties.length;
    const availableProperties = properties.filter(p => p.status === 'available').length;
    const soldProperties = properties.filter(p => p.status === 'sold').length;
    const reservedProperties = properties.filter(p => p.status === 'reserved').length;
    
    const totalValue = properties.reduce((sum, p) => sum + p.price, 0);
    const totalArea = properties.reduce((sum, p) => sum + p.area, 0);
    const averagePrice = totalProperties > 0 ? totalValue / totalProperties : 0;

    const propertiesByType = properties.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const propertiesByFloor = properties.reduce((acc, p) => {
      acc[p.floor] = (acc[p.floor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const propertiesByStatus = properties.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allStorageUnits = properties.flatMap(p => p.storageUnits);
    const totalStorageUnits = allStorageUnits.length;
    const availableStorageUnits = allStorageUnits.filter(s => s.status === 'available').length;
    const soldStorageUnits = allStorageUnits.filter(s => s.status === 'sold').length;

    return {
      totalProperties,
      availableProperties,
      soldProperties,
      reservedProperties,
      totalValue,
      totalArea,
      averagePrice,
      propertiesByType,
      propertiesByFloor,
      propertiesByStatus,
      totalStorageUnits,
      availableStorageUnits,
      soldStorageUnits
    };
  }, [properties]);

  const handleFiltersChange = (newFilters: Partial<PropertyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
  };

  return (
    <div className="h-full flex gap-4 overflow-hidden">
      <PropertyList
        properties={properties}
        selectedProperty={selectedProperty}
        onSelectProperty={handleSelectProperty}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      
      {selectedProperty ? (
        <PropertyDetails property={selectedProperty} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground bg-card border rounded-lg">
          Επιλέξτε ένα ακίνητο για να δείτε τις λεπτομέρειες.
        </div>
      )}
    </div>
  );
}
