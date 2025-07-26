
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { STATUS_COLOR_MAP, ALL_STATUSES } from './utils';
import type { Unit } from './Unit';

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
      <CardContent className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 p-2">
        <h4 className="whitespace-nowrap text-sm font-medium leading-none">
          Εμφάνιση Layers:
        </h4>
        {ALL_STATUSES.map((status) => (
          <div key={status} className="flex items-center space-x-2">
            <Checkbox
              id={`status-${status}`}
              checked={statusVisibility[status] ?? true}
              onCheckedChange={(checked) =>
                onVisibilityChange(status, checked as boolean)
              }
              style={{ borderColor: STATUS_COLOR_MAP[status] }}
              className="data-[state=checked]:bg-transparent"
            />
            <Label
              htmlFor={`status-${status}`}
              className="text-sm font-medium"
            >
              {status}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
