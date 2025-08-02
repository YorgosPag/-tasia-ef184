'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralProjectTab } from './general-project-tab';
import { BuildingDataTab } from './BuildingDataTab';
import { ParkingTab } from './parking/ParkingTab';
import { ContributorsTab } from './contributors-tab';
import { DocumentsProjectTab } from './documents-project-tab';
import { IkaTab } from './ika-tab';
import { parkingSpots } from './parking/data';
import { PhotosTab } from './PhotosTab';
import { VideosTab } from './VideosTab';


type Project = {
    id: number;
    name: string;
};

interface ProjectDetailsProps {
    project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
    return (
        <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0">
            <div className="p-2 border-b bg-background flex items-center gap-2 rounded-t-lg">
                <h3 className="text-sm font-semibold">{project.name}</h3>
            </div>
            <main className="flex-1 overflow-auto p-4">
                <div className="flex flex-col h-full">
                    <Tabs defaultValue="general" className="flex flex-col h-full">
                        <TabsList className="shrink-0 flex-wrap h-auto justify-start">
                            <TabsTrigger value="general">Γενικά Έργου</TabsTrigger>
                            <TabsTrigger value="building-data">Στοιχεία Δόμησης</TabsTrigger>
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
