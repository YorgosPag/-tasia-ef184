'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Search, Filter } from 'lucide-react';

interface BuildingsPageFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCompany: string;
  setFilterCompany: (value: string) => void;
  filterProject: string;
  setFilterProject: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  companies: { id: string; name: string }[];
  projects: { id: string; name: string }[];
}

export function BuildingsPageFilters({
  searchTerm,
  setSearchTerm,
  filterCompany,
  setFilterCompany,
  filterProject,
  setFilterProject,
  filterStatus,
  setFilterStatus,
  companies,
  projects
}: BuildingsPageFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Αναζήτηση κτιρίων, διευθύνσεων, περιγραφών..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="all">Όλες οι εταιρείες</option>
          {companies.map(company => (
            <option key={company.id} value={company.name}>{company.name}</option>
          ))}
        </select>
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="all">Όλα τα έργα</option>
          {projects.map(project => (
            <option key={project.id} value={project.name}>{project.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="all">Όλες οι καταστάσεις</option>
          <option value="active">Ενεργά</option>
          <option value="construction">Υπό Κατασκευή</option>
          <option value="planned">Σχεδιασμένα</option>
          <option value="completed">Ολοκληρωμένα</option>
        </select>
      </div>
    </div>
  );
}
