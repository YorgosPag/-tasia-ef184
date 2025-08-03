'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Home, 
  MapPin, 
  Ruler, 
  Euro, 
  Calendar, 
  User, 
  FileText, 
  Camera, 
  Video,
  Edit,
  Save,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Property, StorageUnit } from '@/types/property';
import { PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, PROPERTY_STATUS_COLORS, STORAGE_TYPE_LABELS } from '@/types/property';

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR');
  };

  return (
    <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-background/50 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">{property.code}</h2>
              <Badge className={cn("text-xs", PROPERTY_STATUS_COLORS[property.status])}>
                {PROPERTY_STATUS_LABELS[property.status]}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {PROPERTY_TYPE_LABELS[property.type]} - Όροφος {property.floor}
            </p>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Ruler className="w-4 h-4" />
                <span>{property.area} m²</span>
              </div>
              <div className="flex items-center gap-1">
                <Euro className="w-4 h-4" />
                <span>{formatCurrency(property.price)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
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
                <Edit className="w-4 h-4 mr-2" />
                Επεξεργασία
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <main className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="general" className="flex flex-col h-full">
          <TabsList className="shrink-0 flex-wrap h-auto justify-start mb-4">
            <TabsTrigger value="general">Γενικά</TabsTrigger>
            <TabsTrigger value="details">Κατοψης Επιπέδων</TabsTrigger>
            <TabsTrigger value="photos">Φωτογραφίες</TabsTrigger>
            <TabsTrigger value="videos">Βίντεο</TabsTrigger>
            <TabsTrigger value="contracts">Συμβόλαια</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="flex-grow overflow-auto space-y-6">
            {/* General Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Στοιχεία Ακινήτου
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Τύπος Ακινήτου</Label>
                    <Select defaultValue={property.type} disabled={!isEditing}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Κωδικός</Label>
                    <Input defaultValue={property.code} className="h-10" disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Προσανατολισμός</Label>
                    <Select defaultValue={property.orientation} disabled={!isEditing}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">Βόρεια</SelectItem>
                        <SelectItem value="south">Νότια</SelectItem>
                        <SelectItem value="east">Ανατολικά</SelectItem>
                        <SelectItem value="west">Δυτικά</SelectItem>
                        <SelectItem value="northeast">Βορειοανατολικά</SelectItem>
                        <SelectItem value="northwest">Βορειοδυτικά</SelectItem>
                        <SelectItem value="southeast">Νοτιοανατολικά</SelectItem>
                        <SelectItem value="southwest">Νοτιοδυτικά</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Αριθμός Επιπέδων</Label>
                    <Input type="number" defaultValue="1" className="h-10" disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Πλήθος Δωματίων</Label>
                    <Input type="number" defaultValue={property.rooms} className="h-10" disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Πλήθος Λουτρών</Label>
                    <Input type="number" defaultValue={property.bathrooms} className="h-10" disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Πλήθος Αποθηκών στο Διαμέρισμα</Label>
                    <Input type="number" defaultValue="0" className="h-10" disabled={!isEditing} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Καθαρά (τ.μ.)</Label>
                    <Input type="number" step="0.01" defaultValue={property.area} className="h-10" disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Μικτά (τ.μ.)</Label>
                    <Input type="number" step="0.01" defaultValue="72.20" className="h-10" disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Κοινόχρηστα (τ.μ.)</Label>
                    <Input type="number" step="0.01" defaultValue="14.45" className="h-10" disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ημιυπαίθρια (τ.μ.)</Label>
                    <Input type="number" step="0.01" defaultValue="11.81" className="h-10" disabled={!isEditing} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Αρχιτεκτ. Προσοχές</Label>
                    <Input type="number" step="0.01" defaultValue="0.00" className="h-10" disabled={!isEditing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Μπαλκόνια (τ.μ.)</Label>
                    <Input type="number" step="0.01" defaultValue="9.83" className="h-10" disabled={!isEditing} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Storage Units */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Παρακολουθήματα - Αποθήκες Γγενείου
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Είδος</TableHead>
                      <TableHead>Κωδικός</TableHead>
                      <TableHead>Τύπος</TableHead>
                      <TableHead>Επιφάνεια</TableHead>
                      <TableHead>Τιμή</TableHead>
                      <TableHead>Αντ.Αξία</TableHead>
                      <TableHead>Διαδρομή</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {property.storageUnits.map((storage, index) => (
                      <TableRow key={storage.id}>
                        <TableCell>
                          <Badge variant="outline" className="bg-orange-100 text-orange-800">
                            {STORAGE_TYPE_LABELS[storage.type as keyof typeof STORAGE_TYPE_LABELS]}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{storage.code}</TableCell>
                        <TableCell>Σκεπαστή</TableCell>
                        <TableCell>{storage.area} τ.μ.</TableCell>
                        <TableCell>{storage.price}</TableCell>
                        <TableCell>1004.4</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          \\\\Server\\shared\\6. erga\\Palaiologou\\Paleol_...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sale Information */}
            {property.status === 'sold' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Στοιχεία Πώλησης
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Αγοραστής</Label>
                      <Input defaultValue={property.buyer || ""} className="h-10" disabled={!isEditing} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Κατάσταση</Label>
                      <Select defaultValue={property.status} disabled={!isEditing}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROPERTY_STATUS_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Προεσδοκιμένη Τιμή Πώλησης Ακίνητου</Label>
                      <Input type="number" step="0.01" defaultValue="100000.00" className="h-10" disabled={!isEditing} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Αντικειμενική Αξία Ακινήτου</Label>
                      <Input type="number" step="0.01" defaultValue="0.00" className="h-10" disabled={!isEditing} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Προεσδοκιμένη Τιμή Πώλησης Παρακολουθημάτων</Label>
                      <Input type="number" step="0.01" defaultValue="4490.00" className="h-10" disabled={!isEditing} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Συνολική Τιμή Πώλησης</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        defaultValue="104490.00" 
                        className="h-10 font-bold text-green-600" 
                        disabled={!isEditing} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Συνολική Αντικειμενική Αξία</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        defaultValue="1004.40" 
                        className="h-10 font-bold text-blue-600" 
                        disabled={!isEditing} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="flex-grow overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle>Κατοψης Επιπέδων Πολεοδομίας</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
                  Περιεχόμενο κάτοψης θα εμφανιστεί εδώ
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="photos" className="flex-grow overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Φωτογραφίες
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
                  Δεν υπάρχουν φωτογραφίες
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos" className="flex-grow overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Βίντεο
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
                  Δεν υπάρχουν βίντεο
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contracts" className="flex-grow overflow-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Συμβόλαια
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Πελάτης</Label>
                  <Input defaultValue="ΚΕΛΕΣΙΔΗ ΠΕΛΛΕΝΑ" className="h-10" disabled={!isEditing} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Προσύμφωνο</Label>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="430" className="h-10" disabled={!isEditing} />
                    <span className="text-sm text-muted-foreground">Ημερ. Συμβολαίου</span>
                    <Input defaultValue="25/1/2008" className="h-10" disabled={!isEditing} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Αρχείο Συμβολαίου</Label>
                  <Input 
                    defaultValue="\\\\Server\\shared\\6. erga\\Palaiologou\\Paleol_Gen\\Paleol_Gen_Symbolaia\\Προσύμφωνο ΚΞΛεσσοδι Γιελένα 430 25-1-08 OCR.pdf"
                    className="h-10 text-xs" 
                    disabled={!isEditing} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Συμβολαιογράφος</Label>
                  <Input defaultValue="ΣΑΓΕΠΙΔΗ ΣΤΥΛΙΑΝΗ" className="h-10" disabled={!isEditing} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Οριστικό Συμβόλαιο</Label>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="17518" className="h-10" disabled={!isEditing} />
                    <span className="text-sm text-muted-foreground">Ημερ. Συμβολαίου</span>
                    <Input defaultValue="1/9/2011" className="h-10" disabled={!isEditing} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Αρχείο Συμβολαίου</Label>
                  <Input 
                    defaultValue="\\\\Server\\shared\\6. erga\\Palaiologou\\Paleol_Gen\\Paleol_Gen_Symbolaia\\Οριστικό Κελεσσοδι Γιελένα 17518 01-09-2011 OCR.pdf"
                    className="h-10 text-xs" 
                    disabled={!isEditing} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Συμβολαιογράφος</Label>
                  <Input defaultValue="ΛΑΖΑΡΙΔΟΥ - ΓΡΗΓΟΡΙΑΔΟΥ ΜΑΡΙΑ" className="h-10" disabled={!isEditing} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
