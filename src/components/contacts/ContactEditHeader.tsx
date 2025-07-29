
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
  const photoUrls = form.watch('photoUrls');
  const currentPhotoUrl = photoUrls?.[viewParam] || '';

  return (
    <div className="sticky top-0 bg-background py-2 z-10 border-b mb-4 space-y-4">
        {/* Top Bar: Back, Title, Save */}
        <div className="flex items-center justify-between px-1">
            <div className="w-1/3">
                 <Button type="button" variant="outline" size="sm" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Πίσω στις Επαφές
                </Button>
            </div>
            <div className="w-1/3 text-center">
                 <h2 className="text-xl font-bold text-foreground truncate" title={contactName}>
                    {contactName}
                </h2>
            </div>
            <div className="w-1/3 flex justify-end">
                <Button type="submit" form="contact-form" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Αποθήκευση Αλλαγών
                </Button>
            </div>
        </div>
      
      {/* Bottom Bar: Image Uploader */}
      <div className="flex items-start justify-start px-1">
        <ImageUploader
          entityType={entityType}
          entityId={contactId}
          initialImageUrl={currentPhotoUrl}
          onFileSelect={onFileSelect}
        />
      </div>
    </div>
  );
}
