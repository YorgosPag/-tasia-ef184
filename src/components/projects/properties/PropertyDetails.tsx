"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Property, StorageUnit } from '@/types/property';
import { PropertyDetailsHeader } from './details/PropertyDetailsHeader';
import { PropertyGeneralTab } from './details/PropertyGeneralTab';
import { PropertyPhotosTab } from './details/PropertyPhotosTab';
import { PropertyVideosTab } from './details/PropertyVideosTab';
import { PropertyContractsTab } from './details/PropertyContractsTab';
import { PlaceholderTab } from '@/components/common/placeholder-tab';

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0 shadow-sm">
      <PropertyDetailsHeader
        property={property}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <main className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="general" className="flex flex-col h-full">
          <TabsList className="shrink-0 flex-wrap h-auto justify-start mb-4">
            <TabsTrigger value="general">Γενικά</TabsTrigger>
            <TabsTrigger value="details">Κατόψεις Επιπέδων</TabsTrigger>
            <TabsTrigger value="photos">Φωτογραφίες</TabsTrigger>
            <TabsTrigger value="videos">Βίντεο</TabsTrigger>
            <TabsTrigger value="contracts">Συμβόλαια</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="flex-grow overflow-auto space-y-6">
            <PropertyGeneralTab property={property} isEditing={isEditing} />
          </TabsContent>
          
          <TabsContent value="details" className="flex-grow overflow-auto">
            <PlaceholderTab title="Κατόψεις Επιπέδων Πολεοδομίας" />
          </TabsContent>
          
          <TabsContent value="photos" className="flex-grow overflow-auto">
            <PropertyPhotosTab />
          </TabsContent>
          
          <TabsContent value="videos" className="flex-grow overflow-auto">
            <PropertyVideosTab />
          </TabsContent>
          
          <TabsContent value="contracts" className="flex-grow overflow-auto">
            <PropertyContractsTab property={property} isEditing={isEditing} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
