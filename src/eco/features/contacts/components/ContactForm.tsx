
'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormLabel } from '@/components/ui/form';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";


import { contactSchema, type ContactFormValues } from '@/lib/validation/contactSchema';
import type { Contact } from '../hooks/useContacts';

import { PersonalInfoSection } from './form-sections/PersonalInfoSection';
import { IdentityTaxSection } from './form-sections/IdentityTaxSection';
import { ContactInfoSection } from './form-sections/ContactInfoSection';
import { SocialsSection } from './form-sections/SocialsSection';
import { AddressSection } from './form-sections/AddressSection';
import { JobInfoSection } from './form-sections/JobInfoSection';
import { NotesSection } from './form-sections/NotesSection';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ContactFormProps {
  isSubmitting: boolean;
  onSubmit: (data: ContactFormValues) => void;
  onCancel: () => void;
  editingContact?: Contact | null;
  editingSection: string | null;
}

const safeParseDate = (date: any): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (typeof date.toDate === 'function') return date.toDate();
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};


export const ContactForm = ({ isSubmitting, onSubmit, onCancel, editingContact, editingSection }: ContactFormProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: editingContact ? {
      ...editingContact,
      birthDate: editingContact.birthDate ? safeParseDate(editingContact.birthDate) : undefined,
      identity: {
          ...editingContact.identity,
          issueDate: editingContact.identity?.issueDate ? safeParseDate(editingContact.identity.issueDate) : undefined,
      },
    } : {
      entityType: 'Φυσικό Πρόσωπο',
      name: '',
    },
  });

  const selectedEntityType = useWatch({ control: form.control, name: 'entityType' });
  
  // Effect to reset form when the editing contact changes
  React.useEffect(() => {
     form.reset(editingContact ? {
        ...editingContact,
        birthDate: editingContact.birthDate ? safeParseDate(editingContact.birthDate) : undefined,
        identity: {
            ...editingContact.identity,
            issueDate: editingContact.identity?.issueDate ? safeParseDate(editingContact.identity.issueDate) : undefined,
        },
      } : {
        entityType: 'Φυσικό Πρόσωπο',
        name: '',
      });
  }, [editingContact, form]);


  const handleFormSubmit = (data: ContactFormValues) => {
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
  
  const allSections = {
      personal: { title: 'Προσωπικά Στοιχεία', component: <PersonalInfoSection control={form.control} entityType={selectedEntityType} /> },
      id_tax: { title: 'Στοιχεία Ταυτότητας & ΑΦΜ', component: <IdentityTaxSection control={form.control} /> },
      contact: { title: 'Στοιχεία Επικοινωνίας', component: <ContactInfoSection control={form.control} /> },
      socials: { title: 'Κοινωνικά Δίκτυα', component: <SocialsSection control={form.control} /> },
      address: { title: 'Στοιχεία Διεύθυνσης', component: <AddressSection control={form.control} /> },
      job: { title: 'Επαγγελματικά Στοιχεία', component: <JobInfoSection control={form.control} /> },
      notes: { title: 'Λοιπά', component: <NotesSection control={form.control} /> },
  };

  const sectionsToRender = editingSection 
    ? { [editingSection]: allSections[editingSection as keyof typeof allSections] }
    : allSections;

  return (
    <Dialog open={!!editingContact} onOpenChange={(open) => !open && onCancel()}>
        <DialogContent className="max-w-4xl">
             <DialogHeader>
                 <DialogTitle>{editingContact?.id ? `Επεξεργασία Επαφής: ${editingContact.name}` : 'Δημιουργία Νέας Επαφής'}</DialogTitle>
                 <DialogDescription>Ενημερώστε τα παρακάτω πεδία. Οι αλλαγές αποθηκεύονται σε όλες τις ενότητες μαζί.</DialogDescription>
             </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-4">
               <Accordion type="multiple" defaultValue={Object.keys(sectionsToRender)} className="w-full space-y-2">
                 {Object.entries(sectionsToRender).map(([key, { title, component }]) => (
                    <AccordionItem key={key} value={key} className="border rounded-md px-4 bg-background">
                        <AccordionTrigger>{title}</AccordionTrigger>
                        <AccordionContent>{component}</AccordionContent>
                    </AccordionItem>
                 ))}
               </Accordion>
                <DialogFooter className="pt-4 sticky bottom-0 bg-background py-4">
                    <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                        Άκυρο
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Αποθήκευση
                    </Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
};
