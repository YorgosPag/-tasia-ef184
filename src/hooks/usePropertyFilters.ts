import { useMemo } from 'react';
import type { Property, PropertyStats } from '@/types/property';

export function usePropertyFilters(
  properties: Property[],
  searchTerm: string,
  filterType: string,
  filterStatus: string,
  filterFloor: string,
  filterBuilding: string
) {
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch = searchTerm === '' || 
        property.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.buyer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || property.type === filterType;
      const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
      const matchesFloor = filterFloor === 'all' || property.floor === filterFloor;
      const matchesBuilding = filterBuilding === 'all' || property.building === filterBuilding;

      return matchesSearch && matchesType && matchesStatus && matchesFloor && matchesBuilding;
    });
  }, [properties, searchTerm, filterType, filterStatus, filterFloor, filterBuilding]);

  const stats = useMemo<PropertyStats>(() => {
    const totalProperties = filteredProperties.length;
    const availableProperties = filteredProperties.filter(p => p.status === 'available').length;
    const soldProperties = filteredProperties.filter(p => p.status === 'sold').length;
    const reservedProperties = filteredProperties.filter(p => p.status === 'reserved').length;
    const ownerProperties = filteredProperties.filter(p => p.status === 'owner').length;
    
    const totalValue = filteredProperties.reduce((sum, p) => sum + p.price, 0);
    const totalArea = filteredProperties.reduce((sum, p) => sum + p.area, 0);
    const averagePrice = totalProperties > 0 ? totalValue / totalProperties : 0;

    const propertiesByType = filteredProperties.reduce((acc, property) => {
      acc[property.type] = (acc[property.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const propertiesByFloor = filteredProperties.reduce((acc, property) => {
      acc[property.floor] = (acc[property.floor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const propertiesByStatus = filteredProperties.reduce((acc, property) => {
      acc[property.status] = (acc[property.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const allStorageUnits = filteredProperties.flatMap(p => p.storageUnits);
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
  }, [filteredProperties]);

  return { filteredProperties, stats };
}