
'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { Accordion } from '@/shared/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { BasicInfoSection } from './ContactForm/sections/BasicInfoSection';
import { IdentitySection } from './ContactForm/sections/IdentitySection';
import { ContactSection } from './ContactForm/sections/ContactSection';
import { AddressSection } from './ContactForm/sections/AddressSection';
import { JobSection } from './ContactForm/sections/JobSection';
import { NotesSection } from './ContactForm/sections/NotesSection';
import { type ContactFormProps } from './ContactForm/types';
import { SocialsSection } from './ContactForm/sections/SocialsSection';

export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const entityType = useWatch({ control: form.control, name: 'entityType' });

  const renderLegalPersonForm = () => (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={['personal']} className="w-full">
        <BasicInfoSection form={form} onFileSelect={onFileSelect} />
      </Accordion>
       <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Βασικά Στοιχεία</TabsTrigger>
          <TabsTrigger value="contact">Επικοινωνία</TabsTrigger>
          <TabsTrigger value="addresses">Διευθύνσεις</TabsTrigger>
          <TabsTrigger value="notes">Σημειώσεις</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="mt-4">
            <Accordion type="multiple" defaultValue={['identity', 'job']} className="w-full space-y-2">
                <IdentitySection form={form} />
                <JobSection form={form} />
            </Accordion>
        </TabsContent>
        <TabsContent value="contact" className="mt-4">
            <Accordion type="multiple" defaultValue={['contact', 'socials']} className="w-full space-y-2">
                <ContactSection form={form} />
                <SocialsSection form={form} />
            </Accordion>
        </TabsContent>
        <TabsContent value="addresses" className="mt-4">
             <Accordion type="multiple" defaultValue={['addresses']} className="w-full">
                <AddressSection form={form} />
            </Accordion>
        </TabsContent>
        <TabsContent value="notes" className="mt-4">
            <Accordion type="multiple" defaultValue={['notes']} className="w-full">
                <NotesSection form={form} />
            </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderDefaultForm = () => (
     <Accordion type="multiple" value={openSections} onValueChange={onOpenChange} className="w-full">
      <BasicInfoSection form={form} onFileSelect={onFileSelect} />
      <IdentitySection form={form} />
      <ContactSection form={form} />
      <SocialsSection form={form} />
      <AddressSection form={form} />
      <JobSection form={form} />
      <NotesSection form={form} />
    </Accordion>
  );

  return entityType === 'Νομικό Πρόσωπο' ? renderLegalPersonForm() : renderDefaultForm();
}
