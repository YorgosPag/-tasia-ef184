'use client';

import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ImageUploader } from './ImageUploader';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
}

export function ContactForm({ form }: ContactFormProps) {
  const entityType = form.watch('entityType');
  const contactId = form.getValues('id'); // Assuming 'id' is part of the form values when editing

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: "emails" });
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: "phones" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "socials" });

  const PHONE_INDICATORS = ['Viber', 'WhatsApp', 'Telegram'];

  const handleUploadComplete = (url: string) => {
    form.setValue('photoUrl', url, { shouldDirty: true });
  };
  
  const handleImageDelete = async () => {
    // This function will be passed to the uploader.
    // The uploader handles Storage deletion. Here we just clear the form field.
    form.setValue('photoUrl', '', { shouldDirty: true });
  };


  return (
    <Accordion type="multiple" defaultValue={['personal', 'identity', 'contact']} className="w-full">
      {/* 1. Βασικά Στοιχεία */}
      <AccordionItem value="personal">
        <AccordionTrigger>Βασικά Στοιχεία</AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
          <FormField control={form.control} name="entityType" render={({ field }) => (<FormItem><FormLabel>Τύπος Οντότητας</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Φυσικό Πρόσωπο">Φυσικό Πρόσωπο</SelectItem><SelectItem value="Νομικό Πρόσωπο">Νομικό Πρόσωπο</SelectItem><SelectItem value="Δημ. Υπηρεσία">Δημ. Υπηρεσία</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          
           {entityType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
               <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Επωνυμία</FormLabel><FormControl><Input {...field} placeholder="π.χ. Γιώργος Παπαδόπουλος ή DevConstruct AE" /></FormControl><FormMessage /></FormItem>)} />

                <ImageUploader 
                  entityType={entityType}
                  entityId={contactId}
                  initialImageUrl={form.getValues('photoUrl')}
                  onUploadComplete={handleUploadComplete}
                  onDelete={handleImageDelete}
                />
            </div>
          )}

          {/* --- Fields only for Individuals --- */}
          {entityType === 'Φυσικό Πρόσωπο' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Όνομα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Επώνυμο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem><FormLabel>Πατρώνυμο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem><FormLabel>Μητρώνυμο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Ημ/νία Γέννησης</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem><FormLabel>Τόπος Γέννησης</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* 2. Στοιχεία Ταυτότητας & ΑΦΜ */}
      <AccordionItem value="identity">
        <AccordionTrigger>Στοιχεία Ταυτότητας &amp; ΑΦΜ</AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entityType === 'Φυσικό Πρόσωπο' && (
                <>
                    <FormField control={form.control} name="identity.type" render={({ field }) => (<FormItem><FormLabel>Τύπος Ταυτοποίησης</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Ταυτότητα">Ταυτότητα</SelectItem><SelectItem value="Διαβατήριο">Διαβατήριο</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="identity.number" render={({ field }) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="identity.issueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Ημ/νία Έκδοσης</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="identity.issuingAuthority" render={({ field }) => (<FormItem><FormLabel>Εκδούσα Αρχή</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </>
              )}
              <FormField control={form.control} name="afm" render={({ field }) => (<FormItem><FormLabel>ΑΦΜ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="doy" render={({ field }) => (<FormItem><FormLabel>ΔΟΥ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* 3. Στοιχεία Επικοινωνίας */}
      <AccordionItem value="contact">
        <AccordionTrigger>Στοιχεία Επικοινωνίας</AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
          {/* Emails */}
          <div className="space-y-3">
            <FormLabel>Emails</FormLabel>
            {emailFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                <FormField control={form.control} name={`emails.${index}.type`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">Τύπος</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Προσωπικό">Προσωπικό</SelectItem><SelectItem value="Επαγγελματικό">Επαγγελματικό</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`emails.${index}.value`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendEmail({ type: 'Προσωπικό', value: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Email</Button>
          </div>

          {/* Phones */}
          <div className="space-y-3">
            <FormLabel>Τηλέφωνα</FormLabel>
            {phoneFields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-3 p-2 border rounded-md">
                 <div className="flex items-end gap-2">
                    <FormField control={form.control} name={`phones.${index}.type`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">Τύπος</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Κινητό">Κινητό</SelectItem><SelectItem value="Σταθερό">Σταθερό</SelectItem><SelectItem value="Επαγγελματικό">Επαγγελματικό</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name={`phones.${index}.value`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">Αριθμός</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>)} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                 </div>
                 <FormField control={form.control} name={`phones.${index}.indicators`} render={() => (<FormItem><div className="flex items-center space-x-4">{PHONE_INDICATORS.map(indicator => (<FormField key={indicator} control={form.control} name={`phones.${index}.indicators`} render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value?.includes(indicator)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), indicator]) : field.onChange(field.value?.filter(v => v !== indicator))}}/></FormControl><FormLabel className="font-normal text-sm">{indicator}</FormLabel></FormItem>)}/>))}</div><FormMessage /></FormItem>)}/>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendPhone({ type: 'Κινητό', value: '', indicators: [] })}><PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Τηλεφώνου</Button>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* 4. Κοινωνικά Δίκτυα */}
      <AccordionItem value="socials">
        <AccordionTrigger>Κοινωνικά Δίκτυα &amp; Websites</AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
            {socialFields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                <FormField control={form.control} name={`socials.${index}.type`} render={({ field }) => (<FormItem className="w-1/3"><FormLabel className="text-xs">Τύπος</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Website">Website</SelectItem><SelectItem value="LinkedIn">LinkedIn</SelectItem><SelectItem value="Facebook">Facebook</SelectItem><SelectItem value="Instagram">Instagram</SelectItem><SelectItem value="TikTok">TikTok</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`socials.${index}.url`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendSocial({ type: 'Website', url: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Link</Button>
        </AccordionContent>
      </AccordionItem>

      {/* 5. Στοιχεία Διεύθυνσης */}
       <AccordionItem value="address">
        <AccordionTrigger>Στοιχεία Διεύθυνσης</AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="address.street" render={({ field }) => (<FormItem><FormLabel>Οδός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address.number" render={({ field }) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address.city" render={({ field }) => (<FormItem><FormLabel>Πόλη</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="address.postalCode" render={({ field }) => (<FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 6. Επαγγελματικά Στοιχεία */}
      {entityType !== 'Δημ. Υπηρεσία' && (
        <AccordionItem value="job">
            <AccordionTrigger>Επαγγελματικά Στοιχεία</AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem><FormLabel>Ρόλος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem><FormLabel>Ειδικότητα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            </AccordionContent>
        </AccordionItem>
      )}


      {/* 7. Λοιπά */}
      <AccordionItem value="notes">
        <AccordionTrigger>Λοιπά</AccordionTrigger>
        <AccordionContent className="p-1">
             <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Σημειώσεις</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
