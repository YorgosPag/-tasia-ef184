'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeneralInfoFormProps {
  formData: { name: string; description: string };
  errors: { [key: string]: string };
  isEditing: boolean;
  updateField: (field: string, value: any) => void;
}

export function GeneralInfoForm({
  formData,
  errors,
  isEditing,
  updateField,
}: GeneralInfoFormProps) {
  return (
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
            className={cn(!isEditing && "bg-muted", errors.name && "border-red-500")}
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
  );
}
