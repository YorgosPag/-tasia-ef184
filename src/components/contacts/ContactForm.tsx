
'use client';

import React from 'react';
import type { ContactFormProps } from './ContactForm/types';
import { useWatchedFields } from './ContactForm/hooks/useWatchedFields';
import { LegalPersonLayout } from './ContactForm/layout/LegalPersonLayout';
import { NaturalPersonLayout } from './ContactForm/layout/NaturalPersonLayout';
import { ImageUploader } from './ImageUploader';

export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const { entityType } = useWatchedFields(form);
  const contactId = form.getValues('id');
  const viewParam = entityType === 'Φυσικό Πρόσωπο' ? 'individual' : (entityType === 'Νομικό Πρόσωπο' ? 'legal' : 'public');
  const photoUrls = form.watch('photoUrls');
  const currentPhotoUrl = photoUrls?.[viewParam] || '';

  const formContent = () => {
    if (entityType === 'Νομικό Πρόσωπο') {
      return <LegalPersonLayout form={form} onFileSelect={onFileSelect} />;
    }
  
    // Default to NaturalPersonLayout for 'Φυσικό Πρόσωπο', 'Δημ. Υπηρεσία' and as a fallback
    return (
      <NaturalPersonLayout
        form={form}
        onFileSelect={onFileSelect}
      />
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-32 flex-shrink-0">
        <ImageUploader
          entityType={entityType}
          entityId={contactId}
          initialImageUrl={currentPhotoUrl}
          onFileSelect={onFileSelect}
        />
      </div>
      <div className="flex-1">
        {formContent()}
      </div>
    </div>
  );
}
