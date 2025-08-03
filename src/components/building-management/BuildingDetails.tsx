'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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

const GeneralTabContent = ({ building }: { building: Building }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: building.name,
    description: building.description || '',
    totalArea: building.totalArea,
    builtArea: building.builtArea,
    floors: building.floors,
    units: building.units,
    totalValue: building.totalValue,
    startDate: building.startDate || '',
    completionDate: building.completionDate || '',
    address: building.address || '',
    city: building.city || ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Auto-save functionality
  React.useEffect(() => {
    if (!isEditing) return;
    
    const timeoutId = setTimeout(() => {
      setAutoSaving(true);
      // Simulate API call
      setTimeout(() => {
        setAutoSaving(false);
        setLastSaved(new Date());
        console.log('Auto-saved:', formData);
      }, 1000);
    }, 2000); // Auto-save after 2 seconds of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, isEditing]);

  // Validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Το όνομα είναι υποχρεωτικό';
    }
    if (formData.totalArea <= 0) {
      newErrors.totalArea = 'Η επιφάνεια πρέπει να είναι μεγαλύτερη από 0';
    }
    if (formData.builtArea > formData.totalArea) {
      newErrors.builtArea = 'Η δομημένη επιφάνεια δεν μπορεί να υπερβαίνει τη συνολική';
    }
    if (formData.floors <= 0) {
      newErrors.floors = 'Οι όροφοι πρέπει να είναι τουλάχιστον 1';
    }
    if (formData.units <= 0) {
      newErrors.units = 'Οι μονάδες πρέπει να είναι τουλάχιστον 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Smart calculations
  const costPerSqm = formData.totalArea > 0 ? (formData.totalValue / formData.totalArea) : 0;
  const buildingRatio = formData.totalArea > 0 ? (formData.builtArea / formData.totalArea * 100) : 0;

  const handleSave = () => {
    if (validateForm()) {
      setIsEditing(false);
      setLastSaved(new Date());
      console.log('Manual save:', formData);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Smart calculations
    if (field === 'totalArea' && value > 0) {
      // Auto-update built area to 80% if it's 0
      if (formData.builtArea === 0) {
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          builtArea: Math.round(value * 0.8)
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Smart Header with Auto-save Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            ID: {building.id}
          </Badge>
          <Badge variant="outline">
            {building.category === 'residential' && 'Κατοικίες'}
            {building.category === 'commercial' && 'Εμπορικό'}
            {building.category === 'mixed' && 'Μικτή Χρήση'}
            {building.category === 'industrial' && 'Βιομηχανικό'}
          </Badge>
          
          {/* Auto-save indicator */}
          {isEditing && (
            <div className="flex items-center gap-2 text-xs">
              {autoSaving ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600">Αποθήκευση...</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">
                    Αποθηκεύτηκε {lastSaved.toLocaleTimeString('el-GR')}
                  </span>
                </>
              ) : null}
            </div>
          )}
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
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Αποθήκευση
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Smart Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Βασικές Πληροφορίες
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Τίτλος Κτιρίου *</Label>
            <Input 
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              disabled={!isEditing}
              className={cn(
                !isEditing && "bg-muted",
                errors.name && "border-red-500"
              )}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Περιγραφή Κτιρίου</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              disabled={!isEditing}
              className={cn(!isEditing && "bg-muted")}
              rows={3}
              placeholder="Περιγράψτε το κτίριο..."
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.description.length}/500 χαρακτήρες
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Technical Specs with Live Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Τεχνικά Χαρακτηριστικά
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Συνολική Επιφάνεια (m²) *</Label>
              <Input 
                type="number"
                value={formData.totalArea}
                onChange={(e) => updateField('totalArea', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className={cn(
                  !isEditing && "bg-muted",
                  errors.totalArea && "border-red-500"
                )}
              />
              {errors.totalArea && <p className="text-sm text-red-500">{errors.totalArea}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Δομημένη Επιφάνεια (m²) *</Label>
              <Input 
                type="number"
                value={formData.builtArea}
                onChange={(e) => updateField('builtArea', parseFloat(e.target.value) || 0)}
                disabled={!isEditing}
                className={cn(
                  !isEditing && "bg-muted",
                  errors.builtArea && "border-red-500"
                )}
              />
              {errors.builtArea && <p className="text-sm text-red-500">{errors.builtArea}</p>}
              {formData.totalArea > 0 && (
                <p className="text-xs text-muted-foreground">
                  Συντελεστής δόμησης: {buildingRatio.toFixed(1)}%
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Αριθμός Ορόφων *</Label>
              <Input 
                type="number"
                value={formData.floors}
                onChange={(e) => updateField('floors', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                className={cn(
                  !isEditing && "bg-muted",
                  errors.floors && "border-red-500"
                )}
              />
              {errors.floors && <p className="text-sm text-red-500">{errors.floors}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Αριθμός Μονάδων *</Label>
              <Input 
                type="number"
                value={formData.units}
                onChange={(e) => updateField('units', parseInt(e.target.value) || 0)}
                disabled={!isEditing}
                className={cn(
                  !isEditing && "bg-muted",
                  errors.units && "border-red-500"
                )}
              />
              {errors.units && <p className="text-sm text-red-500">{errors.units}</p>}
              {formData.floors > 0 && (
                <p className="text-xs text-muted-foreground">
                  ~{(formData.units / formData.floors).toFixed(1)} μονάδες/όροφο
                </p>
              )}
            </div>
          </div>

          {/* Live Calculations Display */}
          {formData.totalArea > 0 && formData.totalValue > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Αυτόματοι Υπολογισμοί
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Κόστος/m²:</span>
                  <p className="font-semibold">{costPerSqm.toLocaleString('el-GR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}€</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Συντ. Δόμησης:</span>
                  <p className="font-semibold">{buildingRatio.toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">m²/Μονάδα:</span>
                  <p className="font-semibold">{formData.units > 0 ? (formData.builtArea / formData.units).toFixed(1) : 0} m²</p>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Αξία/Μονάδα:</span>
                  <p className="font-semibold">{formData.units > 0 ? (formData.totalValue / formData.units).toLocaleString('el-GR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0}€</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress with Smart Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Πρόοδος Έργου
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ποσοστό Ολοκλήρωσης</Label>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {building.progress}% Ολοκληρωμένο
              </Badge>
            </div>
            <Progress value={building.progress} className="h-3" />
            
            {/* Smart Progress Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
              <div className={cn("p-2 rounded text-center", building.progress >= 25 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                <div className="font-medium">Θεμέλια</div>
                <div>0-25%</div>
              </div>
              <div className={cn("p-2 rounded text-center", building.progress >= 50 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                <div className="font-medium">Κατασκευή</div>
                <div>25-50%</div>
              </div>
              <div className={cn("p-2 rounded text-center", building.progress >= 75 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                <div className="font-medium">Ολοκληρώσεις</div>
                <div>50-75%</div>
              </div>
              <div className={cn("p-2 rounded text-center", building.progress >= 100 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                <div className="font-medium">Παράδοση</div>
                <div>75-100%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TimelineTabContent = ({ building }: { building: Building }) => {
  const [milestones] = useState([
    {
      id: 1,
      title: "Έναρξη Έργου",
      description: "Υπογραφή συμβολαίου και έναρξη εργασιών",
      date: "2006-05-02",
      status: "completed",
      progress: 100,
      type: "start"
    },
    {
      id: 2,
      title: "Θεμέλια & Υπόγειο",
      description: "Ολοκλήρωση εκσκαφών και κατασκευή θεμελίων",
      date: "2006-08-15",
      status: "completed",
      progress: 100,
      type: "construction"
    },
    {
      id: 3,
      title: "Κατασκευή Φέροντα Οργανισμού",
      description: "Σκελετός κτιρίου - όροφοι 1-7",
      date: "2007-12-20",
      status: "completed", 
      progress: 100,
      type: "construction"
    },
    {
      id: 4,
      title: "Τοιχοποιίες & Στεγανοποίηση",
      description: "Κλείσιμο κτιρίου και στεγανότητα",
      date: "2008-06-30",
      status: "completed",
      progress: 100,
      type: "construction"
    },
    {
      id: 5,
      title: "Ηλ/Μηχ Εγκαταστάσεις",
      description: "Ηλεκτρολογικές και μηχανολογικές εγκαταστάσεις",
      date: "2008-11-15",
      status: "in-progress",
      progress: 85,
      type: "systems"
    },
    {
      id: 6,
      title: "Τελικές Εργασίες",
      description: "Χρωματισμοί, δάπεδα, διακοσμητικά στοιχεία",
      date: "2009-01-30",
      status: "pending",
      progress: 45,
      type: "finishing"
    },
    {
      id: 7,
      title: "Παράδοση Έργου",
      description: "Τελικός έλεγχος και παράδοση στον πελάτη",
      date: "2009-02-28",
      status: "pending",
      progress: 0,
      type: "delivery"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-500';
      case 'in-progress': return 'bg-blue-500 border-blue-500';
      case 'pending': return 'bg-gray-300 border-gray-300';
      case 'delayed': return 'bg-red-500 border-red-500';
      default: return 'bg-gray-300 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ολοκληρώθηκε';
      case 'in-progress': return 'Σε εξέλιξη';
      case 'pending': return 'Εκκρεμεί';
      case 'delayed': return 'Καθυστέρηση';
      default: return 'Άγνωστο';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'start': return '🚀';
      case 'construction': return '🏗️';
      case 'systems': return '⚡';
      case 'finishing': return '🎨';
      case 'delivery': return '🎯';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Χρονοδιάγραμμα Έργου</h3>
          <p className="text-sm text-muted-foreground">
            Παρακολούθηση προόδου και milestones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {milestones.filter(m => m.status === 'completed').length} / {milestones.length} ολοκληρώθηκαν
          </Badge>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Συνολική Πρόοδος</span>
            <span className="text-2xl font-bold text-blue-600">{building.progress}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={building.progress} className="h-4 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-muted-foreground">Ολοκληρωμένα</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-muted-foreground">Σε εξέλιξη</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">2</div>
              <div className="text-muted-foreground">Εκκρεμεί</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {milestones.find(m => m.status === 'in-progress')?.date ? 
                  Math.ceil((new Date(milestones.find(m => m.status === 'in-progress')!.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                  : 0
                }
              </div>
              <div className="text-muted-foreground">Ημέρες απομένουν</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Λεπτομερή Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className={cn(
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 shadow-sm",
                    getStatusColor(milestone.status),
                    milestone.status === 'completed' ? 'text-white' : 'text-gray-600'
                  )}>
                    <span className="text-lg">{getTypeIcon(milestone.type)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {milestone.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            milestone.status === 'completed' ? 'bg-green-50 text-green-700 border-green-300' :
                            milestone.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                            'bg-gray-50 text-gray-700 border-gray-300'
                          )}
                        >
                          {getStatusText(milestone.status)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(milestone.date).toLocaleDateString('el-GR')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">
                      {milestone.description}
                    </p>

                    {/* Progress bar for this milestone */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Πρόοδος milestone</span>
                        <span className="font-medium">{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>

                    {/* Milestone details */}
                    {milestone.status === 'in-progress' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-sm text-blue-800">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Επόμενα βήματα:</span>
                        </div>
                        <ul className="mt-2 text-sm text-blue-700 space-y-1">
                          <li>• Ολοκλήρωση κεντρικού θερμικού συστήματος</li>
                          <li>• Εγκατάσταση ανελκυστήρων</li>
                          <li>• Τελικός έλεγχος ηλεκτρολογικών</li>
                        </ul>
                      </div>
                    )}

                    {milestone.status === 'completed' && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Ολοκληρώθηκε στις {new Date(milestone.date).toLocaleDateString('el-GR')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Path & Delays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Κρίσιμα Σημεία
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">Ηλ/Μηχ Εγκαταστάσεις</p>
                  <p className="text-sm text-orange-700">Επηρεάζει την παράδοση</p>
                </div>
                <Badge variant="outline" className="bg-orange-100 text-orange-700">
                  5 ημέρες καθυστέρηση
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">Τελικές Εργασίες</p>
                  <p className="text-sm text-yellow-700">Εξαρτάται από προηγούμενο</p>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                  Αναμονή
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Πρόβλεψη Ολοκλήρωσης
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Αρχικό χρονοδιάγραμμα</span>
                  <span className="font-medium">28/02/2009</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Τρέχουσα πρόβλεψη</span>
                  <span className="font-medium text-orange-600">05/03/2009</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Καθυστέρηση</span>
                  <Badge variant="outline" className="bg-orange-100 text-orange-700">
                    +5 ημέρες
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">💡 <strong>Συμβουλή:</strong></p>
                <p>Επιτάχυνση ηλ/μηχ εργασιών μπορεί να μειώσει την καθυστέρηση στις 2-3 ημέρες.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MapTabContent = ({ building }: { building: Building }) => {
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'hybrid'>('street');
  const [showNearbyProjects, setShowNearbyProjects] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'active' | 'completed'>('all');

  // Mock nearby projects data
  const nearbyProjects = [
    {
      id: 1,
      name: "Εμπορικό Κέντρο Κολωνάκι",
      distance: "200m",
      status: "active",
      type: "commercial",
      progress: 65
    },
    {
      id: 2, 
      name: "Κατοικίες Μαρασλή",
      distance: "350m",
      status: "completed",
      type: "residential",
      progress: 100
    },
    {
      id: 3,
      name: "Γραφεία Σκουφά",
      distance: "120m", 
      status: "planning",
      type: "office",
      progress: 15
    }
  ];

  const coordinates = {
    lat: 37.9838,  // Approximate coordinates for Athens center
    lng: 23.7275
  };

  return (
    <div className="space-y-6">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Χάρτης & Τοποθεσία</h3>
          <p className="text-sm text-muted-foreground">
            Διαδραστικός χάρτης με nearby projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={mapView === 'street' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMapView('street')}
          >
            🗺️ Δρόμος
          </Button>
          <Button
            variant={mapView === 'satellite' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMapView('satellite')}
          >
            🛰️ Δορυφόρος
          </Button>
          <Button
            variant={mapView === 'hybrid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMapView('hybrid')}
          >
            🌐 Υβριδικός
          </Button>
        </div>
      </div>

      {/* Location Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Στοιχεία Τοποθεσίας
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Διεύθυνση</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {building.address}, {building.city}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Συντεταγμένες</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {coordinates.lat}°N, {coordinates.lng}°E
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  📍 Οδηγίες μετάβασης
                </Button>
                <Button variant="outline" size="sm">
                  📤 Κοινοποίηση τοποθεσίας
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Πληροφορίες Περιοχής</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Τύπος περιοχής:</span>
                    <span>Κεντρικό - Εμπορικό</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Συντ. δόμησης:</span>
                    <span>3.6</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Μέγιστο ύψος:</span>
                    <span>27m (9 όροφοι)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle>Διαδραστικός Χάρτης</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Map Container - Simulated */}
          <div className="relative h-96 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
            {/* Simulated Map Background */}
            <div className="absolute inset-0">
              <div className="w-full h-full relative">
                {/* Grid pattern to simulate map */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                    {Array.from({length: 96}).map((_, i) => (
                      <div key={i} className="border border-gray-400"></div>
                    ))}
                  </div>
                </div>
                
                {/* Main Building Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative">
                    <div className="animate-bounce">
                      <div className="bg-red-500 p-3 rounded-full shadow-lg border-4 border-white">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
                      🏗️ {building.name}
                    </div>
                  </div>
                </div>

                {/* Nearby Projects */}
                {showNearbyProjects && nearbyProjects.map((project, index) => (
                  <div 
                    key={project.id}
                    className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2`}
                    style={{
                      top: `${40 + (index * 15)}%`,
                      left: `${35 + (index * 20)}%`
                    }}
                  >
                    <div className="group relative">
                      <div className={cn(
                        "p-2 rounded-full shadow-md border-2 border-white cursor-pointer transition-transform hover:scale-110",
                        project.status === 'active' ? 'bg-blue-500' :
                        project.status === 'completed' ? 'bg-green-500' :
                        'bg-yellow-500'
                      )}>
                        <div className="w-4 h-4 text-white">
                          {project.type === 'commercial' ? '🏪' :
                           project.type === 'residential' ? '🏠' : '🏢'}
                        </div>
                      </div>
                      
                      {/* Hover tooltip */}
                      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-gray-300">{project.distance} • {project.progress}%</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Distance circles */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-32 h-32 border-2 border-blue-300 border-dashed rounded-full opacity-30"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-200 border-dashed rounded-full opacity-20"></div>
                </div>

                {/* Scale indicator */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-black"></div>
                    <span>100m</span>
                  </div>
                </div>

                {/* Map type indicator */}
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded text-sm font-medium">
                  {mapView === 'street' ? '🗺️ Χάρτης δρόμων' :
                   mapView === 'satellite' ? '🛰️ Δορυφορική όψη' :
                   '🌐 Υβριδική όψη'}
                </div>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="nearby-projects"
                  checked={showNearbyProjects}
                  onCheckedChange={(checked) => setShowNearbyProjects(Boolean(checked))}
                />
                <Label htmlFor="nearby-projects" className="text-sm">
                  Εμφάνιση γειτονικών έργων
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm">Φίλτρο:</Label>
                <select 
                  value={selectedLayer}
                  onChange={(e) => setSelectedLayer(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="all">Όλα τα έργα</option>
                  <option value="active">Ενεργά μόνο</option>
                  <option value="completed">Ολοκληρωμένα μόνο</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                🔍 Zoom In
              </Button>
              <Button variant="outline" size="sm">
                🔍 Zoom Out
              </Button>
              <Button variant="outline" size="sm">
                📐 Μέτρηση απόστασης
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Projects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Γειτονικά Έργα
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nearbyProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    project.status === 'active' ? 'bg-blue-500' :
                    project.status === 'completed' ? 'bg-green-500' :
                    'bg-yellow-500'
                  )}></div>
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.distance} απόσταση • {project.type === 'commercial' ? 'Εμπορικό' : 
                       project.type === 'residential' ? 'Κατοικίες' : 'Γραφεία'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{project.progress}%</div>
                  <div className="text-xs text-muted-foreground">
                    {project.status === 'active' ? 'Σε εξέλιξη' :
                     project.status === 'completed' ? 'Ολοκληρωμένο' :
                     'Σχεδιασμός'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Συγκοινωνίες</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">🚇 Μετρό Ευαγγελισμός</span>
                <span className="text-sm font-medium">300m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🚌 Στάση λεωφορείου</span>
                <span className="text-sm font-medium">50m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🚗 Πάρκινγκ</span>
                <span className="text-sm font-medium">150m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Υπηρεσίες</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">🏥 Νοσοκομείο</span>
                <span className="text-sm font-medium">800m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🏫 Σχολεία</span>
                <span className="text-sm font-medium">400m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🛒 Σούπερ μάρκετ</span>
                <span className="text-sm font-medium">200m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Αξιολόγηση Περιοχής</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">📈 Επενδυτικός δείκτης</span>
                <span className="text-sm font-medium text-green-600">8.5/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">🏘️ Ποιότητα περιοχής</span>
                <span className="text-sm font-medium text-green-600">9.2/10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">💰 Τιμές ακινήτων</span>
                <span className="text-sm font-medium text-blue-600">€3,200/m²</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AnalyticsTabContent = ({ building }: { building: Building }) => {
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [analyticsView, setAnalyticsView] = useState<'overview' | 'financial' | 'progress' | 'comparison'>('overview');

  // Mock analytics data
  const costBreakdown = [
    { category: 'Υλικά', amount: 450000, percentage: 45, color: 'bg-blue-500' },
    { category: 'Εργατικά', amount: 300000, percentage: 30, color: 'bg-green-500' },
    { category: 'Μηχανήματα', amount: 150000, percentage: 15, color: 'bg-yellow-500' },
    { category: 'Άλλα', amount: 100000, percentage: 10, color: 'bg-purple-500' }
  ];

  const monthlyProgress = [
    { month: 'Ιαν', planned: 10, actual: 8, cost: 85000 },
    { month: 'Φεβ', planned: 20, actual: 18, cost: 92000 },
    { month: 'Μαρ', planned: 35, actual: 32, cost: 98000 },
    { month: 'Απρ', planned: 50, actual: 48, cost: 105000 },
    { month: 'Μάι', planned: 65, actual: 62, cost: 89000 },
    { month: 'Ιουν', planned: 80, actual: 75, cost: 94000 },
    { month: 'Ιουλ', planned: 90, actual: 85, cost: 87000 }
  ];

  const kpis = {
    costEfficiency: 92.5,
    timeEfficiency: 88.7,
    qualityScore: 95.2,
    riskLevel: 'Χαμηλός',
    roi: 15.8,
    profitMargin: 12.3
  };

  const getEfficiencyColor = (value: number) => {
    if (value >= 90) return 'text-green-600 bg-green-50';
    if (value >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Advanced Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Προχωρημένη ανάλυση δεδομένων και KPIs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="text-sm border border-gray-300 rounded px-3 py-1"
          >
            <option value="1M">Τελευταίο μήνα</option>
            <option value="3M">Τελευταίους 3 μήνες</option>
            <option value="6M">Τελευταίους 6 μήνες</option>
            <option value="1Y">Τελευταίο έτος</option>
          </select>
          <Button variant="outline" size="sm">
            📊 Εξαγωγή Αναφοράς
          </Button>
        </div>
      </div>

      {/* Analytics Navigation */}
      <div className="flex gap-2">
        {[
          { id: 'overview', label: 'Επισκόπηση', icon: '📊' },
          { id: 'financial', label: 'Οικονομικά', icon: '💰' },
          { id: 'progress', label: 'Πρόοδος', icon: '📈' },
          { id: 'comparison', label: 'Σύγκριση', icon: '⚖️' }
        ].map((view) => (
          <Button
            key={view.id}
            variant={analyticsView === view.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAnalyticsView(view.id as any)}
          >
            {view.icon} {view.label}
          </Button>
        ))}
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{kpis.costEfficiency}%</div>
              <div className="text-xs text-muted-foreground">Κοστολογική Αποδοτικότητα</div>
              <div className={`text-xs px-2 py-1 rounded mt-1 ${getEfficiencyColor(kpis.costEfficiency)}`}>
                {kpis.costEfficiency >= 90 ? 'Άριστα' : kpis.costEfficiency >= 75 ? 'Καλά' : 'Χρήζει βελτίωσης'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{kpis.timeEfficiency}%</div>
              <div className="text-xs text-muted-foreground">Χρονική Αποδοτικότητα</div>
              <div className={`text-xs px-2 py-1 rounded mt-1 ${getEfficiencyColor(kpis.timeEfficiency)}`}>
                {kpis.timeEfficiency >= 90 ? 'Άριστα' : kpis.timeEfficiency >= 75 ? 'Καλά' : 'Χρήζει βελτίωσης'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{kpis.qualityScore}%</div>
              <div className="text-xs text-muted-foreground">Δείκτης Ποιότητας</div>
              <div className={`text-xs px-2 py-1 rounded mt-1 ${getEfficiencyColor(kpis.qualityScore)}`}>
                Εξαιρετικό
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{kpis.roi}%</div>
              <div className="text-xs text-muted-foreground">ROI</div>
              <div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">
                Πάνω από στόχο
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{kpis.profitMargin}%</div>
              <div className="text-xs text-muted-foreground">Περιθώριο Κέρδους</div>
              <div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">
                Εντός στόχων
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{kpis.riskLevel}</div>
              <div className="text-xs text-muted-foreground">Επίπεδο Κινδύνου</div>
              <div className="text-xs px-2 py-1 rounded mt-1 bg-green-50 text-green-600">
                Υπό έλεγχο
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      {analyticsView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Ανάλυση Κόστους</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBreakdown.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.amount.toLocaleString('el-GR')}€ ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-2">💡 Ανάλυση</div>
                <p className="text-sm text-blue-700">
                  Το κόστος υλικών είναι 5% υψηλότερο από τον μέσο όρο της αγοράς. 
                  Συνιστάται επαναδιαπραγμάτευση με προμηθευτές.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Πρόοδος vs Προγραμματισμός</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyProgress.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month.month}</span>
                      <span className="text-xs text-muted-foreground">
                        Προγρ: {month.planned}% | Πραγμ: {month.actual}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="h-4 bg-blue-200 rounded-full"
                          style={{ width: `${month.planned}%` }}
                        ></div>
                        <div 
                          className="absolute top-0 h-4 bg-blue-500 rounded-full"
                          style={{ width: `${month.actual}%` }}
                        ></div>
                      </div>
                      <div className="absolute right-2 top-0 text-xs font-medium text-white">
                        {month.actual}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsView === 'financial' && (
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {building.totalValue.toLocaleString('el-GR')}€
                  </div>
                  <div className="text-xs text-muted-foreground">Συνολικός Προϋπολογισμός</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {(building.totalValue * 0.75).toLocaleString('el-GR')}€
                  </div>
                  <div className="text-xs text-muted-foreground">Δαπανηθέν Κόστος</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {(building.totalValue * 0.25).toLocaleString('el-GR')}€
                  </div>
                  <div className="text-xs text-muted-foreground">Υπόλοιπο Budget</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {((building.totalValue / building.totalArea)).toLocaleString('el-GR')}€/m²
                  </div>
                  <div className="text-xs text-muted-foreground">Κόστος ανά m²</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Ταμειακές Ροές</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyProgress.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium w-12">{month.month}</div>
                      <div className="text-sm text-muted-foreground">
                        Μηνιαία δαπάνη: {month.cost.toLocaleString('el-GR')}€
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        Σωρευτικό: {monthlyProgress.slice(0, index + 1).reduce((sum, m) => sum + m.cost, 0).toLocaleString('el-GR')}€
                      </div>
                      <div className={`text-sm px-2 py-1 rounded ${
                        month.cost < 95000 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {month.cost < 95000 ? 'Εντός budget' : 'Προσοχή'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {analyticsView === 'progress' && (
        <Card>
          <CardHeader>
            <CardTitle>Ανάλυση Προόδου</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{building.progress}%</div>
                  <div className="text-sm text-muted-foreground">Συνολική Πρόοδος</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${building.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">88%</div>
                  <div className="text-sm text-muted-foreground">Αποδοτικότητα</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full w-[88%] transition-all duration-500"></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
                  <div className="text-sm text-muted-foreground">Ημέρες Καθυστέρηση</div>
                  <div className="mt-2 text-xs text-orange-600">
                    Εντός αποδεκτών ορίων
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">🎯 Προβλέψεις & Συστάσεις</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-green-700 mb-2">✅ Θετικά Σημεία:</div>
                    <ul className="space-y-1 text-green-600">
                      <li>• Ποιότητα εργασιών πάνω από τα standards</li>
                      <li>• Κόστος υλικών εντός προϋπολογισμού</li>
                      <li>• Ομάδα εργασίας αποδοτική</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-orange-700 mb-2">⚠️ Προτεινόμενες Βελτιώσεις:</div>
                    <ul className="space-y-1 text-orange-600">
                      <li>• Επιτάχυνση ηλ/μηχ εγκαταστάσεων</li>
                      <li>• Προπαραγγελία υλικών τελικών εργασιών</li>
                      <li>• Συντονισμός με τρίτους (ανελκυστήρες)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analyticsView === 'comparison' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Σύγκριση με Παρόμοια Έργα</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: 'Κόστος/m²', current: '700€', average: '750€', status: 'better' },
                  { metric: 'Χρόνος ολοκλήρωσης', current: '36 μήνες', average: '32 μήνες', status: 'worse' },
                  { metric: 'Ποιότητα εργασιών', current: '9.5/10', average: '8.2/10', status: 'better' },
                  { metric: 'Αποδοτικότητα', current: '88%', average: '82%', status: 'better' }
                ].map((item) => (
                  <div key={item.metric} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.metric}</div>
                      <div className="text-sm text-muted-foreground">
                        Τρέχον: {item.current} | Μέσος όρος: {item.average}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded text-sm ${
                      item.status === 'better' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {item.status === 'better' ? '↗️ Καλύτερα' : '↘️ Χειρότερα'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
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
              <Building2 className="h-5 w-5 text-white" />
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
              <GeneralTabContent building={building} />
            </TabsContent>

            <TabsContent value="timeline" className="mt-0">
              <TimelineTabContent building={building} />
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <MapTabContent building={building} />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsTabContent building={building} />
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
