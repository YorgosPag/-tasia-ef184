
'use client';

import React from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import type { ContactFormValues } from '@/shared/lib/validation/contactSchema';

interface ContactEditHeaderProps {
  contactName: string;
  isSubmitting: boolean;
  isDirty: boolean;
  onBack: () => void;
  form: UseFormReturn<ContactFormValues>;
  onFileSelect: (file: File | null) => void;
}

export function ContactEditHeader({
  contactName,
  isSubmitting,
  isDirty,
  onBack,
  form,
  onFileSelect,
}: ContactEditHeaderProps) {
  const entityType = useWatch({ control: form.control, name: 'entityType' });
  const contactId = form.getValues('id');
  
  const viewParam = entityType === 'Φυσικό Πρόσωπο' ? 'individual' : (entityType === 'Νομικό Πρόσωπο' ? 'legal' : 'public');
  const currentPhotoUrl = form.watch('photoUrls')?.[viewParam] || '';
  const isLegalEntity = entityType === 'Νομικό Πρόσωπο' || entityType === 'Δημ. Υπηρεσία';

  return (
    <div className="sticky top-0 bg-background py-2 z-10 border-b mb-4">
      {/* Top row: Back button, Title (for non-legal), Save button */}
      <div className="flex items-center justify-between mb-2 px-1">
        <Button type="button" variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Πίσω στις Επαφές
        </Button>
        {!isLegalEntity && (
            <h2 className="text-xl font-bold text-foreground text-center flex-1 mx-4 truncate" title={contactName}>
              {contactName}
            </h2>
        )}
        <Button type="submit" form="contact-form" disabled={isSubmitting || !isDirty} className={isLegalEntity ? 'ml-auto' : ''}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Αποθήκευση Αλλαγών
        </Button>
      </div>

      {/* Second row for Legal Entities: Logo and Title */}
      {isLegalEntity && (
        <div className="flex items-center justify-start gap-4 px-1">
            <div className="flex-shrink-0 w-32">
                 <ImageUploader 
                    entityType={entityType}
                    entityId={contactId}
                    initialImageUrl={currentPhotoUrl}
                    onFileSelect={onFileSelect}
                />
            </div>
            <div className="flex-1 text-center">
                 <h2 className="text-xl font-bold text-foreground truncate" title={contactName}>
                    {contactName}
                </h2>
            </div>
            <div className="w-32 flex-shrink-0"></div> {/* Spacer to balance the layout */}
        </div>
      )}
      
      {/* ImageUploader for non-legal entities */}
      {!isLegalEntity && (
        <div className="flex items-start justify-center px-1 mt-4">
          <ImageUploader
            entityType={entityType}
            entityId={contactId}
            initialImageUrl={currentPhotoUrl}
            onFileSelect={onFileSelect}
          />
        </div>
      )}
    </div>
  );
}
