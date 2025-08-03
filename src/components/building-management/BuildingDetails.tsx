
'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Folder, 
  Edit, 
  Save, 
  Download, 
  Upload,
  Camera,
  Video,
  FileText,
  Calendar,
  MapPin,
  Building2,
  Home,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Share,
  Print,
  Settings,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlaceholderTab } from '@/app/projects/placeholder-tab';
import { GeneralProjectTab } from '@/components/projects/general-project-tab';

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

const PhotosTabContent = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Φωτογραφίες Κτιρίου</h3>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="hidden" 
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <Button asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Ανέβασμα Φωτογραφιών
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">Σύρετε φωτογραφίες εδώ</p>
        <p className="text-sm text-gray-500">ή κάντε κλικ για επιλογή αρχείων</p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ανέβασμα σε εξέλιξη...</p>
                <Progress value={uploadProgress} className="mt-2" />
                <p className="text-xs text-gray-500 mt-1">{uploadProgress}% ολοκληρώθηκε</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Existing Photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Sample Photo */}
        <div className="relative group">
          <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%236B7280' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E"
              alt="Building progress"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex gap-2">
              <Button size="sm" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            Πρόοδος Φεβ 2025
          </div>
        </div>

        {/* Add more placeholder */}
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-blue-400 transition-colors cursor-pointer group">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Προσθήκη Φωτογραφίας</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VideosTabContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Videos Κτιρίου</h3>
      <Button>
        <Upload className="w-4 h-4 mr-2" />
        Ανέβασμα Video
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-blue-400 transition-colors cursor-pointer group">
          <div className="text-center">
            <Video className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Προσθήκη Video</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface BuildingDetailsProps {
  building: Building;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingDetails({ building, getStatusColor, getStatusLabel }: BuildingDetailsProps) {
  return (
    <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                {building.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("text-xs", getStatusColor(building.status).replace('bg-', 'bg-') + ' text-white')}>
                  {getStatusLabel(building.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {building.progress}% ολοκληρωμένο
                </span>
              </div>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Eye className="w-4 h-4 mr-2" />
            Επίδειξη Κτιρίου
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs defaultValue="general" className="h-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Γενικά
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
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
              <GeneralProjectTab />
            </TabsContent>

            <TabsContent value="storage" className="mt-0">
              <PlaceholderTab title="Αποθήκες" />
            </TabsContent>

            <TabsContent value="contracts" className="mt-0">
              <PlaceholderTab title="Συμβόλαια Πελατών" />
            </TabsContent>

            <TabsContent value="protocols" className="mt-0">
              <PlaceholderTab title="Υ.Δ.Τοιχοποιίας & Πρωτόκολλα" />
            </TabsContent>

            <TabsContent value="photos" className="mt-0">
              <PhotosTabContent />
            </TabsContent>

            <TabsContent value="videos" className="mt-0">
              <VideosTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
