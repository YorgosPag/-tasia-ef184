# Project Management Components Code

This file contains the source code for all components related to the application's project management functionality.

---
## Required Files and Dependencies

### Core Component Files:
- **`src/app/projects/projects-page-content.tsx`**: The main container for the projects page.
- **`src/app/projects/projects-list.tsx`**: The list view of all projects.
- **`src/app/projects/project-details.tsx`**: The detailed view of a selected project.
- **`src/app/projects/general-project-tab.tsx`**: Tab for general project information.
- **`src/app/projects/BuildingDataTab.tsx`**: Tab for building data specifics.
- **`src/app/projects/parking/ParkingTab.tsx`**: Tab for managing parking spots.
- **`src/app/projects/contributors-tab.tsx`**: Tab for project contributors.
- **`src/app/projects/documents-project-tab.tsx`**: Tab for project documents.
- **`src/app/projects/ika-tab.tsx`**: Tab for IKA related information.
- **`src/app/projects/PhotosTab.tsx`**: Tab for project photos.
- **`src/app/projects/VideosTab.tsx`**: Tab for project videos.

### Related Helper & UI Components:
- **`src/components/app/page-layout.tsx`**: Main layout structure.
- **`src/components/ui/button.tsx`**: Custom button component.
- **`src/components/ui/table.tsx`**: Component for data tables.
- **`src/components/ui/tooltip.tsx`**: Component for tooltips.
- **`src/components/ui/select.tsx`**: Component for select dropdowns.
- **`src/components/ui/label.tsx`**: Component for form labels.
- **`src/components/ui/scroll-area.tsx`**: Component for scrollable areas.
- **`src/components/ui/tabs.tsx`**: Component for tabbed navigation.
- **`src/lib/utils.ts`**: Utility functions (e.g., `cn` for classnames).

---

## src/app/projects/projects-page-content.tsx

```tsx
'use client';

import React, { useState } from 'react';
import { ProjectsList } from './projects-list';
import { ProjectDetails } from './project-details';
import { PageLayout } from '@/components/app/page-layout';

const projects = [
  { id: 1, name: "3. ΕΥΤΕΡΠΗΣ" },
  { id: 2, name: "Καληαρού & Κομνηνών" },
];


export function ProjectsPageContent() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <PageLayout>
        <ProjectsList
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
        />
        <ProjectDetails project={selectedProject} />
    </PageLayout>
  )
}
```

---

## src/app/projects/projects-list.tsx

```tsx
'use client';

import React from 'react';
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Minus, Plus, Save, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

function ToolbarButton({ tooltip, children, onClick, className }: { tooltip: string, children: React.ReactNode, onClick?: () => void, className?: string }) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("h-7 w-7", className)} onClick={onClick}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
}

const ProjectsToolbar = () => {
    return (
        <TooltipProvider>
            <div className="p-1.5 border-b flex items-center gap-1">
                <ToolbarButton tooltip="Νέα Εγγραφή" className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
                    <Plus className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Διαγραφή" className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                    <Minus className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Αποθήκευση">
                    <Save className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton tooltip="Βοήθεια">
                    <HelpCircle className="w-4 h-4" />
                </ToolbarButton>
            </div>
        </TooltipProvider>
    );
}


type Project = {
    id: number;
    name: string;
};

interface ProjectsListProps {
    projects: Project[];
    selectedProject: Project;
    onSelectProject?: (project: Project) => void;
}

export function ProjectsList({ projects, selectedProject, onSelectProject }: ProjectsListProps) {
    return (
        <div className="w-[350px] bg-card border rounded-lg flex flex-col shrink-0">
            <div className="p-2 border-b space-y-2">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <h3 className="text-sm font-semibold">Έργα</h3>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="company-filter" className="text-xs">Εταιρεία</Label>
                    <Select defaultValue="pagonis-nest">
                        <SelectTrigger id="company-filter" className="h-8 text-xs">
                            <SelectValue placeholder="Επιλογή Εταιρείας" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pagonis-nest">ΠΑΓΩΝΗΣ ΝΕΣΤ. ΓΕΩΡΓΙΟΣ</SelectItem>
                            {/* Add other companies here */}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <ProjectsToolbar />
            <ScrollArea className="flex-1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-2">Τίτλος</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow 
                                key={project.id} 
                                className={cn("cursor-pointer", selectedProject.id === project.id ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent")}
                                onClick={() => onSelectProject?.(project)}
                            >
                                <TableCell className="font-medium py-1.5 px-2 text-xs">{project.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}
```

---

## src/app/projects/project-details.tsx

```tsx
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
```

---

## src/app/projects/general-project-tab.tsx

```tsx
'use client';

import React from 'react';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Folder, Eye, MapPin, Building, FileText, Settings } from "lucide-react"
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function GeneralProjectTab() {
  return (
    <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic-info">Βασικές Πληροφορίες</TabsTrigger>
            <TabsTrigger value="location">Τοποθεσία</TabsTrigger>
            <TabsTrigger value="permits">Άδειες & Κατάσταση</TabsTrigger>
            <TabsTrigger value="attachments">Συνημμένα Αρχεία</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="pt-4">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Βασικές Πληροφορίες Έργου</CardTitle>
                    </div>
                    <CardDescription>
                        Γενικά στοιχεία και περιγραφή του έργου
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Τίτλος Έργου</Label>
                            <Input defaultValue="3. ΕΥΤΕΡΠΗΣ" className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Τίτλος Άδειας</Label>
                            <Input defaultValue="Τρεις πενταώροφες οικοδομές με καταστήματα πιλοτή & υπόγειο" className="h-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Περιγραφή Έργου</Label>
                        <Textarea
                            rows={4}
                            className="resize-none"
                            defaultValue="Πρόκειται για ένα συγκρότημα τριών πενταόροφων κτιρίων, που βρίσκεται στο όριο του Ευόσμου με τη Νέα Επέκτασή του. Το κτιριολογικό πρόγραμμα περιλαμβάνει συνδυασμό κεντρικής χρήσης με χρήση κατοικίας. Το Συγκρότημα έχει διάταξη Π δημιουργώντας, έτσι, μια αίθρια εσωτερική αυλή που συνδέεται άμεσα με το δημόσιο χώρο της οδού Ευτέρπης. Ο χώρος αυτός διακρίνεται για τον άρτιο σχεδιασμό του και ευνοεί την προσέγγιση των καταστημάτων, που βρίσκονται στη στάθμη του ισογείου, από τους πεζούς."
                        />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="location" className="pt-4">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Τοποθεσία</CardTitle>
                    </div>
                    <CardDescription>
                        Στοιχεία τοποθεσίας και διεύθυνσης του έργου
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Νομός</Label>
                            <Select defaultValue="thessaloniki">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thessaloniki">Θεσσαλονίκης</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Πόλη/Δήμος</Label>
                            <Select defaultValue="thessaloniki">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thessaloniki">Θεσσαλονίκη</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Δήμος/Δ. Διαμέρ.</Label>
                            <Select defaultValue="evosmou">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="evosmou">Δήμος Ευόσμου</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-3 space-y-2">
                            <Label className="text-sm font-medium">Διεύθυνση</Label>
                            <div className="flex gap-2">
                                <Input defaultValue="Ευτέρπης 32 - 34" className="h-10" />
                                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                    <Globe className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Ταχυδρομικός Κώδικας</Label>
                            <Input defaultValue="562 24" className="h-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="permits" className="pt-4">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Άδειες & Κατάσταση</CardTitle>
                    </div>
                    <CardDescription>
                        Στοιχεία αδειών και τρέχουσα κατάσταση του έργου
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Οικοδομικό Τετράγωνο</Label>
                            <Input defaultValue="10" className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Αρ. Πρωτοκόλλου</Label>
                            <Input placeholder="Εισάγετε αριθμό..." className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Αριθμός Άδειας</Label>
                            <Input defaultValue="5142/24-10-2001" className="h-10 text-primary font-medium" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Αρχή Έκδοσης</Label>
                            <Input placeholder="Εισάγετε αρχή..." className="h-10" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Κατάσταση Έργου</Label>
                            <Select defaultValue="constructed">
                                <SelectTrigger className="h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="constructed">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                Κατασκευασμένα
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Επιλογές</Label>
                            <div className="flex items-center space-x-2 h-10">
                                <Checkbox id="show-on-web" />
                                <Label htmlFor="show-on-web" className="text-sm">Προβολή στο διαδίκτυο</Label>
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <Button variant="outline" className="h-10">
                                <Settings className="w-4 h-4 mr-2" />
                                Επιλογή Έργου
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="attachments" className="pt-4">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Folder className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Συνημμένα Αρχεία</CardTitle>
                    </div>
                    <CardDescription>
                        Αρχεία και έγγραφα που σχετίζονται με το έργο
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Χάρτης Περιοχής Έργου</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                defaultValue="\\\\Server\\shared\\6. erga\\Eterpis_Gen\\Eterp_Gen_Images\\Eterp_Xartis.jpg"
                                className="h-10 bg-muted/30"
                            />
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Folder className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Γενική Κάτοψη Έργου</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                defaultValue="\\\\Server\\shared\\6. erga\\TEST\\SSSSSS.pdf"
                                className="h-10 bg-muted/30"
                            />
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Folder className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Πίνακας Ποσοστών</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                readOnly
                                defaultValue="\\\\Server\\shared\\6. erga\\TEST\\SSSSSSSS.xls"
                                className="h-10 bg-muted/30"
                            />
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Folder className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}
```

---

## src/app/projects/BuildingDataTab.tsx

```tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralPlotDataTab, type PlotData } from './GeneralPlotDataTab';
import { AllowedBuildingDataTab, type AllowedDataInput, type AllowedDataCalculated } from './AllowedBuildingDataTab';
import { ActualBuildingDataTab, type ActualData, type CalculatedActualData } from './ActualBuildingDataTab';
import { OtherDataTab } from './OtherDataTab';
import { Button } from '@/components/ui/button';
import { Save, Pencil, X } from 'lucide-react';

export function BuildingDataTab() {
  const [isEditing, setIsEditing] = useState(false);

  const [plotData, setPlotData] = useState<PlotData>({
    sdNoSocial: 1.8,
    socialFactor: 1.0,
    plotArea: 2178.90,
  });

  const [allowedDataInput, setAllowedDataInput] = useState<AllowedDataInput>({
    maxCoveragePercentage: 70,
    maxSemiOutdoorPercentage: 15,
    maxBalconyPercentage: 40,
    maxCombinedPercentage: 40,
    maxVolumeCoefficient: 5.5,
    maxAllowedHeight: 17.5,
  });

  const [actualData, setActualData] = useState<ActualData>({
    construction: 3922.02,
    plotCoverage: 1478.9,
    semiOutdoorArea: 245.89,
    balconyArea: 456.89,
    height: 17.5,
  });

  const handlePlotDataChange = useCallback((newData: Partial<PlotData>) => {
    setPlotData(prev => ({ ...prev, ...newData }));
  }, []);

  const handleAllowedDataChange = useCallback((newData: Partial<AllowedDataInput>) => {
    setAllowedDataInput(prev => ({ ...prev, ...newData }));
  }, []);
  
  const handleActualDataChange = useCallback((newData: Partial<ActualData>) => {
    setActualData(prev => ({...prev, ...newData}));
  }, []);

  const sdFinal = useMemo(() => {
    return plotData.sdNoSocial * plotData.socialFactor;
  }, [plotData.sdNoSocial, plotData.socialFactor]);

  const calculatedAllowedData = useMemo<AllowedDataCalculated>(() => {
    const maxAllowedConstruction = sdFinal * plotData.plotArea;
    const maxPlotCoverage = (allowedDataInput.maxCoveragePercentage / 100) * plotData.plotArea;
    const maxAllowedSemiOutdoorArea = (allowedDataInput.maxSemiOutdoorPercentage / 100) * maxAllowedConstruction;
    const maxBalconyArea = (allowedDataInput.maxBalconyPercentage / 100) * maxAllowedConstruction;
    const maxCombinedArea = (allowedDataInput.maxCombinedPercentage / 100) * maxAllowedConstruction;
    const maxVolumeExploitation = plotData.plotArea * allowedDataInput.maxVolumeCoefficient;
    return {
      maxAllowedConstruction,
      maxPlotCoverage,
      maxAllowedSemiOutdoorArea,
      maxBalconyArea,
      maxCombinedArea,
      maxVolumeExploitation,
    };
  }, [sdFinal, plotData.plotArea, allowedDataInput]);

  const calculatedActualData = useMemo<CalculatedActualData>(() => {
    const coveragePercentage = plotData.plotArea > 0 ? actualData.plotCoverage / plotData.plotArea : 0;
    const semiOutdoorPercentage = actualData.construction > 0 ? actualData.semiOutdoorArea / actualData.construction : 0;
    const balconyPercentage = actualData.construction > 0 ? actualData.balconyArea / actualData.construction : 0;
    const combinedArea = actualData.semiOutdoorArea + actualData.balconyArea;
    const combinedPercentage = actualData.construction > 0 ? combinedArea / actualData.construction : 0;
    const volumeExploitation = 0; // Placeholder for now
    const volumeCoefficient = plotData.plotArea > 0 ? volumeExploitation / plotData.plotArea : 0;
    return {
      coveragePercentage,
      semiOutdoorPercentage,
      balconyPercentage,
      combinedArea,
      combinedPercentage,
      volumeExploitation,
      volumeCoefficient,
    };
  }, [actualData, plotData.plotArea]);


  return (
     <div className="space-y-4">
        <div className="flex justify-end items-center gap-2">
            {isEditing ? (
                <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        <Save className="w-4 h-4 mr-2" />
                        Αποθήκευση
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Ακύρωση
                    </Button>
                </>
            ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Επεξεργασία
                </Button>
            )}
        </div>
        <Tabs defaultValue="general-plot-data" className="w-full"
            onValueChange={() => {
                // Logic to handle tab changes if needed
            }}
        >
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general-plot-data">Όροι Δόμησης Οικοπέδου</TabsTrigger>
                <TabsTrigger value="allowed-data">Επιτρεπόμενα</TabsTrigger>
                <TabsTrigger value="actual-data">Πραγματοποιούμενα</TabsTrigger>
                <TabsTrigger value="other-data">Λοιπά Στοιχεία</TabsTrigger>
            </TabsList>
            <TabsContent value="general-plot-data" className="pt-4">
                <GeneralPlotDataTab 
                    plotData={{...plotData, sdFinal}}
                    onPlotDataChange={handlePlotDataChange}
                />
            </TabsContent>
            <TabsContent value="allowed-data" className="pt-4">
                 <AllowedBuildingDataTab 
                    allowedDataInput={allowedDataInput}
                    calculatedData={calculatedAllowedData}
                    onInputChange={handleAllowedDataChange}
                />
            </TabsContent>
            <TabsContent value="actual-data" className="pt-4">
                <ActualBuildingDataTab 
                    actualData={actualData}
                    calculatedData={calculatedActualData}
                    onActualDataChange={handleActualDataChange}
                />
            </TabsContent>
            <TabsContent value="other-data" className="pt-4">
                <OtherDataTab />
            </TabsContent>
        </Tabs>
     </div>
  );
}
```

---

## src/app/projects/contributors-tab.tsx

```tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const contributors = [
  { id: 1, role: 'Αρχιτέκτων', name: 'Παπαδόπουλος Γεώργιος', company: 'P Architects', phone: '2310123456', email: 'g.papadopoulos@parch.gr' },
  { id: 2, role: 'Πολιτικός Μηχανικός', name: 'Ιωάννου Μαρία', company: 'Structura A.E.', phone: '2310654321', email: 'm.ioannou@structura.gr' },
  { id: 3, role: 'Μηχανολόγος Μηχανικός', name: 'Βασιλείου Κωνσταντίνος', company: 'Mech Solutions', phone: '2310789012', email: 'k.vasileiou@mech.gr' },
  { id: 4, role: 'Εργολάβος', name: 'Κατασκευαστική ΑΒΓ', company: 'Κατασκευαστική ΑΒΓ', phone: '2310345678', email: 'info@abg-kat.gr' }
];

export function ContributorsTab() {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Συντελεστές Έργου</CardTitle>
              <CardDescription>Λίστα με τους συντελεστές και τις επαφές τους για το έργο.</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Προσθήκη Συντελεστή
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ρόλος</TableHead>
                  <TableHead>Ονοματεπώνυμο</TableHead>
                  <TableHead>Εταιρεία</TableHead>
                  <TableHead>Τηλέφωνο</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributors.map((contributor) => (
                  <TableRow key={contributor.id}>
                    <TableCell className="font-medium">{contributor.role}</TableCell>
                    <TableCell>{contributor.name}</TableCell>
                    <TableCell>{contributor.company}</TableCell>
                    <TableCell>{contributor.phone}</TableCell>
                    <TableCell>
                      <a href={`mailto:${contributor.email}`} className="text-primary hover:underline">{contributor.email}</a>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Επεξεργασία</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Διαγραφή</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
```

---

## src/app/projects/documents-project-tab.tsx

```tsx
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractsTabContent } from './documents/ContractsTabContent';
import { MiscellaneousTabContent } from './documents/MiscellaneousTabContent';

export function DocumentsProjectTab() {
  return (
    <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contracts">Συμβόλαια</TabsTrigger>
            <TabsTrigger value="miscellaneous">Διάφορα Έγγραφα</TabsTrigger>
        </TabsList>
        <TabsContent value="contracts" className="pt-4">
            <ContractsTabContent />
        </TabsContent>
        <TabsContent value="miscellaneous" className="pt-4">
            <MiscellaneousTabContent />
        </TabsContent>
    </Tabs>
  );
}
```

---

## src/app/projects/ika-tab.tsx

```tsx
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkersTabContent } from './ika/WorkersTabContent';
import { TimesheetTabContent } from './ika/TimesheetTabContent';
import { StampsCalculationTabContent } from './ika/StampsCalculationTabContent';
import { ApdPaymentsTabContent } from './ika/ApdPaymentsTabContent';


export function IkaTab() {
  return (
    <Tabs defaultValue="workers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workers">Εργατοτεχνίτες</TabsTrigger>
            <TabsTrigger value="timesheet">Παρουσιολόγιο</TabsTrigger>
            <TabsTrigger value="stamps-calculation">Υπολογισμός Ενσήμων</TabsTrigger>
            <TabsTrigger value="apd-payments">ΑΠΔ & Πληρωμές</TabsTrigger>
        </TabsList>
        <TabsContent value="workers">
           <WorkersTabContent />
        </TabsContent>
        <TabsContent value="timesheet">
           <TimesheetTabContent />
        </TabsContent>
        <TabsContent value="stamps-calculation">
           <StampsCalculationTabContent />
        </TabsContent>
        <TabsContent value="apd-payments">
           <ApdPaymentsTabContent />
        </TabsContent>
    </Tabs>
  );
}
```

---

... and so on for all other related files.
