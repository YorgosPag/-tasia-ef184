'use client';

import React, { useState, useEffect } from 'react';
import { StorageUnit } from '@/lib/types/storage';
import { StorageFormHeader } from './storage-form-header';
import { StorageFormBasicInfo } from './storage-form-basic-info';
import { StorageFormLocationSpecs } from './storage-form-location-specs';
import { StorageFormFeatures } from './storage-form-features';
import { StorageFormFooter } from './storage-form-footer';
import { useFormValidation } from './storage-form-hooks';
import { generateAutoCode } from './storage-form-utils';

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

  const { errors, validateForm } = useFormValidation();

  useEffect(() => {
    if (unit) {
      setFormData(unit);
    }
  }, [unit]);

  const handleGenerateAutoCode = () => {
    const autoCode = generateAutoCode(formData.type, formData.floor);
    setFormData(prev => ({ ...prev, code: autoCode }));
  };

  const updateField = (field: keyof StorageUnit, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm(formData)) {
      const unitToSave: StorageUnit = {
        id: unit?.id || `${formData.type}_${Date.now()}`,
        code: formData.code!,
        type: formData.type!,
        floor: formData.floor!,
        area: formData.area!,
        price: formData.price!,
        status: formData.status!,
        description: formData.description!,
        building: formData.building!,
        project: formData.project!,
        company: formData.company!,
        linkedProperty: formData.linkedProperty!,
        coordinates: formData.coordinates!,
        features: formData.features!
      };
      
      onSave(unitToSave);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <StorageFormHeader
          unitType={formData.type}
          buildingName={building.name}
          projectName={building.project}
          isEditing={!!unit}
          onCancel={onCancel}
        />

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <StorageFormBasicInfo
              formData={formData}
              errors={errors}
              updateField={updateField}
              onGenerateAutoCode={handleGenerateAutoCode}
            />
            <StorageFormLocationSpecs
              formData={formData}
              errors={errors}
              updateField={updateField}
              setFormData={setFormData}
              isEditing={!!unit}
            />
            <StorageFormFeatures
              formData={formData}
              updateField={updateField}
            />
          </div>
          <StorageFormFooter onCancel={onCancel} />
        </form>
      </div>
    </div>
  );
}
