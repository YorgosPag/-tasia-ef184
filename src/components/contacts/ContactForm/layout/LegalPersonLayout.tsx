
'use client';

import React from 'react';
import { BasicInfoSection } from '../sections/BasicInfoSection';
import type { ContactFormProps } from '../types';
import { EntityTypeSelector } from './EntityTypeSelector';
import { EntityDataTabs } from './EntityDataTabs';


export function LegalPersonLayout({ form }: Pick<ContactFormProps, 'form' | 'onFileSelect'>) {
  return (
    <div className="w-full space-y-4">
      <EntityTypeSelector form={form} />
      <BasicInfoSection form={form} />
      <EntityDataTabs form={form} />
    </div>
  );
}
