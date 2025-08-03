'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Trash2 } from 'lucide-react';
import { StorageUnit, StorageType } from '@/types/storage';
import { commonFeatures } from './storage-form-utils';

interface StorageFormFeaturesProps {
  formData: Partial<StorageUnit>;
  updateField: (field: keyof StorageUnit, value: any) => void;
}

export function StorageFormFeatures({
  formData,
  updateField,
}: StorageFormFeaturesProps) {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      const updatedFeatures = [...(formData.features || []), newFeature.trim()];
      updateField('features', updatedFeatures);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    const updatedFeatures = formData.features?.filter(f => f !== featureToRemove) || [];
    updateField('features', updatedFeatures);
  };

  const addCommonFeature = (feature: string) => {
    if (!formData.features?.includes(feature)) {
      const updatedFeatures = [...(formData.features || []), feature];
      updateField('features', updatedFeatures);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Χαρακτηριστικά
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Συνήθη Χαρακτηριστικά</Label>
          <div className="flex flex-wrap gap-2">
            {(commonFeatures[formData.type as StorageType] || []).map(feature => (
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
  );
}
