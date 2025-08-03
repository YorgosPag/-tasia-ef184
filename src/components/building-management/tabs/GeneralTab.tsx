'use client';

import React, { useState, useEffect } from 'react';
import type { Building } from '@/types/building';
import { cn } from '@/lib/utils';
import { GeneralHeader } from './general/GeneralHeader';
import { GeneralInfoForm } from './general/GeneralInfoForm';
import { GeneralSpecsForm } from './general/GeneralSpecsForm';
import { GeneralProgress } from './general/GeneralProgress';

export function GeneralTab({ building }: { building: Building }) {
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
    city: building.city || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isEditing) return;

    const timeoutId = setTimeout(() => {
      setAutoSaving(true);
      setTimeout(() => {
        setAutoSaving(false);
        setLastSaved(new Date());
        console.log('Auto-saved:', formData);
      }, 1000);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, isEditing]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Το όνομα είναι υποχρεωτικό';
    if (formData.totalArea <= 0)
      newErrors.totalArea = 'Η επιφάνεια πρέπει να είναι μεγαλύτερη από 0';
    if (formData.builtArea > formData.totalArea)
      newErrors.builtArea =
        'Η δομημένη επιφάνεια δεν μπορεί να υπερβαίνει τη συνολική';
    if (formData.floors <= 0)
      newErrors.floors = 'Οι όροφοι πρέπει να είναι τουλάχιστον 1';
    if (formData.units <= 0)
      newErrors.units = 'Οι μονάδες πρέπει να είναι τουλάχιστον 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsEditing(false);
      setLastSaved(new Date());
      console.log('Manual save:', formData);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'totalArea' && value > 0 && formData.builtArea === 0) {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        builtArea: Math.round(value * 0.8),
      }));
    }
  };

  return (
    <div className="space-y-6">
      <GeneralHeader
        building={building}
        isEditing={isEditing}
        autoSaving={autoSaving}
        lastSaved={lastSaved}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
      />
      <GeneralInfoForm
        formData={formData}
        errors={errors}
        isEditing={isEditing}
        updateField={updateField}
      />
      <GeneralSpecsForm
        formData={formData}
        errors={errors}
        isEditing={isEditing}
        updateField={updateField}
      />
      <GeneralProgress building={building} />
    </div>
  );
}
