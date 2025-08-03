'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Building, 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Calendar, 
  Home 
} from 'lucide-react';

interface BuildingsDashboardProps {
  stats: {
    totalBuildings: number;
    activeProjects: number;
    totalValue: number;
    totalArea: number;
    averageProgress: number;
    totalUnits: number;
  };
}

export function BuildingsDashboard({ stats }: BuildingsDashboardProps) {
  return (
    <div className="p-4 border-b bg-muted/20">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-400">Σύνολο Κτιρίων</p>
                <p className="text-2xl font-bold text-blue-300">{stats.totalBuildings}</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-400">Ενεργά Έργα</p>
                <p className="text-2xl font-bold text-green-300">{stats.activeProjects}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-400">Συνολική Αξία</p>
                <p className="text-2xl font-bold text-purple-300">
                  €{(stats.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-400">Συνολική Επιφάνεια</p>
                <p className="text-2xl font-bold text-orange-300">
                  {(stats.totalArea / 1000).toFixed(1)}K m²
                </p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-cyan-400">Μέση Πρόοδος</p>
                <p className="text-2xl font-bold text-cyan-300">{stats.averageProgress}%</p>
              </div>
              <Calendar className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-pink-400">Σύνολο Μονάδων</p>
                <p className="text-2xl font-bold text-pink-300">{stats.totalUnits}</p>
              </div>
              <Home className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
