'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  TrendingUp, 
  CheckCircle, 
  Euro, 
  BarChart3, 
  Building, 
  MapPin, 
  Activity,
  Package,
  Users
} from 'lucide-react';
import type { PropertyStats } from '@/types/property';

interface PropertyDashboardProps {
  stats: PropertyStats;
}

export function PropertyDashboard({ stats }: PropertyDashboardProps) {
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
      case 'sold': return 'bg-green-500';
      case 'available': return 'bg-gray-500';
      case 'reserved': return 'bg-yellow-500';
      case 'owner': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sold': return 'Πουλημένα';
      case 'available': return 'Διαθέσιμα';
      case 'reserved': return 'Κρατημένα';
      case 'owner': return 'Οικοπεδούχου';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'Διαμερίσματα';
      case 'studio': return 'Στούντιο';
      case 'maisonette': return 'Μεζονέτες';
      case 'shop': return 'Καταστήματα';
      case 'office': return 'Γραφεία';
      case 'storage': return 'Αποθήκες';
      default: return type;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Συνολικά Ακίνητα */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Συνολικά Ακίνητα</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalProperties}</div>
          <p className="text-xs text-muted-foreground">Όλα τα ακίνητα</p>
        </CardContent>
      </Card>

      {/* Διαθέσιμα Ακίνητα */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Διαθέσιμα</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{stats.availableProperties}</div>
          <p className="text-xs text-muted-foreground">Προς πώληση</p>
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

      {/* Συνολικό Εμβαδόν */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Συνολικό Εμβαδόν</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(stats.totalArea)} m²
          </div>
          <p className="text-xs text-muted-foreground">Συνολική επιφάνεια</p>
        </CardContent>
      </Card>

      {/* Πουλημένα */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Πουλημένα</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.soldProperties}</div>
          <p className="text-xs text-muted-foreground">Ολοκληρωμένες πωλήσεις</p>
        </CardContent>
      </Card>

      {/* Μέση Τιμή */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Μέση Τιμή</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(stats.averagePrice)}
          </div>
          <p className="text-xs text-muted-foreground">Ανά ακίνητο</p>
        </CardContent>
      </Card>

      {/* Κατάσταση Ακινήτων */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Κατάσταση Ακινήτων</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(stats.propertiesByStatus).map(([status, count]) => (
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

      {/* Τύποι Ακινήτων */}
      {Object.keys(stats.propertiesByType).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Τύποι Ακινήτων</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.propertiesByType).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  {getTypeLabel(type)} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Όροφοι */}
      {Object.keys(stats.propertiesByFloor).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Κατανομή ανά Όροφο</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.propertiesByFloor).slice(0, 5).map(([floor, count]) => (
                <div key={floor} className="flex items-center justify-between">
                  <span className="text-xs truncate flex-1">{floor}</span>
                  <Badge variant="outline" className="ml-2">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Αποθήκες */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Αποθήκες</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-lg font-bold text-primary">{stats.totalStorageUnits}</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Διαθέσιμες:</span>
              <span className="font-medium">{stats.availableStorageUnits}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Πουλημένες:</span>
              <span className="font-medium">{stats.soldStorageUnits}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}