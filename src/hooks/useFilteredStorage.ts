'use client';

import { useMemo } from 'react';
import { StorageUnit, StorageStats, StorageType, StorageStatus } from '@/lib/types/storage';

interface Filters {
  searchTerm: string;
  type: StorageType | 'all';
  status: StorageStatus | 'all';
  floor: string | 'all';
}

export function useFilteredStorage(
  allUnits: StorageUnit[],
  filters: Filters
): { filteredUnits: StorageUnit[]; stats: StorageStats } {

  const { searchTerm, type, status, floor } = filters;

  const filteredUnits = useMemo(() => {
    return allUnits.filter(unit => {
      const matchesSearch = unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           unit.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = type === 'all' || unit.type === type;
      const matchesStatus = status === 'all' || unit.status === status;
      const matchesFloor = floor === 'all' || unit.floor === floor;
      
      return matchesSearch && matchesType && matchesStatus && matchesFloor;
    });
  }, [allUnits, searchTerm, type, status, floor]);

  const stats = useMemo<StorageStats>(() => {
    const total = allUnits.length;
    const storageCount = allUnits.filter(u => u.type === 'storage').length;
    const parkingCount = total - storageCount;
    
    const statusCounts = allUnits.reduce((acc, unit) => {
      acc[unit.status] = (acc[unit.status] || 0) + 1;
      return acc;
    }, {} as Record<StorageStatus, number>);

    const totalValue = allUnits.reduce((sum, u) => sum + u.price, 0);
    const totalArea = allUnits.reduce((sum, u) => sum + u.area, 0);

    return {
      total,
      byType: {
        storage: storageCount,
        parking: parkingCount,
      },
      byStatus: {
        available: statusCounts.available || 0,
        sold: statusCounts.sold || 0,
        reserved: statusCounts.reserved || 0,
        maintenance: statusCounts.maintenance || 0,
      },
      byFloor: {}, // This would require more logic to compute
      totalValue,
      totalArea,
      averagePricePerSqm: totalArea > 0 ? totalValue / totalArea : 0,
      linkedUnits: allUnits.filter(u => u.linkedProperty).length,
      unlinkedUnits: allUnits.filter(u => !u.linkedProperty).length,
    };
  }, [allUnits]);

  return { filteredUnits, stats };
}
