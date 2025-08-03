'use client';

import { useState } from 'react';

export function useToolbarState() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewBuilding = () => console.log('Creating new building...');
  const handleEditBuilding = () => console.log('Editing building...');
  const handleDeleteBuilding = () => console.log('Deleting building...');
  const handleSearch = (term: string) => setSearchTerm(term);
  const handleRefresh = () => console.log('Refreshing data...');
  const handleExport = (format: string) => console.log(`Exporting as ${format}...`);

  const toggleSort = () => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  const toggleAdvancedMode = () => setIsAdvancedMode(!isAdvancedMode);

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };
  
  const clearFilters = () => setActiveFilters([]);

  return {
    isAdvancedMode,
    selectedItems,
    sortDirection,
    activeFilters,
    searchTerm,
    setIsAdvancedMode,
    setSelectedItems,
    setSortDirection,
    setActiveFilters,
    setSearchTerm,
    handleNewBuilding,
    handleEditBuilding,
    handleDeleteBuilding,
    handleSearch,
    handleRefresh,
    handleExport,
    toggleSort,
    toggleAdvancedMode,
    handleFilterToggle,
    clearFilters
  };
}
