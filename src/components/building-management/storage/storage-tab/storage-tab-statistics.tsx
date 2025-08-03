'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StorageStats } from '@/lib/types/storage';

interface StorageDashboardProps {
  stats: StorageStats;
}

export function StorageDashboard({ stats }: StorageDashboardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Σύνολο</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.byType.storage}</div>
            <div className="text-xs text-muted-foreground">Αποθήκες</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.byType.parking}</div>
            <div className="text-xs text-muted-foreground">Πάρκινγκ</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.byStatus.available}</div>
            <div className="text-xs text-muted-foreground">Διαθέσιμα</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.byStatus.sold}</div>
            <div className="text-xs text-muted-foreground">Πωλήθηκαν</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">€{(stats.totalValue / 1000).toFixed(0)}K</div>
            <div className="text-xs text-muted-foreground">Συνολική Αξία</div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalArea.toFixed(0)}m²</div>
            <div className="text-xs text-muted-foreground">Συνολική Επιφάνεια</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
