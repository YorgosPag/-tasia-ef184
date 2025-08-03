'use client';

import React, { useState, useEffect } from 'react';
import { ProjectsList } from './ProjectsList';
import { ProjectDetails } from './ProjectDetails';
import { ProjectCard } from './ProjectCard';
import { ProjectsPageHeader } from './page/ProjectsPageHeader';
import { ProjectsPageFilters } from './page/ProjectsPageFilters';
import { ProjectsDashboard } from './page/ProjectsDashboard';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import type { Project, Company } from '@/types/project';

// Mock data - This would typically come from a hook or props
const projectsData: Project[] = [
  { 
    id: 1, 
    name: "3. ΕΥΤΕΡΠΗΣ",
    title: "Τρεις πενταώροφες οικοδομές με καταστήματα πιλοτή & υπόγειο",
    description: "Πρόκειται για ένα συγκρότημα τριών πενταόροφων κτιρίων, που βρίσκεται στο όριο του Ευόσμου με τη Νέα Επέκτασή του. Το κτιριολογικό πρόγραμμα περιλαμβάνει συνδυασμό κεντρικής χρήσης με χρήση κατοικίας.",
    address: "Ευτέρπης 32 - 34",
    city: "Θεσσαλονίκη",
    municipality: "Δήμος Ευόσμου",
    postalCode: "562 24",
    permitNumber: "5142/24-10-2001",
    permitAuthority: "Δήμος Ευόσμου",
    buildingBlock: "10",
    protocolNumber: "",
    status: 'completed',
    startDate: '2001-10-24',
    completionDate: '2004-06-15',
    progress: 100,
    totalValue: 2850000,
    company: "ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ",
    companyId: "pagonis-nest",
    category: 'mixed',
    totalArea: 3250.75,
    buildingCount: 3,
    floorCount: 5,
    unitCount: 24,
    showOnWeb: true,
    mapPath: "\\\\Server\\shared\\6. erga\\Eterpis_Gen\\Eterp_Gen_Images\\Eterp_Xartis.jpg",
    planPath: "\\\\Server\\shared\\6. erga\\TEST\\SSSSSS.pdf",
    percentageTablePath: "\\\\Server\\shared\\6. erga\\TEST\\SSSSSSSS.xls",
    features: ['Καταστήματα Πιλοτή', 'Κατοικίες', 'Υπόγειος Χώρος', 'Πάρκινγκ'],
    createdAt: '2001-10-24',
    updatedAt: '2024-01-15'
  },
  { 
    id: 2, 
    name: "Καληαρού & Κομνηνών",
    title: "Σύγχρονο συγκρότημα κατοικιών υψηλών προδιαγραφών",
    description: "Ένα μοντέρνο συγκρότημα που συνδυάζει την άνεση της σύγχρονης κατοικίας με την αρχιτεκτονική παράδοση της περιοχής. Διαθέτει ευρύχωρα διαμερίσματα και σύγχρονες υποδομές.",
    address: "Καληαρού & Κομνηνών",
    city: "Θεσσαλονίκη",
    municipality: "Δήμος Θεσσαλονίκης",
    postalCode: "546 24",
    permitNumber: "2847/15-03-2023",
    permitAuthority: "Δήμος Θεσσαλονίκης",
    buildingBlock: "15",
    protocolNumber: "PRO-2023-0156",
    status: 'construction',
    startDate: '2023-03-15',
    completionDate: '2025-09-30',
    progress: 65,
    totalValue: 1950000,
    company: "ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ",
    companyId: "pagonis-nest",
    category: 'residential',
    totalArea: 2180.50,
    buildingCount: 2,
    floorCount: 6,
    unitCount: 16,
    showOnWeb: true,
    features: ['Διαμερίσματα Υψηλών Προδιαγραφών', 'Πάρκινγκ', 'Αποθήκες', 'Κήπος'],
    createdAt: '2023-01-10',
    updatedAt: '2024-01-15'
  },
  { 
    id: 3, 
    name: "Εμπορικό Κέντρο Νέας Σμύρνης",
    title: "Σύγχρονο εμπορικό κέντρο με καταστήματα και γραφεία",
    description: "Ένα καινοτόμο εμπορικό έργο που στοχεύει να αναδείξει την εμπορική δραστηριότητα της περιοχής. Περιλαμβάνει καταστήματα, γραφεία και χώρους εστίασης.",
    address: "Λεωφόρος Συγγρού 150",
    city: "Αθήνα",
    municipality: "Δήμος Νέας Σμύρνης",
    postalCode: "171 21",
    permitNumber: "1245/08-11-2024",
    permitAuthority: "Δήμος Νέας Σμύρνης",
    buildingBlock: "8",
    protocolNumber: "PRO-2024-0298",
    status: 'approved',
    startDate: '2025-02-01',
    completionDate: '2027-05-15',
    progress: 15,
    totalValue: 3200000,
    company: "DevConstruct AE",
    companyId: "devconstruct",
    category: 'commercial',
    totalArea: 4500.00,
    buildingCount: 1,
    floorCount: 4,
    unitCount: 32,
    showOnWeb: false,
    features: ['Καταστήματα', 'Γραφεία', 'Εστιατόρια', 'Πάρκινγκ', 'Αίθριο'],
    createdAt: '2024-10-15',
    updatedAt: '2024-01-15'
  }
];

const companies: Company[] = [
  { id: 'pagonis-nest', name: 'ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ', type: 'individual' },
  { id: 'devconstruct', name: 'DevConstruct AE', type: 'company' },
  { id: 'public-works', name: 'Δημόσια Έργα ΑΕ', type: 'public' },
];

const municipalities = [
  { id: 'evosmos', name: 'Δήμος Ευόσμου' },
  { id: 'thessaloniki', name: 'Δήμος Θεσσαλονίκης' },
  { id: 'nea-smyrni', name: 'Δήμος Νέας Σμύρνης' },
  { id: 'athens', name: 'Δήμος Αθηναίων' },
];

export function ProjectsPageContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showDashboard, setShowDashboard] = useState(true);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMunicipality, setFilterMunicipality] = useState('all');
  
  const { filteredProjects, stats } = useProjectFilters(
    projectsData, 
    searchTerm, 
    filterCompany, 
    filterStatus, 
    filterCategory,
    filterMunicipality
  );
  
  useEffect(() => {
    if (filteredProjects.length > 0 && !selectedProject) {
      setSelectedProject(filteredProjects[0]);
    } else if (selectedProject && !filteredProjects.some(p => p.id === selectedProject.id)) {
      setSelectedProject(filteredProjects.length > 0 ? filteredProjects[0] : null);
    }
  }, [filteredProjects, selectedProject]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'construction': return 'bg-blue-500';
      case 'approved': return 'bg-purple-500';
      case 'planning': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Ολοκληρωμένο';
      case 'construction': return 'Υπό Κατασκευή';
      case 'approved': return 'Εγκεκριμένο';
      case 'planning': return 'Σχεδιασμός';
      case 'suspended': return 'Αναστολή';
      default: return status;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background p-4 gap-4">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="p-4 space-y-4">
          <ProjectsPageHeader 
            showDashboard={showDashboard}
            setShowDashboard={setShowDashboard}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <ProjectsPageFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCompany={filterCompany}
            setFilterCompany={setFilterCompany}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterMunicipality={filterMunicipality}
            setFilterMunicipality={setFilterMunicipality}
            companies={companies}
            municipalities={municipalities}
          />
        </div>
      </div>
      
      {showDashboard && <ProjectsDashboard stats={stats} />}

      <div className="flex-1 flex overflow-hidden gap-4">
        {viewMode === 'list' && selectedProject ? (
          <>
            <ProjectsList
              projects={filteredProjects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
            <ProjectDetails 
              project={selectedProject} 
            />
          </>
        ) : viewMode === 'grid' && selectedProject ? (
          <div className="flex-1 p-4 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isSelected={selectedProject.id === project.id}
                  onClick={() => setSelectedProject(project)}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
              ))}
            </div>
          </div>
        ) : <div className="flex-1 flex items-center justify-center text-muted-foreground">Επιλέξτε ένα έργο για να δείτε τις λεπτομέρειες.</div>}
      </div>
    </div>
  );
}
