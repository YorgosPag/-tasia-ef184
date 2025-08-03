'use client';

import React, { useState } from 'react';
import { Eye, Edit, Save, X, Share, Print, Image, Building2 as BuildingIcon, Users, FileText, Video, Info } from 'lucide-react';
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

function GeneralTabContent({ building, isEditing }: { building: Building; isEditing: boolean }) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-card shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-card-foreground mb-4">Βασικές Πληροφορίες</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Τίτλος Κτιρίου</label>
            <input
              type="text"
              defaultValue={building.name}
              disabled={!isEditing}
              className={`mt-1 block w-full border-border rounded-md shadow-sm ${
                !isEditing ? 'bg-muted' : 'bg-background'
              } p-2`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Περιγραφή Κτιρίου</label>
            <textarea
              rows={4}
              defaultValue={building.description}
              disabled={!isEditing}
              className={`mt-1 block w-full border-border rounded-md shadow-sm ${
                !isEditing ? 'bg-muted' : 'bg-background'
              } p-2`}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-card shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-card-foreground mb-4">Τοποθεσία</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Διεύθυνση</label>
            <input
              type="text"
              defaultValue={building.address}
              disabled={!isEditing}
              className={`mt-1 block w-full border-border rounded-md shadow-sm ${
                !isEditing ? 'bg-muted' : 'bg-background'
              } p-2`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Πόλη</label>
            <input
              type="text"
              defaultValue={building.city}
              disabled={!isEditing}
              className={`mt-1 block w-full border-border rounded-md shadow-sm ${
                !isEditing ? 'bg-muted' : 'bg-background'
              } p-2`}
            />
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-card shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-card-foreground mb-4">Τεχνικά Χαρακτηριστικά</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Σύνολο Δόμησης (m²)</label>
            <input
              type="number"
              defaultValue={building.totalArea}
              disabled={!isEditing}
              className={`mt-1 block w-full border-border rounded-md shadow-sm ${
                !isEditing ? 'bg-muted' : 'bg-background'
              } p-2`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Δομημένη Επιφάνεια (m²)</label>
            <input
              type="number"
              defaultValue={building.builtArea}
              disabled={!isEditing}
              className={`mt-1 block w-full border-border rounded-md shadow-sm ${
                !isEditing ? 'bg-muted' : 'bg-background'
              } p-2`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Αριθμός Ορόφων</label>
            <input
              type="number"
              defaultValue={building.floors}
              disabled={!isEditing}
              className={`mt-1 block w-full border-border rounded-md shadow-sm ${
                !isEditing ? 'bg-muted' : 'bg-background'
              } p-2`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Αριθμός Μονάδων</label>
            <input
              type="number"
              defaultValue={building.units}
              disabled={!isEditing}
              className={`mt-1 block w-full border-border rounded-md shadow-sm ${
                !isEditing ? 'bg-muted' : 'bg-background'
              } p-2`}
            />
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-card-foreground mb-4">Πρόοδος Έργου</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Πρόοδος</span>
            <span className="text-sm font-medium text-primary">{building.progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500" 
              style={{ width: `${building.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoragesTabContent() {
  return <PlaceholderTab title="Αποθήκες" />;
}

function ContractsTabContent() {
  return <PlaceholderTab title="Συμβόλαια" />;
}

function ProtocolsTabContent() {
  return <PlaceholderTab title="Πρωτόκολλα" />;
}

function PhotosTabContent() {
  return <PlaceholderTab title="Φωτογραφίες" />;
}

function VideosTabContent() {
    return <PlaceholderTab title="Videos" />;
}


export function BuildingDetails({ building, getStatusColor, getStatusLabel }: BuildingDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Γενικά', icon: Info },
    { id: 'storage', label: 'Αποθήκες', icon: BuildingIcon },
    { id: 'contracts', label: 'Συμβόλαια', icon: FileText },
    { id: 'protocols', label: 'Πρωτόκολλα', icon: Users },
    { id: 'photos', label: 'Φωτογραφίες', icon: Image },
    { id: 'videos', label: 'Videos', icon: Video }
  ];

  return (
    <div className="flex-1 flex flex-col bg-muted/20 border-l border-border min-w-0">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {building.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(building.status).replace('bg-','bg-opacity-20 ')} ${getStatusColor(building.status).replace('bg-','text-')}`}>
                  {getStatusLabel(building.status)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {building.progress}% ολοκληρωμένο
                </span>
              </div>
            </div>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
            <Eye className="w-4 h-4" />
            Επίδειξη Κτιρίου
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <nav className="flex space-x-2 px-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'general' && <GeneralTabContent building={building} isEditing={isEditing} />}
        {activeTab === 'storage' && <StoragesTabContent />}
        {activeTab === 'contracts' && <ContractsTabContent />}
        {activeTab === 'protocols' && <ProtocolsTabContent />}
        {activeTab === 'photos' && <PhotosTabContent />}
        {activeTab === 'videos' && <VideosTabContent />}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center justify-end gap-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted"
              >
                <Edit className="w-4 h-4 mr-2" />
                Επεξεργασία
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted"
                >
                  <X className="w-4 h-4 mr-2" />
                  Ακύρωση
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Αποθήκευση
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
