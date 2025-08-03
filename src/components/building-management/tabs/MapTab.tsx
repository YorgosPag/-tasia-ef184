'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  Building2 
} from "lucide-react";
import { cn } from '@/lib/utils';
import type { Building, NearbyProject } from '@/types/building';

export function MapTab({ building }: { building: Building }) {
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'hybrid'>('street');
  const [showNearbyProjects, setShowNearbyProjects] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'active' | 'completed'>('all');

  const nearbyProjects: NearbyProject[] = [
    { id: 1, name: "Εμπορικό Κέντρο Κολωνάκι", distance: "200m", status: "active", type: "commercial", progress: 65 },
    { id: 2, name: "Κατοικίες Μαρασλή", distance: "350m", status: "completed", type: "residential", progress: 100 },
    { id: 3, name: "Γραφεία Σκουφά", distance: "120m", status: "planning", type: "office", progress: 15 }
  ];

  const coordinates = { lat: 37.9838, lng: 23.7275 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Χάρτης & Τοποθεσία</h3>
          <p className="text-sm text-muted-foreground">Διαδραστικός χάρτης με nearby projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={mapView === 'street' ? 'default' : 'outline'} size="sm" onClick={() => setMapView('street')}>🗺️ Δρόμος</Button>
          <Button variant={mapView === 'satellite' ? 'default' : 'outline'} size="sm" onClick={() => setMapView('satellite')}>🛰️ Δορυφόρος</Button>
          <Button variant={mapView === 'hybrid' ? 'default' : 'outline'} size="sm" onClick={() => setMapView('hybrid')}>🌐 Υβριδικός</Button>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" />Στοιχεία Τοποθεσίας</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><Label className="text-sm font-medium">Διεύθυνση</Label><p className="text-sm text-muted-foreground mt-1">{building.address}, {building.city}</p></div>
              <div><Label className="text-sm font-medium">Συντεταγμένες</Label><p className="text-sm text-muted-foreground mt-1">{coordinates.lat}°N, {coordinates.lng}°E</p></div>
              <div className="flex gap-2"><Button variant="outline" size="sm">📍 Οδηγίες μετάβασης</Button><Button variant="outline" size="sm">📤 Κοινοποίηση τοποθεσίας</Button></div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Πληροφορίες Περιοχής</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Τύπος περιοχής:</span><span>Κεντρικό - Εμπορικό</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Συντ. δόμησης:</span><span>3.6</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Μέγιστο ύψος:</span><span>27m (9 όροφοι)</span></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Διαδραστικός Χάρτης</CardTitle></CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
            <div className="absolute inset-0">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 opacity-10"><div className="grid grid-cols-12 grid-rows-8 h-full w-full">{Array.from({length: 96}).map((_, i) => (<div key={i} className="border border-gray-400"></div>))}</div></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"><div className="relative"><div className="animate-bounce"><div className="bg-red-500 p-3 rounded-full shadow-lg border-4 border-white"><Building2 className="w-6 h-6 text-white" /></div></div><div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm whitespace-nowrap">🏗️ {building.name}</div></div></div>
                {showNearbyProjects && nearbyProjects.map((project, index) => (<div key={project.id} className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2" style={{ top: `${40 + (index * 15)}%`, left: `${35 + (index * 20)}%` }}><div className="group relative"><div className={cn("p-2 rounded-full shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-110", project.status === 'active' ? 'bg-blue-500' : project.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500')}><div className="w-4 h-4 text-white">{project.type === 'commercial' ? '🏪' : project.type === 'residential' ? '🏠' : '🏢'}</div></div><div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"><div className="font-medium">{project.name}</div><div className="text-gray-300">{project.distance} • {project.progress}%</div></div></div></div>))}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><div className="w-32 h-32 border-2 border-blue-300 border-dashed rounded-full opacity-30"></div><div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-200 border-dashed rounded-full opacity-20"></div></div>
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded text-sm"><div className="flex items-center gap-2"><div className="w-16 h-1 bg-black"></div><span>100m</span></div></div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded text-sm font-medium">{mapView === 'street' ? '🗺️ Χάρτης δρόμων' : mapView === 'satellite' ? '🛰️ Δορυφορική όψη' : '🌐 Υβριδική όψη'}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Checkbox id="nearby-projects" checked={showNearbyProjects} onCheckedChange={(checked) => setShowNearbyProjects(Boolean(checked))} /><Label htmlFor="nearby-projects" className="text-sm">Εμφάνιση γειτονικών έργων</Label></div>
              <div className="flex items-center gap-2"><Label className="text-sm">Φίλτρο:</Label><select value={selectedLayer} onChange={(e) => setSelectedLayer(e.target.value as any)} className="text-sm border border-gray-300 rounded px-2 py-1"><option value="all">Όλα τα έργα</option><option value="active">Ενεργά μόνο</option><option value="completed">Ολοκληρωμένα μόνο</option></select></div>
            </div>
            <div className="flex items-center gap-2"><Button variant="outline" size="sm">🔍 Zoom In</Button><Button variant="outline" size="sm">🔍 Zoom Out</Button><Button variant="outline" size="sm">📐 Μέτρηση απόστασης</Button></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" />Γειτονικά Έργα</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nearbyProjects.map((project) => (<div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"><div className="flex items-center gap-3"><div className={cn("w-3 h-3 rounded-full", project.status === 'active' ? 'bg-blue-500' : project.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500')}></div><div><p className="font-medium">{project.name}</p><p className="text-sm text-muted-foreground">{project.distance} απόσταση • {project.type === 'commercial' ? 'Εμπορικό' : project.type === 'residential' ? 'Κατοικίες' : 'Γραφεία'}</p></div></div><div className="text-right"><div className="text-sm font-medium">{project.progress}%</div><div className="text-xs text-muted-foreground">{project.status === 'active' ? 'Σε εξέλιξη' : project.status === 'completed' ? 'Ολοκληρωμένο' : 'Σχεδιασμός'}</div></div></div>))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle className="text-base">Συγκοινωνίες</CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm">🚇 Μετρό Ευαγγελισμός</span><span className="text-sm font-medium">300m</span></div><div className="flex items-center justify-between"><span className="text-sm">🚌 Στάση λεωφορείου</span><span className="text-sm font-medium">50m</span></div><div className="flex items-center justify-between"><span className="text-sm">🚗 Πάρκινγκ</span><span className="text-sm font-medium">150m</span></div></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Υπηρεσίες</CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm">🏥 Νοσοκομείο</span><span className="text-sm font-medium">800m</span></div><div className="flex items-center justify-between"><span className="text-sm">🏫 Σχολεία</span><span className="text-sm font-medium">400m</span></div><div className="flex items-center justify-between"><span className="text-sm">🛒 Σούπερ μάρκετ</span><span className="text-sm font-medium">200m</span></div></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Αξιολόγηση Περιοχής</CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm">📈 Επενδυτικός δείκτης</span><span className="text-sm font-medium text-green-600">8.5/10</span></div><div className="flex items-center justify-between"><span className="text-sm">🏘️ Ποιότητα περιοχής</span><span className="text-sm font-medium text-green-600">9.2/10</span></div><div className="flex items-center justify-between"><span className="text-sm">💰 Τιμές ακινήτων</span><span className="text-sm font-medium text-blue-600">€3,200/m²</span></div></div></CardContent></Card>
      </div>
    </div>
  );
};
