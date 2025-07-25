
'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, User, Building, Landmark, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Contact } from '../hooks/useContacts';
import { useCustomLists } from '../../custom-lists/hooks/useCustomLists';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    city: z.string().optional(),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    municipality: z.string().optional(),
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
  const { lists } = useCustomLists();
  const roles = lists.find(l => l.title === 'Ρόλοι')?.items || [];
  const specialties = lists.find(l => l.title === 'Ειδικότητες')?.items || [];

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      name: '',
      entityType: 'Φυσικό Πρόσωπο',
      job: { role: '', specialty: '' },
      contactInfo: { email: '', phone: '', landline: '', address: '', city: '', region: '', postalCode: '', municipality: '', afm: '' },
      notes: '',
      logoUrl: '',
      website: '',
    },
  });
  
  const logoUrl = form.watch('logoUrl');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-bold">{initialData ? `Επεξεργασία Επαφής: ${initialData.name}` : 'Νέα Επαφή'}</h2>
        
        <FormField
          control={form.control}
          name="entityType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-3 gap-4"
              >
                <FormItem>
                  <FormControl>
                     <RadioGroupItem value="Φυσικό Πρόσωπο" id="r1" className="sr-only" />
                  </FormControl>
                  <FormLabel htmlFor="r1" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === "Φυσικό Πρόσωπο" && "border-primary")}>
                    <User className="mb-3 h-6 w-6" />
                    Φυσικό Πρόσωπο
                  </FormLabel>
                </FormItem>
                <FormItem>
                   <FormControl>
                    <RadioGroupItem value="Νομικό Πρόσωπο" id="r2" className="sr-only" />
                   </FormControl>
                   <FormLabel htmlFor="r2" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === "Νομικό Πρόσωπο" && "border-primary")}>
                    <Building className="mb-3 h-6 w-6" />
                    Νομικό Πρόσωπο
                  </FormLabel>
                </FormItem>
                 <FormItem>
                   <FormControl>
                    <RadioGroupItem value="Δημ. Υπηρεσία" id="r3" className="sr-only" />
                   </FormControl>
                   <FormLabel htmlFor="r3" className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", field.value === "Δημ. Υπηρεσία" && "border-primary")}>
                    <Landmark className="mb-3 h-6 w-6" />
                    Δημ. Υπηρεσία
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        
         <Card>
            <CardHeader><CardTitle className="text-base">Επαγγελματικά Στοιχεία / Στοιχεία Οντότητας</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Επωνυμία / Όνομα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem><FormLabel>Ρόλος</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Επιλογή..."/></SelectTrigger></FormControl><SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.value}>{r.value}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem><FormLabel>Ειδικότητα</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Επιλογή..."/></SelectTrigger></FormControl><SelectContent>{specialties.map(s => <SelectItem key={s.id} value={s.value}>{s.value}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="contactInfo.afm" render={({ field }) => (<FormItem><FormLabel>ΑΦΜ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                {logoUrl && (
                    <div className="space-y-2">
                        <FormLabel>Υπάρχουσα Φωτογραφία:</FormLabel>
                        <div className="relative w-32 h-32">
                            <Image src={logoUrl} alt="Contact Logo" layout="fill" className="rounded-md object-cover" />
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => form.setValue('logoUrl', '')}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
                <FormField control={form.control} name="logoUrl" render={({ field }) => (<FormItem><FormLabel>URL Φωτογραφίας</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
         </Card>

         <Card>
            <CardHeader><CardTitle className="text-base">Στοιχεία Επικοινωνίας</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="contactInfo.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (<FormItem><FormLabel>Κινητό Τηλέφωνο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="contactInfo.landline" render={({ field }) => (<FormItem><FormLabel>Σταθερό Τηλέφωνο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
         </Card>

         <Card>
            <CardHeader><CardTitle className="text-base">Στοιχεία Διεύθυνσης</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="contactInfo.address" render={({ field }) => (<FormItem><FormLabel>Οδός και Αριθμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="contactInfo.city" render={({ field }) => (<FormItem><FormLabel>Πόλη</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="contactInfo.postalCode" render={({ field }) => (<FormItem><FormLabel>Τ.Κ.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="contactInfo.region" render={({ field }) => (<FormItem><FormLabel>Περιοχή</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="contactInfo.municipality" render={({ field }) => (<FormItem><FormLabel>Δήμος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </CardContent>
         </Card>

         <Card>
             <CardHeader><CardTitle className="text-base">Σημειώσεις</CardTitle></CardHeader>
             <CardContent>
                <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>)} />
             </CardContent>
         </Card>
       
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Άκυρο
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
