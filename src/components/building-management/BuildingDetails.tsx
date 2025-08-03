
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
import { PhotosTab } from '@/app/projects/PhotosTab';
import { VideosTab } from '@/app/projects/VideosTab';
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

const GeneralTabContent = ({ building }: { building: Building }) => {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleSave = () => {
    // Here you would typically save to your backend
    setIsEditing(false);
    console.log('Saving building data:', formData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            ID: {building.id}
          </Badge>
          <Badge variant="outline">
            {building.category === 'residential' && 'Κατοικίες'}
            {building.category === 'commercial' && 'Εμπορικό'}
            {building.category === 'mixed' && 'Μικτή Χρήση'}
            {building.category === 'industrial' && 'Βιομηχανικό'}
          </Badge>
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

      {/* Building Title and Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Βασικές Πληροφορίες
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Τίτλος Κτιρίου</Label>
            <Input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={!isEditing}
              className={cn(!isEditing && "bg-muted")}
            />
          </div>
          <div className="space-y-2">
            <Label>Περιγραφή Κτιρίου</Label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              disabled={!isEditing}
              className={cn(!isEditing && "bg-muted")}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Τοποθεσία
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Διεύθυνση</Label>
              <Input 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
            <div className="space-y-2">
              <Label>Πόλη</Label>
              <Input 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Τεχνικά Χαρακτηριστικά
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Σύνολο Δόμησης (m²)</Label>
              <Input 
                type="number"
                value={formData.totalArea}
                onChange={(e) => setFormData({...formData, totalArea: parseFloat(e.target.value)})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
            <div className="space-y-2">
              <Label>Δομημένη Επιφάνεια (m²)</Label>
              <Input 
                type="number"
                value={formData.builtArea}
                onChange={(e) => setFormData({...formData, builtArea: parseFloat(e.target.value)})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
            <div className="space-y-2">
              <Label>Αριθμός Ορόφων</Label>
              <Input 
                type="number"
                value={formData.floors}
                onChange={(e) => setFormData({...formData, floors: parseInt(e.target.value)})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
            <div className="space-y-2">
              <Label>Αριθμός Μονάδων</Label>
              <Input 
                type="number"
                value={formData.units}
                onChange={(e) => setFormData({...formData, units: parseInt(e.target.value)})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Οικονομικά Στοιχεία
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Συνολική Αξία (€)</Label>
              <Input 
                type="number"
                value={formData.totalValue}
                onChange={(e) => setFormData({...formData, totalValue: parseFloat(e.target.value)})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
            <div className="space-y-2">
              <Label>Κόστος ανά m² (€)</Label>
              <Input 
                value={(formData.totalValue / formData.totalArea).toFixed(2)}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Προϋπολογισμός Status</Label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-400">Εντός Προϋπολογισμού</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Χρονοδιάγραμμα
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label>Ημερομηνία Έναρξης</Label>
              <Input 
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
            <div className="space-y-2">
              <Label>Ημερομηνία Παράδοσης</Label>
              <Input 
                type="date"
                value={formData.completionDate}
                onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                disabled={!isEditing}
                className={cn(!isEditing && "bg-muted")}
              />
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Πρόοδος Έργου</Label>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {building.progress}% Ολοκληρωμένο
              </Badge>
            </div>
            <Progress value={building.progress} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {building.progress < 25 && "Αρχικό στάδιο - Προετοιμασία"}
              {building.progress >= 25 && building.progress < 50 && "Υπό κατασκευή - Κύρια δομή"}
              {building.progress >= 50 && building.progress < 75 && "Προχωρημένο στάδιο - Ολοκληρώσεις"}
              {building.progress >= 75 && building.progress < 100 && "Τελικό στάδιο - Παραδοτέα"}
              {building.progress === 100 && "Ολοκληρωμένο έργο"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Project Files */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Αρχεία Έργου
            </CardTitle>
            <div className="flex gap-2">
              <label className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 cursor-pointer">
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    console.log('Επιλέχθηκαν αρχεία:', files.map(f => f.name));
                  }} 
                />
                <Folder className="w-4 h-4 mr-2" />
                Προσθήκη Αρχείων
              </label>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Νέα Φωτογραφία
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag & Drop Zone */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
              const files = Array.from(e.dataTransfer.files);
              console.log('Αρχεία που έπεσαν:', files.map(f => f.name));
            }}
          >
            <div className="space-y-2">
              <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                  Κάντε κλικ για επιλογή αρχείων
                </span>
                {' '}ή σύρετε και αφήστε εδώ
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, PDF, DOC, XLS μέχρι 10MB
              </p>
            </div>
          </div>

          {/* Existing Files */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Υπάρχοντα Αρχεία</h4>
            
            {/* File Item */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-medium text-xs">PDF</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Συγγραφή Υποχρεώσεων.pdf
                  </p>
                  <p className="text-xs text-gray-500">
                    2.4 MB • Ανέβηκε 15/02/2025
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
                      <AlertDialogDescription>
                        Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το αρχείο;
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                      <AlertDialogAction className={cn(buttonVariants({ variant: 'destructive' }))}>
                        Διαγραφή
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Another File Item */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xs">DOC</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Άδεια Οικοδομής.docx
                  </p>
                  <p className="text-xs text-gray-500">
                    1.8 MB • Ανέβηκε 10/02/2025
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
                      <AlertDialogDescription>
                        Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το αρχείο;
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                      <AlertDialogAction className={cn(buttonVariants({ variant: 'destructive' }))}>
                        Διαγραφή
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Image File */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-green-700" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Πρόοδος Κατασκευής Φεβ 2025.jpg
                  </p>
                  <p className="text-xs text-gray-500">
                    4.2 MB • Ανέβηκε σήμερα
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
                      <AlertDialogDescription>
                        Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το αρχείο;
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                      <AlertDialogAction className={cn(buttonVariants({ variant: 'destructive' }))}>
                        Διαγραφή
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Upload Progress (when uploading) */}
          <div className="hidden p-3 bg-blue-50 rounded-lg border border-blue-200" id="upload-progress">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Ανέβασμα σε εξέλιξη...
                </p>
                <div className="mt-1 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '45%'}}></div>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  2 από 5 αρχεία ολοκληρώθηκαν
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
            
      {/* Additional Files */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Συνημμένα Αρχεία</h4>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Προσθήκη Αρχείου
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 border rounded">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Κανονισμός Κτιρίου.pdf</span>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Download className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded">
              <FileText className="w-4 h-4 text-green-500" />
              <span className="text-sm">Άδεια Οικοδομής.pdf</span>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PhotosTabContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Φωτογραφίες Κτιρίου</h3>
      <Button>
        <Upload className="w-4 h-4 mr-2" />
        Ανέβασμα Φωτογραφιών
      </Button>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6].map((index) => (
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
              <GeneralTabContent building={building} />
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
