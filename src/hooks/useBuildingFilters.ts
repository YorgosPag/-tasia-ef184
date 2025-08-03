'use client';

import { useMemo } from 'react';
import type { Building } from '@/types/building';

export function useBuildingFilters(
  buildings: Building[],
  searchTerm: string,
  filterCompany: string,
  filterProject: string,
  filterStatus: string
) {
  const filteredBuildings = useMemo(() => {
    return buildings.filter(building => {
      const matchesSearch = building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           building.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           building.address?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCompany = filterCompany === 'all' || building.company === filterCompany;
      const matchesProject = filterProject === 'all' || building.project === filterProject;
      const matchesStatus = filterStatus === 'all' || building.status === filterStatus;
      
      return matchesSearch && matchesCompany && matchesProject && matchesStatus;
    });
  }, [buildings, searchTerm, filterCompany, filterProject, filterStatus]);

  const stats = useMemo(() => ({
    totalBuildings: buildings.length,
    activeProjects: buildings.filter(b => b.status === 'active' || b.status === 'construction').length,
    totalValue: buildings.reduce((sum, b) => sum + b.totalValue, 0),
    totalArea: buildings.reduce((sum, b) => sum + b.totalArea, 0),
    averageProgress: buildings.length > 0 ? Math.round(buildings.reduce((sum, b) => sum + b.progress, 0) / buildings.length) : 0,
    totalUnits: buildings.reduce((sum, b) => sum + b.units, 0)
  }), [buildings]);

  return { filteredBuildings, stats };
}
