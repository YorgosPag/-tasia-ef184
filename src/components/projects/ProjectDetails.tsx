'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, 
  MapPin, 
  Calendar, 
  Euro, 
  Users, 
  FileText, 
  Globe,
  Edit,
  Share,
  Star
} from 'lucide-react';
import { GeneralProjectTab } from './general-project-tab';
import { BuildingDataTab } from './BuildingDataTab';
import { ParkingTab } from './parking/ParkingTab';
import { PropertiesTab } from './properties/PropertiesTab';
import { ContributorsTab } from './contributors-tab';
import { DocumentsProjectTab } from './documents-project-tab';
import { IkaTab } from './ika-tab';
import { PhotosTab } from './PhotosTab';
import { VideosTab } from './VideosTab';
import { parkingSpots } from './parking/data';
import type { Project } from '@/types/project';

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR');
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
      case 'completed': return 'Ολοκληρωμένο';
      case 'construction': return 'Υπό Κατασκευή';
      case 'approved': return 'Εγκεκριμένο';
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
    <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-background/50 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
              <Badge variant="outline">
                {getStatusLabel(project.status)}
              </Badge>
              <Badge variant="secondary">
                {getCategoryLabel(project.category)}
              </Badge>
              {project.showOnWeb && (
                <Badge variant="outline" className="text-blue-600">
                  <Globe className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              )}
            </div>
            
            <h2 className="text-lg font-semibold truncate">{project.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{project.title}</p>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{project.address}, {project.municipality}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Αγαπημένο
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Κοινοποίηση
            </Button>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Επεξεργασία
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium">{project.buildingCount}</div>
                <div className="text-xs text-muted-foreground">Κτίρια</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-medium">{project.unitCount}</div>
                <div className="text-xs text-muted-foreground">Μονάδες</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-sm font-medium">{project.totalArea.toLocaleString()} m²</div>
                <div className="text-xs text-muted-foreground">Εμβαδόν</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Euro className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-medium">{formatCurrency(project.totalValue)}</div>
                <div className="text-xs text-muted-foreground">Αξία</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Πρόοδος</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-1.5" />
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="flex flex-col h-full">
          <Tabs defaultValue="general" className="flex flex-col h-full">
            <TabsList className="shrink-0 flex-wrap h-auto justify-start">
              <TabsTrigger value="general">Γενικά Έργου</TabsTrigger>
              <TabsTrigger value="building-data">Στοιχεία Δόμησης</TabsTrigger>
              <TabsTrigger value="properties">Ακίνητα</TabsTrigger>
              <TabsTrigger value="parking">Θέσεις Στάθμευσης</TabsTrigger>
              <TabsTrigger value="contributors">Συντελεστές</TabsTrigger>
              <TabsTrigger value="documents">Έγγραφα Έργου</TabsTrigger>
              <TabsTrigger value="ika">IKA</TabsTrigger>
              <TabsTrigger value="photos">Φωτογραφίες</TabsTrigger>
              <TabsTrigger value="videos">Βίντεο</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="flex-grow overflow-auto mt-4">
              <GeneralProjectTab />
            </TabsContent>
            <TabsContent value="building-data" className="flex-grow overflow-auto mt-4">
              <BuildingDataTab />
            </TabsContent>
            <TabsContent value="properties" className="flex-grow overflow-auto mt-4">
              <PropertiesTab />
            </TabsContent>
            <TabsContent value="parking" className="flex-grow overflow-auto mt-4">
              <ParkingTab parkingSpots={parkingSpots} />
            </TabsContent>
            <TabsContent value="contributors" className="flex-grow overflow-auto mt-4">
              <ContributorsTab />
            </TabsContent>
            <TabsContent value="documents" className="flex-grow overflow-auto mt-4">
              <DocumentsProjectTab />
            </TabsContent>
            <TabsContent value="ika" className="flex-grow overflow-auto mt-4">
              <IkaTab />
            </TabsContent>
            <TabsContent value="photos" className="flex-grow overflow-auto mt-4">
              <PhotosTab />
            </TabsContent>
            <TabsContent value="videos" className="flex-grow overflow-auto mt-4">
              <VideosTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}