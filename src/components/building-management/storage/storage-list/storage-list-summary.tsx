'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StorageUnit } from '@/types/storage';
import { formatPrice, formatArea } from './storage-list-utils';

interface StorageListSummaryProps {
  units: StorageUnit[];
}

export function StorageListSummary({ units }: StorageListSummaryProps) {
  const stats = React.useMemo(() => {
    if (units.length === 0) {
      return { available: 0, totalValue: 0, totalArea: 0, avgPricePerSqm: 0 };
    }
    const available = units.filter((u) => u.status === 'available').length;
    const totalValue = units.reduce((sum, u) => sum + u.price, 0);
    const totalArea = units.reduce((sum, u) => sum + u.area, 0);
    const avgPricePerSqm = totalArea > 0 ? totalValue / totalArea : 0;
    return { available, totalValue, totalArea, avgPricePerSqm };
  }, [units]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {stats.available}
            </div>
            <div className="text-gray-500">Διαθέσιμα</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {formatPrice(stats.totalValue)}
            </div>
            <div className="text-gray-500">Συνολική Αξία</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {formatArea(stats.totalArea)}
            </div>
            <div className="text-gray-500">Συνολική Επιφάνεια</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">
              {formatPrice(stats.avgPricePerSqm)}
            </div>
            <div className="text-gray-500">Μέσος όρος €/m²</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}