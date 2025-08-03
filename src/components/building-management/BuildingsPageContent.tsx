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
    <div className="h-full flex flex-col bg-background">
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

      <div className="flex-1 flex overflow-hidden">
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
