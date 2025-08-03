'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Home, MapPin, Activity, Building2, Filter } from 'lucide-react';

interface PropertyPageFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterFloor: string;
  setFilterFloor: (floor: string) => void;
  filterBuilding: string;
  setFilterBuilding: (building: string) => void;
}

export function PropertyPageFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  filterFloor,
  setFilterFloor,
  filterBuilding,
  setFilterBuilding
}: PropertyPageFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
      <div className="lg:col-span-2 space-y-2">
        <Label htmlFor="search" className="text-xs font-medium flex items-center gap-1">
          <Search className="w-3 h-3" />
          Αναζήτηση
        </Label>
        <Input
          id="search"
          placeholder="Αναζήτηση κωδικού, αγοραστή, περιγραφής..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type-filter" className="text-xs font-medium flex items-center gap-1">
          <Home className="w-3 h-3" />
          Τύπος
        </Label>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger id="type-filter" className="h-9">
            <SelectValue placeholder="Όλοι οι τύποι" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι οι τύποι</SelectItem>
            <SelectItem value="apartment">Διαμέρισμα</SelectItem>
            <SelectItem value="studio">Στούντιο</SelectItem>
            <SelectItem value="maisonette">Μεζονέτα</SelectItem>
            <SelectItem value="shop">Κατάστημα</SelectItem>
            <SelectItem value="office">Γραφείο</SelectItem>
            <SelectItem value="storage">Αποθήκη</SelectItem>
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
            <SelectItem value="available">Διαθέσιμο</SelectItem>
            <SelectItem value="sold">Πουλημένο</SelectItem>
            <SelectItem value="reserved">Κρατημένο</SelectItem>
            <SelectItem value="owner">Οικοπεδούχου</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="floor-filter" className="text-xs font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          Όροφος
        </Label>
        <Select value={filterFloor} onValueChange={setFilterFloor}>
          <SelectTrigger id="floor-filter" className="h-9">
            <SelectValue placeholder="Όλοι οι όροφοι" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλοι οι όροφοι</SelectItem>
            <SelectItem value="Υπόγειο">Υπόγειο</SelectItem>
            <SelectItem value="Ισόγειο">Ισόγειο</SelectItem>
            <SelectItem value="1ος Όροφος">1ος Όροφος</SelectItem>
            <SelectItem value="2ος Όροφος">2ος Όροφος</SelectItem>
            <SelectItem value="3ος Όροφος">3ος Όροφος</SelectItem>
            <SelectItem value="4ος Όροφος">4ος Όροφος</SelectItem>
            <SelectItem value="5ος Όροφος">5ος Όροφος</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="building-filter" className="text-xs font-medium flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          Κτίριο
        </Label>
        <Select value={filterBuilding} onValueChange={setFilterBuilding}>
          <SelectTrigger id="building-filter" className="h-9">
            <SelectValue placeholder="Όλα τα κτίρια" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλα τα κτίρια</SelectItem>
            <SelectItem value="A">Κτίριο A</SelectItem>
            <SelectItem value="B">Κτίριο B</SelectItem>
            <SelectItem value="C">Κτίριο C</SelectItem>
            <SelectItem value="D">Κτίριο D</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}