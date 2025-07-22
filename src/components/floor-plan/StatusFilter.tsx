
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Unit } from './FloorPlanViewer';
import { ALL_STATUSES } from './utils';

/**
 * StatusFilter
 * UI filter for showing or hiding units based on their status (layer).
 * This is a dumb component that receives its state and callbacks from a parent.
 */
interface StatusFilterProps {
  statusVisibility: Record<Unit['status'], boolean>;
  onVisibilityChange: (status: Unit['status'], checked: boolean) => void;
  statusColors: Record<Unit['status'], string>;
  onColorChange: (status: Unit['status'], color: string) => void;
}

export function StatusFilter({
  statusVisibility,
  onVisibilityChange,
  statusColors,
  onColorChange,
}: StatusFilterProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex h-full items-center p-2">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <h4 className="whitespace-nowrap text-sm font-medium leading-none">
            Εμφάνιση Layers:
          </h4>
          {ALL_STATUSES.map((status) => {
            const color = statusColors[status] ?? '#6b7280';
            return (
              <div key={status} className="flex items-center space-x-2">
                 <input
                  type="color"
                  value={color}
                  onChange={(e) => onColorChange(status, e.target.value)}
                  className="h-5 w-6 cursor-pointer rounded border-none bg-transparent p-0"
                />
                <Checkbox
                  id={`status-${status}`}
                  checked={statusVisibility[status] ?? true}
                  onCheckedChange={(checked) =>
                    onVisibilityChange(status, checked as boolean)
                  }
                  className="data-[state=checked]:bg-transparent"
                  style={{
                    borderColor: color,
                    color: color,
                  }}
                />
                <Label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium"
                >
                  {status}
                </Label>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
