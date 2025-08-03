'use client';
import React from 'react';
import { Package, Car } from 'lucide-react';
import { StorageStatus, StorageType } from '@/types/storage';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatArea = (area: number) => {
  return `${area.toFixed(2)} m²`;
};

export const getStatusColor = (status: StorageStatus) => {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'sold':
      return 'bg-blue-500';
    case 'reserved':
      return 'bg-yellow-500';
    case 'maintenance':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
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
  return type === 'storage' ? (
    <Package className="w-4 h-4" />
  ) : (
    <Car className="w-4 h-4" />
  );
};

export const getTypeLabel = (type: StorageType) => {
  return type === 'storage' ? 'Αποθήκη' : 'Θέση Στάθμευσης';
};
