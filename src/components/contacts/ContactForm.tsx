

'use client';

import React from 'react';
import type { ContactFormProps } from './ContactForm/types';
import { useWatchedFields } from './ContactForm/hooks/useWatchedFields';
import { LegalPersonLayout } from './ContactForm/layout/LegalPersonLayout';
import { NaturalPersonLayout } from './ContactForm/layout/NaturalPersonLayout';

export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const { entityType } = useWatchedFields(form);

  return entityType === 'Νομικό Πρόσωπο' ? (
    <LegalPersonLayout form={form} onFileSelect={onFileSelect} />
  ) : (
    <NaturalPersonLayout
      form={form}
      onFileSelect={onFileSelect}
      openSections={openSections}
      onOpenChange={onOpenChange}
    />
  );
}
