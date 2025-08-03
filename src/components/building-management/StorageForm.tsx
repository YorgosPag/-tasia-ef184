'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  X, 
  Save, 
  Package, 
  Car, 
  Building, 
  Ruler, 
  Euro, 
  MapPin,
  Link,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { StorageUnit, StorageType, StorageStatus } from '@/types/storage';
import { cn } from '@/lib/utils';

interface StorageFormProps {
  unit: StorageUnit | null;
  building: {
    id: number;
    name: string;
    project: string;
    company: string;
  };
  onSave: (unit: StorageUnit) => void;
  onCancel: () => void;
}

export function StorageForm({ unit, building, onSave, onCancel }: StorageFormProps) {
  const [formData, setFormData] = useState<Partial<StorageUnit>>({
    code: '',
    type: 'storage',
    floor: 'Υπόγειο',
    area: 0,
    price: 0,
    status: 'available',
    description: '',
    building: building.name,
    project: building.project,
    company: building.company,
    linkedProperty: null,
    coordinates: { x: 0, y: 0 },
    features: []
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [newFeature, setNewFeature] = useState('');
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  // Available floors (could come from building data)
  const availableFloors = [
    'Υπόγειο 2',
    'Υπόγειο 1', 
    'Υπόγειο',
    'Ισόγειο',
    '1ος Όροφος',
    '2ος Όροφος',
    '3ος Όροφος',
    '4ος Όροφος',
    '5ος Όροφος',
    '6ος Όροφος',
    '7ος Όροφος'
  ];

  // Common features for different types
  const commonFeatures = {
    storage: [
      'Ηλεκτρικό ρεύμα',
      'Φυσικός φωτισμός',
      'Τεχνητός φωτισμός',
      'Αεροθαλάμος',
      'Ασφάλεια',
      'Πρόσβαση ανελκυστήρα',
      'Υδραυλικές εγκαταστάσεις'
    ],
    parking: [
      'Καλυμμένη θέση',
      'Ανοιχτή θέση',
      'Πρίζα φόρτισης',
      'Ηλεκτρικό ρεύμα',
      'Φωτισμός',
      'Ασφάλεια',
      'Εύκολη πρόσβαση',
      'Θέση για μεγάλο όχημα'
    ]
  };

  // Load existing unit data
  useEffect(() => {
    if (unit) {
      setFormData(unit);
    }
  }, [unit]);

  // Auto-calculate price based on area and type
  useEffect(() => {
    if (formData.area && formData.area > 0 && !unit) {
      setIsCalculatingPrice(true);
      
      // Simulate price calculation delay
      const timeout = setTimeout(() => {
        const basePricePerSqm = formData.type === 'storage' ? 400 : 200;
        const floorMultiplier = formData.floor === 'Υπόγειο' ? 1.0 : 
                              formData.floor === 'Ισόγειο' ? 1.2 : 1.1;
        
        const calculatedPrice = Math.round(formData.area * basePricePerSqm * floorMultiplier);
        
        setFormData(prev => ({ ...prev, price: calculatedPrice }));
        setIsCalculatingPrice(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [formData.area, formData.type, formData.floor, unit]);

  // Generate auto code
  const generateAutoCode = () => {
    const typePrefix = formData.type === 'storage' ? 'A' : 'P';
    const floorPrefix = formData.floor === 'Υπόγειο' ? 'B' : 
                       formData.floor === 'Ισόγειο' ? 'G' : 'F';
    const randomNum = Math.floor(Math.random() * 99) + 1;
    
    const autoCode = `${typePrefix}_${floorPrefix}${randomNum.toString().padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, code: autoCode }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.code?.trim()) {
      newErrors.code = 'Ο κωδικός είναι υποχρεωτικός';
    }
    if (!formData.area || formData.area <= 0) {
      newErrors.area = 'Η επιφάνεια πρέπει να είναι μεγαλύτερη από 0';
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Η τιμή πρέπει να είναι μεγαλύτερη από 0';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Η περιγραφή είναι υποχρεωτική';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const unitToSave: StorageUnit = {
        id: unit?.id || `${formData.type}_${Date.now()}`,
        code: formData.code!,
        type: formData.type as StorageType,
        floor: formData.floor!,
        area: formData.area!,
        price: formData.price!,
        status: formData.status as StorageStatus,
        description: formData.description!,
        building: formData.building!,
        project: formData.project!,
        company: formData.company!,
        linkedProperty: formData.linkedProperty,
        coordinates: formData.coordinates!,
        features: formData.features!
      };
      
      onSave(unitToSave);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== featureToRemove) || []
    }));
  };

  const addCommonFeature = (feature: string) => {
    if (!formData.features?.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), feature]
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg shadow-sm",
                formData.type === 'storage' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
              )}>
                {formData.type === 'storage' ? <Package className="w-5 h-5" /> : <Car className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {unit ? 'Επεξεργασία' : 'Νέα'} {formData.type === 'storage' ? 'Αποθήκη' : 'Θέση Στάθμευσης'}
                </h2>
                <p className="text-sm text-gray-600">
                  {building.name} - {building.project}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Βασικές Πληροφορίες
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Κωδικός *</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.code || ''}
                        onChange={(e) => updateField('code', e.target.value)}
                        className={cn(errors.code && "border-red-500")}
                        placeholder="π.χ. A_B01"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={generateAutoCode}
                      >
                        Auto
                      </Button>
                    </div>
                    {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Τύπος *</Label>
                    <select
                      value={formData.type}
                      onChange={(e) => updateField('type', e.target.value)}
                      className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="storage">Αποθήκη</option>
                      <option value="parking">Θέση Στάθμευσης</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Κατάσταση *</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateField('status', e.target.value)}
                      className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="available">Διαθέσιμο</option>
                      <option value="sold">Πωλήθηκε</option>
                      <option value="reserved">Κρατημένο</option>
                      <option value="maintenance">Συντήρηση</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Περιγραφή *</Label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    className={cn(errors.description && "border-red-500")}
                    placeholder="Περιγραφή της μονάδας..."
                    rows={2}
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Location & Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Τοποθεσία & Προδιαγραφές
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Όροφος *</Label>
                    <select
                      value={formData.floor}
                      onChange={(e) => updateField('floor', e.target.value)}
                      className="h-10 w-full px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {availableFloors.map(floor => (
                        <option key={floor} value={floor}>{floor}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Επιφάνεια (m²) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.area || ''}
                      onChange={(e) => updateField('area', parseFloat(e.target.value) || 0)}
                      className={cn(errors.area && "border-red-500")}
                      placeholder="0.00"
                    />
                    {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Τιμή (€) *</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                        className={cn(errors.price && "border-red-500")}
                        placeholder="0.00"
                      />
                      {isCalculatingPrice && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                    {formData.area && formData.price && (
                      <p className="text-xs text-gray-500">
                        {Math.round(formData.price / formData.area).toLocaleString('el-GR')} €/m²
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Συνδεδεμένο Ακίνητο</Label>
                    <Input
                      value={formData.linkedProperty || ''}
                      onChange={(e) => updateField('linkedProperty', e.target.value || null)}
                      placeholder="π.χ. Δ2.1"
                    />
                    <p className="text-xs text-gray-500">
                      Κωδικός ακινήτου που συνοδεύει αυτή τη μονάδα
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Συντεταγμένες (X, Y)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={formData.coordinates?.x || ''}
                        onChange={(e) => updateField('coordinates', {
                          ...formData.coordinates,
                          x: parseFloat(e.target.value) || 0
                        })}
                        placeholder="X"
                      />
                      <Input
                        type="number"
                        value={formData.coordinates?.y || ''}
                        onChange={(e) => updateField('coordinates', {
                          ...formData.coordinates,
                          y: parseFloat(e.target.value) || 0
                        })}
                        placeholder="Y"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Θέση στον χάρτη του κτιρίου
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Χαρακτηριστικά
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Add Common Features */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Συνήθη Χαρακτηριστικά</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonFeatures[formData.type as StorageType]?.map(feature => (
                      <Button
                        key={feature}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addCommonFeature(feature)}
                        disabled={formData.features?.includes(feature)}
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {feature}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Feature Input */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Προσθήκη Χαρακτηριστικού</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Νέο χαρακτηριστικό..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Selected Features */}
                {formData.features && formData.features.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Επιλεγμένα Χαρακτηριστικά</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="ml-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              * Υποχρεωτικά πεδία
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Ακύρωση
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {unit ? 'Ενημέρωση' : 'Αποθήκευση'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}