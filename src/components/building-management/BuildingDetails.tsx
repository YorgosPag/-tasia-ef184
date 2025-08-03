'use client';

import React, { useState } from 'react';
import { Eye, Edit, Save, X, Share, Print, Building, Image as ImageIcon, Video, FileText, Users, DollarSign, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { PlaceholderTab } from '@/app/projects/placeholder-tab';

type Building = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  totalArea: number;
  builtArea: number;
  floors: number;
  units: number;
  status: 'active' | 'construction' | 'planned' | 'completed';
  startDate?: string;
  completionDate?: string;
  progress: number;
  totalValue: number;
  image?: string;
  company: string;
  project: string;
  category: 'residential' | 'commercial' | 'mixed' | 'industrial';
  features?: string[];
};

interface BuildingDetailsProps {
  building: Building;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const GeneralTabContent = ({ building, isEditing }: { building: Building, isEditing: boolean }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label className="text-sm font-medium">Τίτλος Κτιρίου</Label>
                <Input defaultValue={building.name} disabled={!isEditing} className="bg-muted/50" />
            </div>
            <div className="space-y-2">
                <Label className="text-sm font-medium">Διεύθυνση</Label>
                <Input defaultValue={building.address} disabled={!isEditing} className="bg-muted/50" />
            </div>
            <div className="space-y-2">
                <Label className="text-sm font-medium">Πόλη</Label>
                <Input defaultValue={building.city} disabled={!isEditing} className="bg-muted/50" />
            </div>
            <div className="space-y-2">
                <Label className="text-sm font-medium">Κατηγορία</Label>
                <Input defaultValue={building.category} disabled={!isEditing} className="bg-muted/50" />
            </div>
        </div>
        <div className="space-y-2">
            <Label className="text-sm font-medium">Περιγραφή</Label>
            <Textarea rows={4} defaultValue={building.description} disabled={!isEditing} className="bg-muted/50" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
                <Label className="text-xs">Σύνολο Δόμησης (m²)</Label>
                <p className="font-semibold">{building.totalArea}</p>
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Δομημένη Επιφάνεια (m²)</Label>
                <p className="font-semibold">{building.builtArea}</p>
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Όροφοι</Label>
                <p className="font-semibold">{building.floors}</p>
            </div>
            <div className="space-y-1">
                <Label className="text-xs">Μονάδες</Label>
                <p className="font-semibold">{building.units}</p>
            </div>
        </div>
        <div>
            <Label>Πρόοδος Έργου</Label>
            <Progress value={building.progress} className="mt-2" />
        </div>
    </div>
);

const PhotosTabContent = () => <PlaceholderTab title="Φωτογραφίες" />;
const VideosTabContent = () => <PlaceholderTab title="Videos" />;
const ContractsTabContent = () => <PlaceholderTab title="Συμβόλαια" />;
const PermitsTabContent = () => <PlaceholderTab title="Άδειες" />;
const ContributorsTabContent = () => <PlaceholderTab title="Συντελεστές" />;
const FinancialsTabContent = () => <PlaceholderTab title="Οικονομικά" />;

export function BuildingDetails({ building, getStatusColor, getStatusLabel }: BuildingDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Γενικά', icon: Building },
    { id: 'photos', label: 'Φωτογραφίες', icon: ImageIcon },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'contracts', label: 'Συμβόλαια', icon: FileText },
    { id: 'permits', label: 'Άδειες', icon: FileText },
    { id: 'contributors', label: 'Συντελεστές', icon: Users },
    { id: 'financials', label: 'Οικονομικά', icon: DollarSign },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTabContent building={building} isEditing={isEditing} />;
      case 'photos':
        return <PhotosTabContent />;
      case 'videos':
        return <VideosTabContent />;
      case 'contracts':
        return <ContractsTabContent />;
      case 'permits':
        return <PermitsTabContent />;
      case 'contributors':
        return <ContributorsTabContent />;
      case 'financials':
        return <FinancialsTabContent />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card border border-border rounded-lg min-w-0 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-muted/20 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {building.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", getStatusColor(building.status))}>
                    {getStatusLabel(building.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {building.progress}% ολοκληρωμένο
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Επεξεργασία
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Ακύρωση
                    </Button>
                    <Button size="sm" onClick={() => setIsEditing(false)} className="bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4 mr-2" />
                      Αποθήκευση
                    </Button>
                  </>
                )}
            <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Κοινοποίηση
            </Button>
            <Button variant="outline" size="sm">
                <Print className="w-4 h-4 mr-2" />
                Εκτύπωση
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50">
        <nav className="flex space-x-2 px-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                  'flex items-center gap-2 py-3 px-3 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
