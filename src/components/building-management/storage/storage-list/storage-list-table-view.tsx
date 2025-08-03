'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MoreVertical, Link as LinkIcon, Building } from 'lucide-react';
import { StorageUnit, StorageStatus, StorageType } from '@/types/storage';
import { cn } from '@/lib/utils';
import { formatPrice, formatArea, getStatusColor, getStatusLabel, getTypeIcon, getTypeLabel } from './storage-list-utils';

interface StorageListTableViewProps {
  units: StorageUnit[];
  selectedUnits: string[];
  onSelectUnit: (unitId: string) => void;
  onSelectAll: () => void;
  onEdit: (unit: StorageUnit) => void;
  onDelete: (unitId: string) => void;
}

export function StorageListTableView({
  units,
  selectedUnits,
  onSelectUnit,
  onSelectAll,
  onEdit,
  onDelete,
}: StorageListTableViewProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">
                  <Checkbox
                    checked={selectedUnits.length === units.length && units.length > 0}
                    onCheckedChange={onSelectAll}
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
                    <Checkbox
                      checked={selectedUnits.includes(unit.id)}
                      onCheckedChange={() => onSelectUnit(unit.id)}
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
                  <td className="p-4">{formatArea(unit.area)}</td>
                  <td className="p-4">{formatPrice(unit.price)}</td>
                  <td className="p-4">
                    <Badge className={cn("text-xs text-white", getStatusColor(unit.status))}>
                      {getStatusLabel(unit.status)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {unit.linkedProperty ? (
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <LinkIcon className="w-3 h-3" />
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
                          <Eye className="w-4 h-4 mr-2" /> Προβολή
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(unit)}>
                          <Edit className="w-4 h-4 mr-2" /> Επεξεργασία
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(unit.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Διαγραφή
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
  );
}