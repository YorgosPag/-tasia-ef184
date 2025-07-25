
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import type { Contact } from '../hooks/useContacts';
import { useCustomLists } from '../../custom-lists/hooks/useCustomLists';
import { Accordion } from '@/components/ui/accordion';

const contactSchema = z.object({
  name: z.string().min(1, 'Το όνομα/επωνυμία είναι υποχρεωτικό.'),
  entityType: z.enum(['Φυσικό Πρόσωπο', 'Νομικό Πρόσωπο', 'Δημ. Υπηρεσία']),
  
  // Personal Info
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  spouseName: z.string().optional(),
  birthDate: z.date().optional().nullable(),
  
  // ID & Tax Info
  identity: z.object({
    type: z.enum(['Ταυτότητα', 'Διαβατήριο']).optional(),
    number: z.string().optional(),
    issueDate: z.date().optional().nullable(),
    issuingAuthority: z.string().optional(),
  }).optional(),
  afm: z.string().optional(),
  doy: z.string().optional(),

  // Contact Info
  contactInfo: z.object({
    email: z.string().email('Μη έγκυρο email').or(z.literal('')).optional(),
    phone: z.string().optional(),
    landline: z.string().optional(),
  }).optional(),

  // Social Networks
  socials: z.object({
    website: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    linkedin: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    facebook: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
  }).optional(),

  // Address Info
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    municipality: z.string().optional(),
  }).optional(),
  
  // Professional Info
  job: z.object({
    role: z.string().optional(),
    specialty: z.string().optional(),
    title: z.string().optional(),
    companyName: z.string().optional(),
  }).optional(),
  
  // Other
  notes: z.string().optional(),
  logoUrl: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  isSubmitting: boolean;
  onSubmit: (data: ContactFormValues) => void;
  onCancel: () => void;
  initialData?: Contact | null;
}

export const ContactForm = ({ isSubmitting, onSubmit, onCancel, initialData }: ContactFormProps) => {
  const { lists } = useCustomLists();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      ...initialData,
      birthDate: initialData?.birthDate?.toDate(),
      identity: {
          ...initialData?.identity,
          issueDate: initialData?.identity?.issueDate?.toDate(),
      },
    } || {
      entityType: 'Φυσικό Πρόσωπο',
      name: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{initialData ? 'Επεξεργασία Επαφής' : 'Νέα Επαφή'}</h2>
            <Button variant="ghost" size="icon" onClick={onCancel} type="button">
                <X className="h-5 w-5" />
            </Button>
        </div>
        <p className="text-muted-foreground">Ενημερώστε τα στοιχεία της επαφής.</p>
        
        <Accordion type="multiple" defaultValue={['personal-info']} className="w-full space-y-2">
            {/* Accordion items will be added here based on user's next instructions */}
        </Accordion>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Άκυρο
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Αποθήκευση Αλλαγών
          </Button>
        </div>
      </form>
    </Form>
  );
};
