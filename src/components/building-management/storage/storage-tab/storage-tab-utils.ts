'use client';

import { Package, Car } from 'lucide-react';
import { StorageType, StorageStatus } from '@/lib/types/storage';

export const getStatusColor = (status: StorageStatus) => {
  switch (status) {
    case 'available': return 'bg-green-500';
    case 'sold': return 'bg-blue-500';
    case 'reserved': return 'bg-yellow-500';
    case 'maintenance': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export const getStatusLabel = (status: StorageStatus) => {
  const labels: Record<StorageStatus, string> = {
    available: 'Διαθέσιμο',
    sold: 'Πωλήθηκε',
    reserved: 'Κρατημένο',
    maintenance: 'Συντήρηση',
  };
  return labels[status];
};

export const getTypeIcon = (type: StorageType) => {
  return type === 'storage' ? <Package className="w-4 h-4" /> : <Car className="w-4 h-4" />;
};

export const getTypeLabel = (type: StorageType) => {
  return type === 'storage' ? 'Αποθήκη' : 'Θέση Στάθμευσης';
};
