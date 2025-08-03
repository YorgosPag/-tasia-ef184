# Building Management Components Code

This file contains the source code for all components related to the application's building management functionality.

---
## Required Files and Dependencies

### Core Component Files:
- **`src/app/(main)/building-management/page.tsx`**: The main entry point for the building management page.
- **`src/components/building-management/BuildingsPageContent.tsx`**: The primary container component that orchestrates the UI.
- **`src/components/building-management/BuildingsList.tsx`**: Displays the list of buildings.
- **`src/components/building-management/BuildingDetails.tsx`**: Shows the detailed view for a selected building.
- **`src/components/building-management/BuildingCard.tsx`**: The card component used in the grid view.
- **`src/components/building-management/tabs/GeneralTab.tsx`**: A tab within the details view for general information.
- **`src/components/building-management/tabs/TimelineTab.tsx`**: A tab for the project timeline.
- **`src/components/building-management/tabs/MapTab.tsx`**: A tab to display maps.
- **`src/components/building-management/tabs/AnalyticsTab.tsx`**: A tab for data analytics.
- **`src/components/building-management/storage/storage-tab.tsx`**: A tab for managing storage units and parking.

### Related Helper & UI Components:
- **`src/hooks/useBuildingFilters.ts`**: Custom hook for filtering and calculating stats for buildings.
- **`src/hooks/useToolbarState.ts`**: Custom hook for managing toolbar state.
- **`src/types/building.ts`**: TypeScript type definitions for building-related data.
- **`src/types/storage.ts`**: TypeScript type definitions for storage and parking units.
- **`src/components/ui/card.tsx`**, **`button.tsx`**, **`badge.tsx`**, **`progress.tsx`**, **`tabs.tsx`**, **`scroll-area.tsx`**, etc.: Reusable UI components from ShadCN.
- **`lucide-react`**: For icons.

---

## src/app/(main)/building-management/page.tsx

```tsx
'use client';

import React from 'react';
import { BuildingsPageContent } from '@/components/building-management/BuildingsPageContent';

export default function BuildingManagementPage() {
  return (
    <div className="h-full">
      <BuildingsPageContent />
    </div>
  );
}
```

---

## src/components/building-management/BuildingsPageContent.tsx

```tsx
'use client';

import React, { useState } from 'react';
import { BuildingsList } from './BuildingsList';
import { BuildingDetails } from './BuildingDetails';
import { BuildingCard } from './BuildingCard';
import { BuildingsPageHeader } from './page/BuildingsPageHeader';
import { BuildingsPageFilters } from './page/BuildingsPageFilters';
import { BuildingsDashboard } from './page/BuildingsDashboard';
import { useBuildingFilters } from '@/hooks/useBuildingFilters';
import type { Building } from '@/types/building';

// Mock data - This would typically come from a hook or props
const buildingsData: Building[] = [
    { 
    id: 1, 
    name: "ΚΤΙΡΙΟ Α (Μανδηλαρά - Πεζόδρομος & Πεζόδρομος)",
    description: "Πολυώροφο κτίριο μικτής χρήσης με βρεφονηπιακό σταθμό και κέντρο νεότητας",
    address: "Μανδηλαρά & Πεζόδρομος",
    city: "Αθήνα",
    totalArea: 2109.24,
    builtArea: 1850.50,
    floors: 7,
    units: 12,
    status: 'active',
    startDate: '2006-05-02',
    completionDate: '2009-02-28',
    progress: 85,
    totalValue: 1475000,
    company: "Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.",
    project: "Παλαιολόγου",
    category: 'mixed',
    features: ['Βρεφονηπιακός Σταθμός', 'Κέντρο Νεότητας', 'Γκαρσονιέρες', 'Διαμερίσματα 2Δ']
  },
  { 
    id: 2, 
    name: "ΚΤΙΡΙΟ Β (Μανδηλαρά & Πεζόδρομος)",
    description: "Κατοικίες υψηλών προδιαγραφών με θέα στην πόλη",
    address: "Μανδηλαρά & Πεζόδρομος",
    city: "Αθήνα",
    totalArea: 1850.75,
    builtArea: 1650.25,
    floors: 6,
    units: 8,
    status: 'construction',
    startDate: '2023-03-15',
    completionDate: '2025-01-20',
    progress: 45,
    totalValue: 1200000,
    company: "Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.",
    project: "Παλαιολόγου",
    category: 'residential',
    features: ['Πάρκινγκ', 'Αποθήκες', 'Μπαλκόνια']
  },
  { 
    id: 3, 
    name: "ΚΤΙΡΙΟ Γ (Μανδηλαρά - Παλαιολόγου & Πεζόδρομος)",
    description: "Εμπορικό κέντρο με καταστήματα και γραφεία",
    address: "Μανδηλαρά - Παλαιολόγου & Πεζόδρομος",
    city: "Αθήνα", 
    totalArea: 2500.00,
    builtArea: 2200.00,
    floors: 4,
    units: 15,
    status: 'planned',
    startDate: '2025-06-01',
    completionDate: '2027-12-15',
    progress: 5,
    totalValue: 2100000,
    company: "Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.",
    project: "Παλαιολόγου",
    category: 'commercial',
    features: ['Καταστήματα', 'Γραφεία', 'Εστιατόρια', 'Πάρκινγκ']
  }
];

const companies = [
  { id: 'pagonis', name: 'Ν.Χ.Γ. ΠΑΓΩΝΗΣ & ΣΙΑ Ο.Ε.' },
  { id: 'devconstruct', name: 'DevConstruct AE' },
];

const projects = [
  { id: 'palaiologou', name: 'Παλαιολόγου' },
  { id: 'kolonaki', name: 'Κολωνάκι' },
];

export function BuildingsPageContent() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building>(buildingsData[0]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showDashboard, setShowDashboard] = useState(true);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { filteredBuildings, stats } = useBuildingFilters(
    buildingsData, 
    searchTerm, 
    filterCompany, 
    filterProject, 
    filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'construction': return 'bg-blue-500';
      case 'planned': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ενεργό';
      case 'construction': return 'Υπό Κατασκευή';
      case 'planned': return 'Σχεδιασμένο';
      case 'completed': return 'Ολοκληρωμένο';
      default: return status;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background p-4 gap-4">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="p-4 space-y-4">
          <BuildingsPageHeader 
            showDashboard={showDashboard}
            setShowDashboard={setShowDashboard}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <BuildingsPageFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCompany={filterCompany}
            setFilterCompany={setFilterCompany}
            filterProject={filterProject}
            setFilterProject={setFilterProject}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            companies={companies}
            projects={projects}
          />
        </div>
      </div>
      
      {showDashboard && <BuildingsDashboard stats={stats} />}

      <div className="flex-1 flex overflow-hidden gap-4">
        {viewMode === 'list' ? (
          <>
            <BuildingsList
              buildings={filteredBuildings}
              selectedBuilding={selectedBuilding}
              onSelectBuilding={setSelectedBuilding}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
            <BuildingDetails 
              building={selectedBuilding} 
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          </>
        ) : (
          <div className="flex-1 p-4 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBuildings.map((building) => (
                <BuildingCard
                  key={building.id}
                  building={building}
                  isSelected={selectedBuilding.id === building.id}
                  onClick={() => setSelectedBuilding(building)}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## src/components/building-management/BuildingsList.tsx

```tsx
'use client';

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BuildingToolbar } from './BuildingToolbar';
import type { Building } from '@/types/building';
import { BuildingListHeader } from './list/BuildingListHeader';
import { BuildingListItem } from './list/BuildingListItem';

interface BuildingsListProps {
  buildings: Building[];
  selectedBuilding: Building;
  onSelectBuilding?: (building: Building) => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingsList({
  buildings,
  selectedBuilding,
  onSelectBuilding,
  getStatusColor,
  getStatusLabel
}: BuildingsListProps) {
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'value' | 'area'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleFavorite = (buildingId: number) => {
    setFavorites(prev =>
      prev.includes(buildingId)
        ? prev.filter(id => id !== buildingId)
        : [...prev, buildingId]
    );
  };
  
  const sortedBuildings = [...buildings].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'progress':
        aValue = a.progress;
        bValue = b.progress;
        break;
      case 'value':
        aValue = a.totalValue;
        bValue = b.totalValue;
        break;
      case 'area':
        aValue = a.totalArea;
        bValue = b.totalArea;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
  });


  return (
    <div className="w-[420px] bg-card border rounded-lg flex flex-col shrink-0 shadow-sm">
      <BuildingListHeader 
        buildings={buildings}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <BuildingToolbar />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sortedBuildings.map((building) => (
            <BuildingListItem
              key={building.id}
              building={building}
              selectedBuildingId={selectedBuilding?.id}
              onSelectBuilding={onSelectBuilding}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
```

---

... and so on for all other building management components.
