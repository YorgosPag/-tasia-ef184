

'use client';

import React from 'react';
import type { ContactFormProps } from './ContactForm/types';
import { useWatchedFields } from './ContactForm/hooks/useWatchedFields';
import { LegalPersonLayout } from './ContactForm/layout/LegalPersonLayout';
import { NaturalPersonLayout } from './ContactForm/layout/NaturalPersonLayout';
import { useSearchParams } from 'next/navigation';

export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const { entityType } = useWatchedFields(form);
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');

  const mapEntityTypeToTab = (type: typeof entityType) => {
    switch (type) {
      case 'Φυσικό Πρόσωπο': return 'individual';
      case 'Νομικό Πρόσωπο': return 'legal';
      case 'Δημ. Υπηρεσία': return 'public';
      default: return 'individual';
    }
  };

  const handleEntityTypeChange = (type: typeof entityType) => {
    form.setValue('entityType', type, { shouldDirty: true });
    // The URL update is now handled in the edit page itself via a useEffect
  };
  
  const formEntityType = form.watch('entityType');

  if (formEntityType === 'Νομικό Πρόσωπο' || formEntityType === 'Δημ. Υπηρεσία') {
    return <LegalPersonLayout form={form} onFileSelect={onFileSelect} />;
  }

  return (
    <NaturalPersonLayout
      form={form}
      onFileSelect={onFileSelect}
      openSections={openSections}
      onOpenChange={onOpenChange}
    />
  );
}
