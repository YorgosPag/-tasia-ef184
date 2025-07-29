
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { BasicInfoSection } from '../sections/BasicInfoSection';
import { IdentitySection } from '../sections/IdentitySection';
import { ContactSection } from '../sections/ContactSection';
import { SocialsSection } from '../sections/SocialsSection';
import { AddressSection } from '../sections/AddressSection';
import { NotesSection } from '../sections/NotesSection';
import type { ContactFormProps } from '../types';

export function NaturalPersonLayout({ form, onFileSelect }: ContactFormProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic">Βασικά Στοιχεία</TabsTrigger>
        <TabsTrigger value="identity">Ταυτότητα & ΑΦΜ</TabsTrigger>
        <TabsTrigger value="contact">Επικοινωνία & Socials</TabsTrigger>
        <TabsTrigger value="addresses">Διευθύνσεις</TabsTrigger>
        <TabsTrigger value="notes">Σημειώσεις</TabsTrigger>
      </TabsList>
      <TabsContent value="basic" className="mt-4">
        <BasicInfoSection form={form} onFileSelect={onFileSelect} />
      </TabsContent>
      <TabsContent value="identity" className="mt-4">
        <IdentitySection form={form} />
      </TabsContent>
      <TabsContent value="contact" className="mt-4">
        <ContactSection form={form} />
        <SocialsSection form={form} />
      </TabsContent>
      <TabsContent value="addresses" className="mt-4">
        <AddressSection form={form} />
      </TabsContent>
      <TabsContent value="notes" className="mt-4">
        <NotesSection form={form} />
      </TabsContent>
    </Tabs>
  );
}
