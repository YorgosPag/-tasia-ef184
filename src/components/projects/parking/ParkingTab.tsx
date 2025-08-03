'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParkingTableToolbar } from './ParkingTableToolbar';
import { ParkingSpotTable } from './ParkingSpotTable';
import type { ParkingSpot, ParkingFilters, ParkingStats } from '@/types/parking';

// Mock data based on the images provided
const mockParkingSpots: ParkingSpot[] = [
  {
    id: '1',
    code: 'G_S5.2',
    type: 'open',
    propertyCode: 'G_D5.2',
    level: 'Ισόγειο',
    area: 13.2,
    price: 0,
    value: 0,
    valueWithSyndicate: 0,
    status: 'sold',
    owner: 'ΧΑΤΖΗΙΩΑΝΝΟΥ ΠΑΡΘΕΝΑ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'B_S5.7',
    type: 'open',
    propertyCode: 'B_D5.7',
    level: 'Ισόγειο',
    area: 12.5,
    price: 0,
    value: 0,
    valueWithSyndicate: 0,
    status: 'sold',
    owner: 'ΧΑΤΖΗΓΕΩΡΓΙΟΥ (Μ) ΚΑΘΑΡΙΝΑ ΔΗΜΗΤΡΑ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    code: 'A_S2.7',
    type: 'open',
    propertyCode: 'A_D2.7',
    level: 'Ισόγειο',
    area: 12.21,
    price: 0,
    value: 0,
    valueWithSyndicate: 0,
    status: 'sold',
    owner: 'ΤΣΟΠΟΖΙΔΟΥ ΒΙΟΛΑ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    code: 'G_S4.5',
    type: 'open',
    propertyCode: 'G_D4.5',
    level: 'Ισόγειο',
    area: 12,
    price: 0,
    value: 1.00,
    valueWithSyndicate: 0,
    status: 'sold',
    owner: 'ΤΣΑΠΡΑΝΖΗ ΑΓΓΕΛΙΚΗ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '5',
    code: 'G_S4.6',
    type: 'open',
    propertyCode: 'G_D4.6',
    level: 'Ισόγειο',
    area: 12,
    price: 0,
    value: 1.00,
    valueWithSyndicate: 0,
    status: 'sold',
    owner: 'ΤΣΑΠΡΑΝΖΗ ΑΓΓΕΛΙΚΗ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '6',
    code: 'G_S2.2',
    type: 'open',
    propertyCode: 'G_D2.2',
    level: 'Ισόγειο',
    area: 12,
    price: 0,
    value: 0,
    valueWithSyndicate: 0,
    status: 'sold',
    owner: 'ΤΣΑΚΙΛΑΚΗΣ ΧΡΗΣΤΟΣ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '7',
    code: 'G_S1.1',
    type: 'open',
    propertyCode: 'G_D1.1',
    level: 'Ισόγειο',
    area: 12,
    price: 0,
    value: 0,
    valueWithSyndicate: 0,
    status: 'sold',
    owner: 'ΤΟΥΡΛΙΑΡΗΣ ΜΑΡΙΑ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '8',
    code: 'G_S5.3',
    type: 'open',
    propertyCode: 'G_D5.3',
    level: 'Ισόγειο',
    area: 12.27,
    price: 0,
    value: 0,
    valueWithSyndicate: 0,
    status: 'sold',
    owner: 'ΤΟΙΖΚΙΝ ΑΛΕΞΕΙ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '9',
    code: 'A_S3.6',
    type: 'open',
    propertyCode: 'A_D3.6',
    level: 'Ισόγειο',
    area: 12.33,
    price: 0,
    value: 0,
    valueWithSyndicate: 0,
    status: 'owner',
    owner: 'ΤΕΖΑΜΙΔΟΥ ΠΟΛΥΞΕΝΗ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '10',
    code: 'B_S3.7',
    type: 'covered',
    propertyCode: 'B_D3.7',
    level: 'Ισόγειο',
    area: 10.34,
    price: 0,
    value: 0,
    valueWithSyndicate: 0,
    status: 'owner',
    owner: 'ΤΕΖΑΜΙΔΟΥ ΠΟΛΥΞΕΝΗ',
    floorPlan: '\\Server\\shared\\6. erga\\Palaiologou\\ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    constructedBy: 'ΠΑΓΩΝΗΣ ΓΕΩΡΓΙΟΣ',
    projectId: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  }
];

interface ParkingTabProps {
  parkingSpots?: ParkingSpot[];
}

export function ParkingTab({ parkingSpots = mockParkingSpots }: ParkingTabProps) {
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [filters, setFilters] = useState<ParkingFilters>({
    searchTerm: '',
    type: 'all',
    status: 'all',
    level: 'all',
    owner: '',
    minArea: null,
    maxArea: null,
    minPrice: null,
    maxPrice: null
  });

  const stats = useMemo<ParkingStats>(() => {
    const totalSpots = parkingSpots.length;
    const soldSpots = parkingSpots.filter(spot => spot.status === 'sold').length;
    const ownerSpots = parkingSpots.filter(spot => spot.status === 'owner').length;
    const availableSpots = parkingSpots.filter(spot => spot.status === 'available').length;
    const reservedSpots = parkingSpots.filter(spot => spot.status === 'reserved').length;
    
    const totalValue = parkingSpots.reduce((sum, spot) => sum + spot.value, 0);
    const totalArea = parkingSpots.reduce((sum, spot) => sum + spot.area, 0);
    const averagePrice = totalSpots > 0 ? parkingSpots.reduce((sum, spot) => sum + spot.price, 0) / totalSpots : 0;

    const spotsByType = parkingSpots.reduce((acc, spot) => {
      acc[spot.type] = (acc[spot.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const spotsByLevel = parkingSpots.reduce((acc, spot) => {
      acc[spot.level] = (acc[spot.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const spotsByStatus = parkingSpots.reduce((acc, spot) => {
      acc[spot.status] = (acc[spot.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSpots,
      soldSpots,
      ownerSpots,
      availableSpots,
      reservedSpots,
      totalValue,
      totalArea,
      averagePrice,
      spotsByType,
      spotsByLevel,
      spotsByStatus
    };
  }, [parkingSpots]);

  const handleFiltersChange = (newFilters: Partial<ParkingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleExport = () => {
    console.log('Εξαγωγή δεδομένων θέσεων στάθμευσης');
  };

  const handleImport = () => {
    console.log('Εισαγωγή δεδομένων θέσεων στάθμευσης');
  };

  const handleAdd = () => {
    console.log('Προσθήκη νέας θέσης στάθμευσης');
  };

  const handleDelete = () => {
    console.log('Διαγραφή επιλεγμένων θέσεων:', selectedSpots);
  };

  const handleSave = () => {
    console.log('Αποθήκευση αλλαγών');
  };

  const handleRefresh = () => {
    console.log('Ανανέωση δεδομένων');
  };

  const handleEdit = (spot: ParkingSpot) => {
    console.log('Επεξεργασία θέσης:', spot);
  };

  const handleView = (spot: ParkingSpot) => {
    console.log('Προβολή θέσης:', spot);
  };

  const handleViewFloorPlan = (spot: ParkingSpot) => {
    console.log('Προβολή κάτοψης για θέση:', spot);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Διαχείριση Θέσεων Στάθμευσης</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ParkingTableToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            stats={stats}
            selectedCount={selectedSpots.length}
            onExport={handleExport}
            onImport={handleImport}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onSave={handleSave}
            onRefresh={handleRefresh}
          />
          
          <ParkingSpotTable
            spots={parkingSpots}
            filters={filters}
            selectedSpots={selectedSpots}
            onSelectionChange={setSelectedSpots}
            onEdit={handleEdit}
            onView={handleView}
            onViewFloorPlan={handleViewFloorPlan}
          />
        </CardContent>
      </Card>
    </div>
  );
}