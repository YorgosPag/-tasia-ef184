
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Unit } from './FloorPlanViewer';
import { ALL_STATUSES, getStatusColor } from './utils';

interface StatusFilterProps {
  statusVisibility: Record<Unit['status'], boolean>;
  onVisibilityChange: (status: Unit['status'], checked: boolean) => void;
}

export function StatusFilter({
  statusVisibility,
  onVisibilityChange,
}: StatusFilterProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex h-full items-center p-2">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <h4 className="whitespace-nowrap text-sm font-medium leading-none">
            Εμφάνιση Layers:
          </h4>
          {ALL_STATUSES.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={statusVisibility[status]}
                onCheckedChange={(checked) =>
                  onVisibilityChange(status, checked as boolean)
                }
                className="data-[state=checked]:bg-transparent"
                style={{
                  borderColor: getStatusColor(status),
                  color: getStatusColor(status),
                }}
              />
              <Label htmlFor={`status-${status}`} className="text-sm font-medium">
                {status}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
