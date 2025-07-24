
'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Contact } from '../hooks/useContacts';

const contactSchema = z.object({
  name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό.'),
  entityType: z.enum(['Φυσικό Πρόσωπο', 'Νομικό Πρόσωπο', 'Δημ. Υπηρεσία']),
  logoUrl: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
  website: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
  job: z.object({
    role: z.string().optional(),
    specialty: z.string().optional(),
  }).optional(),
  contactInfo: z.object({
    email: z.string().email('Μη έγκυρο email').or(z.literal('')).optional(),
    phone: z.string().optional(),
    landline: z.string().optional(),
    address: z.string().optional(),
    afm: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  isSubmitting: boolean;
  onSubmit: (data: ContactFormValues) => void;
  onCancel: () => void;
  initialData?: Contact | null;
}

export const ContactForm = ({ isSubmitting, onSubmit, onCancel, initialData }: ContactFormProps) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      name: '',
      entityType: 'Φυσικό Πρόσωπο',
      job: { role: '', specialty: '' },
      contactInfo: { email: '', phone: '', landline: '', address: '', afm: '' },
      notes: '',
      logoUrl: '',
      website: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold">{initialData ? 'Επεξεργασία Επαφής' : 'Νέα Επαφή'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Επωνυμία / Όνομα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="entityType" render={({ field }) => (<FormItem><FormLabel>Τύπος Οντότητας</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Φυσικό Πρόσωπο">Φυσικό Πρόσωπο</SelectItem><SelectItem value="Νομικό Πρόσωπο">Νομικό Πρόσωπο</SelectItem><SelectItem value="Δημ. Υπηρεσία">Δημ. Υπηρεσία</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem><FormLabel>Ρόλος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem><FormLabel>Ειδικότητα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactInfo.afm" render={({ field }) => (<FormItem><FormLabel>ΑΦΜ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>

        <h3 className="text-lg font-semibold pt-4 border-t">Στοιχεία Επικοινωνίας</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="contactInfo.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (<FormItem><FormLabel>Κινητό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactInfo.landline" render={({ field }) => (<FormItem><FormLabel>Σταθερό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactInfo.address" render={({ field }) => (<FormItem><FormLabel>Διεύθυνση</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>

        <h3 className="text-lg font-semibold pt-4 border-t">Πρόσθετες Πληροφορίες</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="logoUrl" render={({ field }) => (<FormItem><FormLabel>URL Λογοτύπου</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Σημειώσεις</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Ακύρωση
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Αποθήκευση
          </Button>
        </div>
      </form>
    </Form>
  );
};
