'use client';

import React, { useState } from 'react';
import { StorageList } from '../StorageList';
import { StorageForm } from '../StorageForm';
import { StorageHeader } from '../storage/StorageHeader';
import { StorageDashboard } from '../storage/StorageDashboard';
import { StorageFilters } from '../storage/StorageFilters';
import { StorageMapPlaceholder } from '../storage/StorageMapPlaceholder';
import { useFilteredStorage } from '@/hooks/useFilteredStorage';
import { StorageUnit, StorageType, StorageStatus } from '@/lib/types/storage';
import { Package, Car } from 'lucide-react';

// Mock data based on the hierarchy you described
const mockStorageUnits: StorageUnit[] = [
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

interface StorageTabProps {
  building: {
    id: number;
    name: string;
    project: string;
    company: string;
  };
}

export function StorageTab({ building }: StorageTabProps) {
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>(mockStorageUnits);
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<StorageType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<StorageStatus | 'all'>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  
  const { filteredUnits, stats } = useFilteredStorage(storageUnits, {
    searchTerm,
    type: filterType,
    status: filterStatus,
    floor: filterFloor,
  });

  const getStatusColor = (status: StorageStatus) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'sold': return 'bg-blue-500';
      case 'reserved': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: StorageStatus) => {
    const labels: Record<StorageStatus, string> = { available: 'Διαθέσιμο', sold: 'Πωλήθηκε', reserved: 'Κρατημένο', maintenance: 'Συντήρηση' };
    return labels[status];
  };

  const getTypeIcon = (type: StorageType) => (type === 'storage' ? <Package className="w-4 h-4" /> : <Car className="w-4 h-4" />);
  const getTypeLabel = (type: StorageType) => (type === 'storage' ? 'Αποθήκη' : 'Θέση Στάθμευσης');

  const handleAddNew = () => { setSelectedUnit(null); setShowForm(true); };
  const handleEdit = (unit: StorageUnit) => { setSelectedUnit(unit); setShowForm(true); };
  const handleSave = (unit: StorageUnit) => {
    if (selectedUnit) {
      setStorageUnits(units => units.map(u => u.id === unit.id ? unit : u));
    } else {
      setStorageUnits(units => [...units, { ...unit, id: `new_${Date.now()}` }]);
    }
    setShowForm(false);
    setSelectedUnit(null);
  };
  const handleDelete = (unitId: string) => setStorageUnits(units => units.filter(u => u.id !== unitId));

  return (
    <div className="space-y-6">
      <StorageHeader 
        buildingName={building.name} 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddNew={handleAddNew}
      />
      <StorageDashboard stats={stats} />
      <StorageFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterFloor={filterFloor}
        setFilterFloor={setFilterFloor}
      />
      
      {viewMode === 'list' ? (
        <StorageList
          units={filteredUnits}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          getTypeIcon={getTypeIcon}
          getTypeLabel={getTypeLabel}
        />
      ) : (
        <StorageMapPlaceholder />
      )}

      {showForm && (
        <StorageForm
          unit={selectedUnit}
          building={building}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setSelectedUnit(null);
          }}
        />
      )}
    </div>
  );
}
