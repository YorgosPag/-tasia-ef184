'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home,
  Clock,
  MapPin,
  TrendingUp,
  Archive,
  FileText,
  Settings,
  Camera,
  Video,
} from 'lucide-react';
import type { Building } from '@/types/building';
import { BuildingHeader } from './BuildingHeader';
import { GeneralTab } from './tabs/GeneralTab';
import { TimelineTab } from './tabs/TimelineTab';
import { MapTab } from './tabs/MapTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { StorageTab } from './tabs/StorageTab';
import { PhotosTab } from './tabs/PhotosTab';
import { VideosTab } from './tabs/VideosTab';
import { PlaceholderTab } from '@/app/projects/placeholder-tab';

interface BuildingDetailsProps {
  building: Building;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingDetails({ building, getStatusColor, getStatusLabel }: BuildingDetailsProps) {
  return (
    <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0 shadow-sm">
      <BuildingHeader building={building} getStatusColor={getStatusColor} getStatusLabel={getStatusLabel} />
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="general" className="h-full">
            <TabsList className="grid w-full grid-cols-9 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Γενικά
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Χάρτης
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Αποθήκες
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Συμβόλαια
              </TabsTrigger>
              <TabsTrigger value="protocols" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Πρωτόκολλα
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Φωτογραφίες
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-0">
              <GeneralTab building={building} />
            </TabsContent>
            <TabsContent value="timeline" className="mt-0">
              <TimelineTab building={building} />
            </TabsContent>
            <TabsContent value="map" className="mt-0">
              <MapTab building={building} />
            </TabsContent>
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsTab building={building} />
            </TabsContent>
            <TabsContent value="storage" className="mt-0">
              <StorageTab building={building} />
            </TabsContent>
            <TabsContent value="contracts" className="mt-0">
              <PlaceholderTab title="Συμβόλαια Πελατών" />
            </TabsContent>
            <TabsContent value="protocols" className="mt-0">
              <PlaceholderTab title="Υ.Δ.Τοιχοποιίας & Πρωτόκολλα" />
            </TabsContent>
            <TabsContent value="photos" className="mt-0">
              <PhotosTab />
            </TabsContent>
            <TabsContent value="videos" className="mt-0">
              <VideosTab />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
