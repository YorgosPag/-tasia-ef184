
'use client';

import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ZoomIn, Unlock } from 'lucide-react';

interface InfoPanelProps {
  isEditMode: boolean;
  isLocked: boolean;
  isPrecisionZooming: boolean;
}

export function InfoPanel({
  isEditMode,
  isLocked,
  isPrecisionZooming,
}: InfoPanelProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex h-full items-center justify-center p-2 text-center">
        {isPrecisionZooming ? (
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700">
            <ZoomIn size={16} />
            Λειτουργία Ακρίβειας{' '}
            <span className="text-xs text-blue-700/80">(Αφήστε το Shift)</span>
          </p>
        ) : isLocked ? (
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-yellow-700">
            Κλειδωμένη <Unlock size={12} className="inline-block" />
          </p>
        ) : isEditMode ? (
          <p className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
            Λειτουργία Σχεδίασης{' '}
            <span className="text-xs text-primary/80">
              (Esc για ακύρωση, Ctrl+Z για αναίρεση)
            </span>
          </p>
        ) : (
          <p className="text-sm font-medium text-secondary-foreground">
            Λειτουργία Επεξεργασίας: Σύρετε τα σημεία για να αλλάξετε το σχήμα.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
