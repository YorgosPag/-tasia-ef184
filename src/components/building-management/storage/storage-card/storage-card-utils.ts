'use client';
import { StorageStatus, StorageType } from '@/types/storage';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(price);
};

export const formatArea = (area: number) => {
  return `${area.toFixed(2)} m²`;
};

export const getPricePerSqm = (unit: { price: number; area: number }) => {
  if (unit.area === 0) return 0;
  return Math.round(unit.price / unit.area);
};

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
  const labels: Record<StorageStatus, string> = { available: 'Διαθέσιμο', sold: 'Πωλήθηκε', reserved: 'Κρατημένο', maintenance: 'Συντήρηση' };
  return labels[status];
};

export const getTypeColor = (type: StorageType) => {
    return type === 'storage'
        ? 'text-purple-700'
        : 'text-orange-700'
}

export const getTypeLabel = (type: StorageType) => {
  return type === 'storage' ? 'Αποθήκη' : 'Θέση Στάθμευσης';
};
