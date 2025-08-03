'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, 
  TrendingUp, 
  CheckCircle, 
  Euro, 
  BarChart3, 
  Building, 
  MapPin, 
  Calendar,
  Activity
} from 'lucide-react';
import type { ProjectStats } from '@/types/project';

interface ProjectsDashboardProps {
  stats: ProjectStats;
}

export function ProjectsDashboard({ stats }: ProjectsDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'construction': return 'bg-blue-500';
      case 'approved': return 'bg-purple-500';
      case 'planning': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Ολοκληρωμένα';
      case 'construction': return 'Υπό Κατασκευή';
      case 'approved': return 'Εγκεκριμένα';
      case 'planning': return 'Σχεδιασμός';
      case 'suspended': return 'Αναστολή';
      default: return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'residential': return 'Κατοικίες';
      case 'commercial': return 'Εμπορικά';
      case 'mixed': return 'Μικτή Χρήση';
      case 'industrial': return 'Βιομηχανικά';
      case 'public': return 'Δημόσια';
      default: return category;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Συνολικά Έργα */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Συνολικά Έργα</CardTitle>
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalProjects}</div>
          <p className="text-xs text-muted-foreground">Όλα τα έργα</p>
        </CardContent>
      </Card>

      {/* Ενεργά Έργα */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ενεργά Έργα</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.activeProjects}</div>
          <p className="text-xs text-muted-foreground">Υπό κατασκευή</p>
        </CardContent>
      </Card>

      {/* Συνολική Αξία */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Συνολική Αξία</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.totalValue)}
          </div>
          <p className="text-xs text-muted-foreground">Συνολικό κόστος</p>
        </CardContent>
      </Card>

      {/* Μέση Πρόοδος */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Μέση Πρόοδος</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(stats.averageProgress)}%
          </div>
          <Progress value={stats.averageProgress} className="mt-2 h-2" />
        </CardContent>
      </Card>

      {/* Ολοκληρωμένα */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ολοκληρωμένα</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
          <p className="text-xs text-muted-foreground">Τελειωμένα έργα</p>
        </CardContent>
      </Card>

      {/* Κατάσταση Έργων */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Κατάσταση Έργων</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(stats.projectsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                  <span className="text-xs">{getStatusLabel(status)}</span>
                </div>
                <span className="text-xs font-medium">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Κατηγορίες - Full width on medium screens and up */}
      {Object.keys(stats.projectsByCategory).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Κατηγορίες Έργων</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.projectsByCategory).map(([category, count]) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {getCategoryLabel(category)} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Εταιρείες - Full width on medium screens and up */}
      {Object.keys(stats.projectsByCompany).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Έργα ανά Εταιρεία</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.projectsByCompany).slice(0, 5).map(([company, count]) => (
                <div key={company} className="flex items-center justify-between">
                  <span className="text-xs truncate flex-1">{company}</span>
                  <Badge variant="outline" className="ml-2">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}