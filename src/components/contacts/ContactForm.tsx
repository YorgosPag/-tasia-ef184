
'use client';

import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon, PlusCircle, Trash2, User, Building2, Landmark } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ImageUploader } from './ImageUploader';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';


interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  onFileSelect: (file: File | null) => void;
}

const SOCIAL_TYPES = ['Website', 'LinkedIn', 'Facebook', 'Instagram', 'GitHub', 'TikTok', 'Άλλο'];


export function ContactForm({ form, onFileSelect }: ContactFormProps) {
  const entityType = form.watch('entityType');
  const contactId = form.getValues('id'); // Assuming 'id' is part of the form values when editing

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: "emails" });
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: "phones" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "socials" });

  const PHONE_INDICATORS = ['Viber', 'WhatsApp', 'Telegram'];
  
  const renderField = (name: any, label: string, children: React.ReactNode) => (
    <div className="flex flex-col md:flex-row md:items-start md:gap-4 space-y-2 md:space-y-0">
        <FormLabel className="md:w-40 md:text-right md:pt-2.5 shrink-0">{label}</FormLabel>
        <div className="w-full">
            {children}
        </div>
    </div>
  );


  return (
    <Accordion type="multiple" defaultValue={['personal', 'identity', 'contact', 'address', 'job', 'socials', 'notes']} className="w-full">
      {/* 1. Βασικά Στοιχεία */}
      <AccordionItem value="personal">
        <AccordionTrigger>Βασικά Στοιχεία</AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
           <FormField
              control={form.control}
              name="entityType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="md:w-40 md:text-right md:pt-2.5 shrink-0">Τύπος Οντότητας</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="Φυσικό Πρόσωπο" id="Φυσικό Πρόσωπο" className="sr-only" />
                        </FormControl>
                        <Label
                          htmlFor="Φυσικό Πρόσωπο"
                           className={cn(
                            'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                            field.value === 'Φυσικό Πρόσωπο' && 'border-primary'
                          )}
                        >
                          <User className="mb-3 h-6 w-6" />
                          Φυσικό Πρόσωπο
                        </Label>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                            <RadioGroupItem value="Νομικό Πρόσωπο" id="Νομικό Πρόσωπο" className="sr-only" />
                        </FormControl>
                        <Label
                          htmlFor="Νομικό Πρόσωπο"
                           className={cn(
                            'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                            field.value === 'Νομικό Πρόσωπο' && 'border-primary'
                          )}
                        >
                          <Building2 className="mb-3 h-6 w-6" />
                          Νομικό Πρόσωπο
                        </Label>
                      </FormItem>
                       <FormItem>
                        <FormControl>
                            <RadioGroupItem value="Δημ. Υπηρεσία" id="Δημ. Υπηρεσία" className="sr-only" />
                        </FormControl>
                         <Label
                          htmlFor="Δημ. Υπηρεσία"
                           className={cn(
                            'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                            field.value === 'Δημ. Υπηρεσία' && 'border-primary'
                          )}
                        >
                          <Landmark className="mb-3 h-6 w-6" />
                          Δημ. Υπηρεσία
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

           {entityType && (
            <div className="space-y-4 border-t pt-4">
               {renderField('name', 'Όνομα/Επωνυμία',
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} placeholder="π.χ. Γιώργος Παπαδόπουλος ή DevConstruct AE" /></FormControl><FormMessage /></FormItem>)} />
               )}
                
                {renderField('photo', entityType === 'Φυσικό Πρόσωπο' ? 'Φωτογραφία' : 'Λογότυπο', 
                    <ImageUploader 
                        entityType={entityType}
                        entityId={contactId}
                        initialImageUrl={form.getValues('photoUrl')}
                        onFileSelect={onFileSelect}
                    />
                )}
            </div>
          )}

          {/* --- Fields only for Individuals --- */}
          {entityType === 'Φυσικό Πρόσωπο' && (
            <div className="space-y-4 border-t pt-4">
                {renderField('firstName', 'Όνομα', <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                {renderField('lastName', 'Επώνυμο', <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                {renderField('fatherName', 'Πατρώνυμο', <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                {renderField('motherName', 'Μητρώνυμο', <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                {renderField('birthDate', 'Ημ/νία Γέννησης', <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem className="w-full"><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()} /></PopoverContent></Popover><FormMessage /></FormItem>)} />)}
                {renderField('birthPlace', 'Τόπος Γέννησης', <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* 2. Στοιχεία Ταυτότητας & ΑΦΜ */}
      <AccordionItem value="identity">
        <AccordionTrigger>Στοιχεία Ταυτότητας &amp; ΑΦΜ</AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
             {entityType === 'Φυσικό Πρόσωπο' && (
                <>
                    {renderField('identity.type', 'Τύπος', <FormField control={form.control} name="identity.type" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                    {renderField('identity.number', 'Αριθμός', <FormField control={form.control} name="identity.number" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                    {renderField('identity.issueDate', 'Ημ/νία Έκδοσης', <FormField control={form.control} name="identity.issueDate" render={({ field }) => (<FormItem className="w-full"><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />)}
                    {renderField('identity.issuingAuthority', 'Εκδούσα Αρχή', <FormField control={form.control} name="identity.issuingAuthority" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
                </>
              )}
             {renderField('afm', 'ΑΦΜ', <FormField control={form.control} name="afm" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
             {renderField('doy', 'ΔΟΥ', <FormField control={form.control} name="doy" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
        </AccordionContent>
      </AccordionItem>
      
      {/* 3. Στοιχεία Επικοινωνίας */}
      <AccordionItem value="contact">
        <AccordionTrigger>Στοιχεία Επικοινωνίας</AccordionTrigger>
        <AccordionContent className="space-y-6 p-1 pt-4">
             {/* Emails Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <FormLabel>Emails</FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={() => appendEmail({ type: 'Προσωπικό', value: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Email
                    </Button>
                </div>
                <div className="w-full space-y-2">
                    {emailFields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md bg-muted/30">
                        <FormField control={form.control} name={`emails.${index}.type`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`emails.${index}.value`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                    ))}
                </div>
            </div>

            {/* Phones Section */}
            <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <FormLabel>Τηλέφωνα</FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={() => appendPhone({ type: 'Κινητό', value: '', indicators: [] })}>
                        <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Τηλεφώνου
                    </Button>
                </div>
                <div className="w-full space-y-2">
                    {phoneFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-3 p-3 border rounded-md bg-muted/30">
                        <div className="flex items-end gap-2">
                            <FormField control={form.control} name={`phones.${index}.type`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`phones.${index}.value`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-xs">Αριθμός</FormLabel><FormControl><Input {...field} type="tel" /></FormControl><FormMessage /></FormItem>)} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                        <FormField control={form.control} name={`phones.${index}.indicators`} render={() => (<FormItem><div className="flex items-center space-x-4 pl-1 pt-2">{PHONE_INDICATORS.map(indicator => (<FormField key={indicator} control={form.control} name={`phones.${index}.indicators`} render={({ field }) => (<FormItem className="flex items-center space-x-2"><FormControl><Checkbox checked={field.value?.includes(indicator)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), indicator]) : field.onChange(field.value?.filter(v => v !== indicator))}}/></FormControl><FormLabel className="font-normal text-sm">{indicator}</FormLabel></FormItem>)}/>))}</div><FormMessage /></FormItem>)}/>
                    </div>
                    ))}
                </div>
            </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* 4. Κοινωνικά Δίκτυα */}
      <AccordionItem value="socials">
        <AccordionTrigger>Κοινωνικά Δίκτυα &amp; Websites</AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <FormLabel>Σύνδεσμοι</FormLabel>
                    <Button type="button" variant="ghost" size="sm" onClick={() => appendSocial({ type: 'Website', label: 'Επαγγελματικό', url: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Link
                    </Button>
                </div>
                <div className="w-full space-y-2">
                    {socialFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-2 p-3 border rounded-md bg-muted/30">
                        <FormField control={form.control} name={`socials.${index}.type`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Τύπος</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{SOCIAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`socials.${index}.label`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Χαρακτηρισμός</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Επαγγελματικό">Επαγγελματικό</SelectItem><SelectItem value="Προσωπικό">Προσωπικό</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`socials.${index}.url`} render={({ field }) => (<FormItem className="lg:col-span-3"><FormLabel className="text-xs">URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="lg:col-span-3 flex justify-end">
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
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
              <FormField control={form.control} name="address.municipality" render={({ field }) => (<FormItem><FormLabel>Δήμος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="address.region" render={({ field }) => (<FormItem><FormLabel>Περιοχή/Νομός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                    <div className="md:col-span-2">
                        <FormField control={form.control} name="job.companyName" render={({ field }) => (<FormItem><FormLabel>Επιχείρηση/Οργανισμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
      )}


      {/* 7. Λοιπά */}
      <AccordionItem value="notes">
        <AccordionTrigger>Λοιπά</AccordionTrigger>
        <AccordionContent className="p-1">
             {renderField('notes', 'Σημειώσεις', <FormField control={form.control} name="notes" render={({ field }) => (<FormItem className="w-full"><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />)}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
