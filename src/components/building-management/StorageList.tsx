'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StorageCard } from './storage/storage-card';
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Link,
  MapPin,
  Ruler,
  Euro,
  Building,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StorageUnit, StorageType, StorageStatus } from '@/types/storage';
import { cn } from '@/lib/utils';

interface StorageListProps {
  units: StorageUnit[];
  onEdit: (unit: StorageUnit) => void;
  onDelete: (unitId: string) => void;
  getStatusColor: (status: StorageStatus) => string;
  getStatusLabel: (status: StorageStatus) => string;
  getTypeIcon: (type: StorageType) => React.ReactNode;
  getTypeLabel: (type: StorageType) => string;
}

export function StorageList({ 
  units, 
  onEdit, 
  onDelete,
  getStatusColor,
  getStatusLabel,
  getTypeIcon,
  getTypeLabel
}: StorageListProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (area: number) => {
    return `${area.toFixed(2)} m²`;
  };

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUnits.length === units.length) {
      setSelectedUnits([]);
    } else {
      setSelectedUnits(units.map(u => u.id));
    }
  };

  const handleBulkDelete = () => {
    selectedUnits.forEach(unitId => onDelete(unitId));
    setSelectedUnits([]);
  };

  if (units.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Δεν βρέθηκαν αποθήκες
          </h3>
          <p className="text-gray-500">
            Δεν υπάρχουν αποθήκες ή θέσεις στάθμευσης που να ταιριάζουν με τα κριτήρια αναζήτησης.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* List Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {units.length} αποτελέσματα
          </span>
          {selectedUnits.length > 0 && (
            <>
              <span className="text-sm text-blue-600">
                • {selectedUnits.length} επιλεγμένα
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Διαγραφή επιλεγμένων
              </Button>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            🃏 Κάρτες
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            📊 Πίνακας
          </Button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {units.map((unit) => (
            <StorageCard
              key={unit.id}
              unit={unit}
              isSelected={selectedUnits.includes(unit.id)}
              onSelect={() => handleSelectUnit(unit.id)}
              onEdit={() => onEdit(unit)}
              onDelete={() => onDelete(unit.id)}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedUnits.length === units.length}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900">Κωδικός</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900">Τύπος</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900">Όροφος</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900">Επιφάνεια</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900">Τιμή</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900">Κατάσταση</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900">Συνδεδεμένο</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-900">Ενέργειες</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {units.map((unit) => (
                    <tr 
                      key={unit.id} 
                      className={cn(
                        "hover:bg-gray-50 transition-colors",
                        selectedUnits.includes(unit.id) && "bg-blue-50"
                      )}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUnits.includes(unit.id)}
                          onChange={() => handleSelectUnit(unit.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{unit.code}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {unit.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(unit.type)}
                          <span className="text-sm">{getTypeLabel(unit.type)}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Building className="w-3 h-3 text-gray-400" />
                          {unit.floor}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Ruler className="w-3 h-3 text-gray-400" />
                          {formatArea(unit.area)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Euro className="w-3 h-3 text-gray-400" />
                          {formatPrice(unit.price)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={cn(
                            "text-xs text-white",
                            getStatusColor(unit.status)
                          )}
                        >
                          {getStatusLabel(unit.status)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {unit.linkedProperty ? (
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <Link className="w-3 h-3" />
                            {unit.linkedProperty}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(unit)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Προβολή
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(unit)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Επεξεργασία
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onDelete(unit.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Διαγραφή
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {units.filter(u => u.status === 'available').length}
              </div>
              <div className="text-gray-500">Διαθέσιμα</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {formatPrice(units.reduce((sum, u) => sum + u.price, 0))}
              </div>
              <div className="text-gray-500">Συνολική Αξία</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {formatArea(units.reduce((sum, u) => sum + u.area, 0))}
              </div>
              <div className="text-gray-500">Συνολική Επιφάνεια</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {formatPrice(units.reduce((sum, u) => sum + u.price, 0) / units.reduce((sum, u) => sum + u.area, 0))}
              </div>
              <div className="text-gray-500">Μέσος όρος €/m²</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
