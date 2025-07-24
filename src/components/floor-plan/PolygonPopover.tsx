
'use client';

import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Unit } from './Unit';
import { STATUS_COLOR_MAP, getTextColorForBackground } from './utils';

interface PolygonPopoverProps {
  unit: Unit;
  isEditMode: boolean;
  isLocked: boolean;
  scale: number;
  onUnitClick: (unitId: string) => void;
  onUnitDelete: (unitId: string) => void;
}

export function PolygonPopover({
  unit,
  isEditMode,
  isLocked,
  scale,
  onUnitClick,
  onUnitDelete,
}: PolygonPopoverProps) {
  if (!unit.polygonPoints) return null;

  const polygonColor = STATUS_COLOR_MAP[unit.status] ?? '#6b7280';
  const polygonPointsString = unit.polygonPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <polygon
          points={polygonPointsString}
          style={{
            fill: polygonColor,
            stroke: polygonColor,
            strokeWidth: 2 / scale,
            opacity: 0.4,
            pointerEvents: isEditMode || isLocked ? 'none' : 'auto',
            cursor: isLocked ? 'not-allowed' : 'pointer'
          }}
          className="transition-all hover:opacity-70 hover:stroke-2"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {unit.name} ({unit.identifier})
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Κατάσταση:</span>
              <Badge 
                variant="default"
                style={{ backgroundColor: polygonColor, color: getTextColorForBackground(polygonColor) === 'text-white' ? 'white' : 'black' }}
              >
                {unit.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUnitClick(unit.id)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Επεξεργασία
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Διαγραφή
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                  <AlertDialogDescription>
                    Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί
                    οριστικά το ακίνητο "{unit.name} ({unit.identifier})".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onUnitDelete(unit.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Διαγραφή
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
