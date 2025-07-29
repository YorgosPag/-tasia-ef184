

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
  const params = useParams();
  const viewParam = params.view as EntityType;

  if (viewParam === 'legal' || viewParam === 'public') {
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
