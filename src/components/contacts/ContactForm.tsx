

'use client';

import React from 'react';
import type { ContactFormProps } from './ContactForm/types';
import { useWatchedFields } from './ContactForm/hooks/useWatchedFields';
import { LegalPersonLayout } from './ContactForm/layout/LegalPersonLayout';
import { NaturalPersonLayout } from './ContactForm/layout/NaturalPersonLayout';
import { useParams } from 'next/navigation';
import { EntityType } from '@/shared/lib/validation/contactSchema';

export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const { entityType } = useWatchedFields(form);

  if (entityType === 'Νομικό Πρόσωπο') {
    return <LegalPersonLayout form={form} onFileSelect={onFileSelect} />;
  }

  // Default to NaturalPersonLayout for 'Φυσικό Πρόσωπο', 'Δημ. Υπηρεσία' and as a fallback
  return (
    <NaturalPersonLayout
      form={form}
      onFileSelect={onFileSelect}
      openSections={openSections}
      onOpenChange={onOpenChange}
    />
  );
}
