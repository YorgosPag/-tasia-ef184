'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Building, MapPin, Briefcase, Activity } from 'lucide-react';
import type { Company } from '@/types/project';

interface ProjectsPageFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCompany: string;
  setFilterCompany: (company: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterMunicipality: string;
  setFilterMunicipality: (municipality: string) => void;
  companies: Company[];
  municipalities: { id: string; name: string; }[];
}

export function ProjectsPageFilters({
  searchTerm,
  setSearchTerm,
  filterCompany,
  setFilterCompany,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filterMunicipality,
  setFilterMunicipality,
  companies,
  municipalities,
}: ProjectsPageFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
      <div className="lg:col-span-2 space-y-2">
        <Label htmlFor="search" className="text-xs font-medium flex items-center gap-1">
          <Search className="w-3 h-3" />
          Αναζήτηση
        </Label>
        <Input
          id="search"
          placeholder="Αναζήτηση έργων, διευθύνσεων, περιγραφών..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-filter" className="text-xs font-medium flex items-center gap-1">
          <Building className="w-3 h-3" />
          Εταιρεία
        </Label>
        <Select value={filterCompany} onValueChange={setFilterCompany}>
          <SelectTrigger id="company-filter" className="h-9">
            <SelectValue placeholder="Όλες οι εταιρείες" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες οι εταιρείες</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status-filter" className="text-xs font-medium flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Κατάσταση
        </Label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger id="status-filter" className="h-9">
            <SelectValue placeholder="Όλες οι καταστάσεις" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες οι καταστάσεις</SelectItem>
            <SelectItem value="planning">Σχεδιασμός</SelectItem>
            <SelectItem value="approved">Εγκεκριμένα</SelectItem>
            <SelectItem value="construction">Υπό Κατασκευή</SelectItem>
            <SelectItem value="completed">Ολοκληρωμένα</SelectItem>
            <SelectItem value="suspended">Αναστολή</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-filter" className="text-xs font-medium flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          Κατηγορία
        </Label>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger id="category-filter" className="h-9">
            <SelectValue placeholder="Όλες οι κατηγορίες" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλες οι κατηγορίες</SelectItem>
            <SelectItem value="residential">Κατοικίες</SelectItem>
            <SelectItem value="commercial">Εμπορικά</SelectItem>
            <SelectItem value="mixed">Μικτή Χρήση</SelectItem>
            <SelectItem value="industrial">Βιομηχανικά</SelectItem>
            <SelectItem value="public">Δημόσια</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="municipality-filter" className="text-xs font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Δήμος
        </Label>
        <Select value={filterMunicipality} onValueChange={setFilterMunicipality}>
          <SelectTrigger id="municipality-filter" className="h-9">
            <SelectValue placeholder="Όλοι οι δήμοι" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι οι δήμοι</SelectItem>
            {municipalities.map(m => (
              <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
