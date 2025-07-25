
'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormLabel } from '@/components/ui/form';

import { contactSchema, type ContactFormValues } from '@/lib/validation/contactSchema';
import type { Contact } from '../hooks/useContacts';

import { PersonalInfoSection } from './form-sections/PersonalInfoSection';
import { IdentityTaxSection } from './form-sections/IdentityTaxSection';
import { ContactInfoSection } from './form-sections/ContactInfoSection';
import { SocialsSection } from './form-sections/SocialsSection';
import { AddressSection } from './form-sections/AddressSection';
import { JobInfoSection } from './form-sections/JobInfoSection';
import { NotesSection } from './form-sections/NotesSection';

interface ContactFormProps {
  isSubmitting: boolean;
  onSubmit: (data: ContactFormValues) => void;
  onCancel: () => void;
  initialData?: Contact | null;
}

const safeParseDate = (date: any): Date | null => {
  if (!date) return null;
  if (date instanceof Date) {
    return date;
  }
  if (typeof date.toDate === 'function') {
    return date.toDate();
  }
  // Handle string dates if necessary, though Firestore usually provides Timestamps
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const ContactForm = ({ isSubmitting, onSubmit, onCancel, initialData }: ContactFormProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      ...initialData,
      birthDate: initialData?.birthDate ? safeParseDate(initialData.birthDate) : undefined,
      identity: {
          ...initialData?.identity,
          issueDate: initialData?.identity?.issueDate ? safeParseDate(initialData.identity.issueDate) : undefined,
      },
    } || {
      entityType: 'Φυσικό Πρόσωπο',
      name: '',
    },
  });

  const selectedEntityType = useWatch({ control: form.control, name: 'entityType' });

  const handleFormSubmit = (data: ContactFormValues) => {
    // Ensure dates are correctly formatted or null before submission
    const dataToSubmit = {
      ...data,
      birthDate: data.birthDate || null,
      identity: {
        ...data.identity,
        issueDate: data.identity?.issueDate || null,
      },
    };
    onSubmit(dataToSubmit);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{initialData ? 'Επεξεργασία Επαφής' : 'Νέα Επαφή'}</h2>
          <Button variant="ghost" size="icon" onClick={onCancel} type="button">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <RadioGroup
          onValueChange={(value) => form.setValue('entityType', value as ContactFormValues['entityType'])}
          defaultValue={form.getValues('entityType')}
          className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-4"
        >
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="Φυσικό Πρόσωπο" id="type-individual"/>
            <FormLabel className="font-normal" htmlFor="type-individual">Φυσικό Πρόσωπο</FormLabel>
          </div>
           <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="Νομικό Πρόσωπο" id="type-legal"/>
            <FormLabel className="font-normal" htmlFor="type-legal">Νομικό Πρόσωπο</FormLabel>
          </div>
           <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="Δημ. Υπηρεσία" id="type-public"/>
            <FormLabel className="font-normal" htmlFor="type-public">Δημ. Υπηρεσία</FormLabel>
          </div>
        </RadioGroup>
        
        <Accordion type="multiple" defaultValue={['personal-info']} className="w-full space-y-2">
            <PersonalInfoSection control={form.control} entityType={selectedEntityType} />
            <IdentityTaxSection control={form.control} />
            <ContactInfoSection control={form.control} />
            <SocialsSection control={form.control} />
            <AddressSection control={form.control} />
            <JobInfoSection control={form.control} />
            <NotesSection control={form.control} />
        </Accordion>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Άκυρο
          </Button>
          <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Αποθήκευση Αλλαγών
          </Button>
        </div>
      </form>
    </Form>
  );
};
