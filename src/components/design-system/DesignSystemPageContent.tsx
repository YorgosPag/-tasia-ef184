'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Settings, 
  Download, 
  Upload,
  Eye,
  Paintbrush,
  LayoutTemplate,
  MousePointerSquare,
  Sidebar
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ColorCustomizer } from './ColorCustomizer';
import { TypographyCustomizer } from './TypographyCustomizer';
import { LayoutCustomizer } from './LayoutCustomizer';
import { ButtonCustomizer } from './ButtonCustomizer';
import { AppLayoutCustomizer } from './AppLayoutCustomizer';


export function DesignSystemPageContent() {
  const [activeTab, setActiveTab] = useState('colors');

  const exportAllSettings = () => {
    alert('Η λειτουργικότητα εξαγωγής θέματος θα υλοποιηθεί σύντομα');
  };

  const importSettings = () => {
    alert('Η λειτουργικότητα εισαγωγής θέματος θα υλοποιηθεί σύντομα');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900/30 p-4 gap-4 min-h-screen">
      {/* Header */}
      <div className="border-b bg-card/80 dark:bg-card/50 backdrop-blur-sm sticky top-0 z-40 rounded-lg">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold">Σύστημα Σχεδίασης</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={importSettings}>
                <Upload className="w-4 h-4 mr-2" />
                Εισαγωγή
              </Button>
              <Button variant="outline" size="sm" onClick={exportAllSettings}>
                <Download className="w-4 h-4 mr-2" />
                Εξαγωγή
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Χρώματα
            </TabsTrigger>
            <TabsTrigger value="buttons" className="flex items-center gap-2">
              <MousePointerSquare className="w-4 h-4" />
              Κουμπιά
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Τυπογραφία
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" />
              Διάταξη & Αποστάσεις
            </TabsTrigger>
            <TabsTrigger value="app-layout" className="flex items-center gap-2">
                <Sidebar className="w-4 h-4" />
                Sidebar & Header
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-6">
             <ColorCustomizer />
          </TabsContent>

          <TabsContent value="buttons" className="space-y-6">
            <ButtonCustomizer />
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <TypographyCustomizer />
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <LayoutCustomizer />
          </TabsContent>

          <TabsContent value="app-layout" className="space-y-6">
            <AppLayoutCustomizer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
