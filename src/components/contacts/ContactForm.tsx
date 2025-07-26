'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { ContactFormValues } from '@/shared/lib/validation/contactSchema';

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
}

export function ContactForm({ form }: ContactFormProps) {
  const entityType = form.watch('entityType');

  return (
    <Accordion type="multiple" defaultValue={['personal', 'contact']} className="w-full">
      {/* 1. Προσωπικά Στοιχεία */}
      <AccordionItem value="personal">
        <AccordionTrigger>Προσωπικά Στοιχεία</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Επωνυμία</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="entityType" render={({ field }) => (<FormItem><FormLabel>Τύπος Οντότητας</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Φυσικό Πρόσωπο">Φυσικό Πρόσωπο</SelectItem><SelectItem value="Νομικό Πρόσωπο">Νομικό Πρόσωπο</SelectItem><SelectItem value="Δημ. Υπηρεσία">Δημ. Υπηρεσία</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          {entityType === 'Φυσικό Πρόσωπο' && (
            <>
              <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Όνομα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Επώνυμο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem><FormLabel>Πατρώνυμο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem><FormLabel>Μητρώνυμο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Ημ/νία Γέννησης</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(field.value, 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem><FormLabel>Τόπος Γέννησης</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* 2. Στοιχεία Ταυτότητας & ΑΦΜ */}
      <AccordionItem value="identity">
        <AccordionTrigger>Στοιχεία Ταυτότητας &amp; ΑΦΜ</AccordionTrigger>
        <AccordionContent className="space-y-4">
            <FormField control={form.control} name="identity.type" render={({ field }) => (<FormItem><FormLabel>Τύπος Ταυτοποίησης</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Ταυτότητα">Ταυτότητα</SelectItem><SelectItem value="Διαβατήριο">Διαβατήριο</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="identity.number" render={({ field }) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="identity.issueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Ημ/νία Έκδοσης</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(field.value, 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="identity.issuingAuthority" render={({ field }) => (<FormItem><FormLabel>Εκδούσα Αρχή</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="afm" render={({ field }) => (<FormItem><FormLabel>ΑΦΜ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="doy" render={({ field }) => (<FormItem><FormLabel>ΔΟΥ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </AccordionContent>
      </AccordionItem>
      
      {/* 3. Στοιχεία Επικοινωνίας */}
      <AccordionItem value="contact">
        <AccordionTrigger>Στοιχεία Επικοινωνίας</AccordionTrigger>
        <AccordionContent className="space-y-4">
            <FormField control={form.control} name="contactInfo.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (<FormItem><FormLabel>Κινητό Τηλέφωνο</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="contactInfo.landline" render={({ field }) => (<FormItem><FormLabel>Σταθερό Τηλέφωνο</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>)} />
        </AccordionContent>
      </AccordionItem>
      
      {/* 4. Κοινωνικά Δίκτυα */}
      <AccordionItem value="socials">
        <AccordionTrigger>Κοινωνικά Δίκτυα</AccordionTrigger>
        <AccordionContent className="space-y-4">
            <FormField control={form.control} name="socials.website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="socials.linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="socials.facebook" render={({ field }) => (<FormItem><FormLabel>Facebook</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </AccordionContent>
      </AccordionItem>

      {/* 5. Στοιχεία Διεύθυνσης */}
       <AccordionItem value="address">
        <AccordionTrigger>Στοιχεία Διεύθυνσης</AccordionTrigger>
        <AccordionContent className="space-y-4">
            <FormField control={form.control} name="address.street" render={({ field }) => (<FormItem><FormLabel>Οδός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address.number" render={({ field }) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address.city" render={({ field }) => (<FormItem><FormLabel>Πόλη</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address.postalCode" render={({ field }) => (<FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </AccordionContent>
      </AccordionItem>

      {/* 6. Επαγγελματικά Στοιχεία */}
      <AccordionItem value="job">
        <AccordionTrigger>Επαγγελματικά Στοιχεία</AccordionTrigger>
        <AccordionContent className="space-y-4">
             <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem><FormLabel>Ρόλος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem><FormLabel>Ειδικότητα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </AccordionContent>
      </AccordionItem>

      {/* 7. Λοιπά */}
      <AccordionItem value="notes">
        <AccordionTrigger>Λοιπά</AccordionTrigger>
        <AccordionContent>
             <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Σημειώσεις</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
