
'use client';

import React from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon, PlusCircle, Trash2, User, Building2, Landmark, Info, Phone, Link as LinkIcon, MapPin, Briefcase } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ImageUploader } from './ImageUploader';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';


interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  onFileSelect: (file: File | null) => void;
}

const SOCIAL_TYPES = ['Website', 'LinkedIn', 'Facebook', 'Instagram', 'GitHub', 'TikTok', 'Άλλο'];

const PhoneIndicatorIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    Viber: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M16.4,4.1c-1-0.8-2.3-1.3-3.8-1.3c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.3,0c-3.1,0-5.8,1.7-7.2,4.2c-0.1,0.2-0.1,0.4-0.1,0.6 c0,0.4,0.1,0.7,0.3,1c0,0,0,0,0,0c0.6,0.8,1.3,1.6,2.1,2.3c0.1,0.1,0.1,0.1,0.2,0.2c0.5,0.5,1,1,1.6,1.4c0.1,0.1,0.2,0.1,0.3,0.2 c1.4,0.9,3.1,1.4,4.8,1.4h0.1c0,0,0,0,0,0c0.5,0,1-0.1,1.5-0.2c0.7-0.2,1.4-0.5,2-0.9c0.2-0.1,0.4-0.3,0.5-0.5 c2.2-2,3.3-4.5,3.3-7.2C20.5,7.7,18.8,5.5,16.4,4.1z M17.2,12.5c-0.5,0.4-1.1,0.7-1.8,0.8c-0.5,0.1-1,0.2-1.5,0.2c0,0,0,0,0,0 c-1.5,0-2.9-0.4-4.2-1.2c-0.1,0-0.2-0.1-0.3-0.1c-0.6-0.4-1.1-0.9-1.6-1.4c-0.1,0-0.1-0.1-0.2-0.1C7,10,6.4,9.3,5.8,8.5 c0,0,0,0,0-0.1c-0.1-0.2-0.1-0.3-0.1-0.4c0-0.1,0-0.2,0-0.3c1.2-2.1,3.6-3.6,6.2-3.6c0.1,0,0.2,0,0.3,0c0.1,0,0.2,0,0.3,0 c1.3,0,2.5,0.4,3.3,1.1c1.9,1.5,3.4,3.4,3.4,5.8C19.4,9.5,18.6,11.2,17.2,12.5z" /></svg>
    ),
    WhatsApp: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.5,2,2,6.5,2,12c0,1.8,0.5,3.5,1.4,5.1L2,22l5.3-1.4c1.5,0.8,3.2,1.3,4.8,1.3h0c5.5,0,10-4.5,10-10 c0-5.5-4.5-10-10-10z M16.3,14.6c-0.2-0.1-1.1-0.5-1.3-0.6c-0.2-0.1-0.3-0.1-0.5,0.1c-0.1,0.2-0.5,0.6-0.6,0.7C14,14.9,13.9,15,13.8,14.9 c-0.1,0-0.3-0.1-0.6-0.2c-0.8-0.3-1.6-0.9-2.2-1.6c-0.5-0.6-0.8-1.2-1-1.8c-0.1-0.3,0-0.4,0.1-0.5C10.1,10.6,10.2,10.5,10.3,10.4 c0.1-0.1,0.2-0.2,0.2-0.4c0.1-0.1,0-0.3,0-0.4C10.5,9.6,10,8.5,9.8,8C9.6,7.5,9.4,7.6,9.2,7.6c-0.1,0-0.3,0-0.5,0 c-0.2,0-0.5,0.1-0.7,0.3c-0.2,0.2-0.8,0.7-0.8,1.8c0,1.1,0.8,2,0.9,2.2c0.1,0.2,1.6,2.6,4,3.6c2.4,1,2.4,0.7,2.8,0.6 c0.4-0.1,1.1-0.5,1.3-0.9c0.2-0.4,0.2-0.8,0.1-0.9C16.6,14.7,16.5,14.7,16.3,14.6z" /></svg>
    ),
    Telegram: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12,2c5.5,0,10,4.5,10,10s-4.5,10-10,10S2,17.5,2,12S6.5,2,12,2z M15.1,8.4l-0.3,0c-0.1,0-0.3,0.1-0.4,0.2 l-3.9,3.7c-0.1,0.1-0.3,0.2-0.4,0.2s-0.3-0.1-0.4-0.2l-0.7-0.7c-0.2-0.2-0.5-0.2-0.7,0s-0.2,0.5,0,0.7l0.7,0.7 c0.1,0.1,0.3,0.2,0.4,0.2s0.3-0.1,0.4-0.2l3.9-3.7c0.1-0.1,0.3-0.2,0.4-0.2s0.3,0.1,0.4,0.2l-1.9,3.1c-0.1,0.1-0.1,0.3,0,0.4 c0.1,0.1,0.3,0.2,0.4,0.1l3.1-1.9c0.1-0.1,0.2-0.3,0.1-0.4C15.5,8.5,15.3,8.4,15.1,8.4z" /></svg>
    ),
  };

export function ContactForm({ form, onFileSelect }: ContactFormProps) {
  const entityType = form.watch('entityType');
  const contactId = form.getValues('id'); // Assuming 'id' is part of the form values when editing

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: "emails" });
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: "phones" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "socials" });

  const PHONE_INDICATORS = ['Viber', 'WhatsApp', 'Telegram'];
  
  return (
    <Accordion type="multiple" defaultValue={['personal', 'identity', 'contact', 'address', 'job', 'socials', 'notes']} className="w-full">
      {/* 1. Βασικά Στοιχεία */}
      <AccordionItem value="personal">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <span className="text-primary">Βασικά Στοιχεία</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
           <FormField
              control={form.control}
              name="entityType"
              render={({ field }) => (
                <FormItem className="flex flex-col sm:flex-row sm:items-start sm:gap-4 space-y-2 sm:space-y-0 pt-2">
                  <FormLabel className="sm:w-40 sm:text-right sm:pt-2 shrink-0">Τύπος Οντότητας</FormLabel>
                   <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                         if (value === 'Φυσικό Πρόσωπο') {
                            const firstName = form.getValues('firstName') || '';
                            const lastName = form.getValues('lastName') || '';
                            form.setValue('name', `${firstName} ${lastName}`.trim());
                        } else {
                            form.setValue('name', '');
                        }
                      }}
                      defaultValue={field.value}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1"
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
                </FormItem>
              )}
            />

           {entityType && (
            <div className="space-y-4 border-t pt-4">
             {entityType !== 'Φυσικό Πρόσωπο' && (
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 space-y-2 sm:space-y-0">
                    <FormLabel className="sm:w-40 sm:text-right sm:pt-2.5 shrink-0">Επωνυμία</FormLabel>
                    <div className="flex-1 space-y-2">
                      <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                              <FormControl><Input {...field} placeholder="π.χ. DevConstruct AE" /></FormControl>
                              <FormDescription>Το πλήρες όνομα ή η εμπορική επωνυμία.</FormDescription>
                              <FormMessage />
                          </FormItem>
                      )} />
                    </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 space-y-2 sm:space-y-0">
                  <FormLabel className="sm:w-40 sm:text-right sm:pt-2.5 shrink-0">{entityType === 'Φυσικό Πρόσωπο' ? 'Φωτογραφία' : 'Λογότυπο'}</FormLabel>
                   <div className="flex-1">
                      <ImageUploader 
                          entityType={entityType}
                          entityId={contactId}
                          initialImageUrl={form.getValues('photoUrl')}
                          onFileSelect={onFileSelect}
                      />
                  </div>
              </div>
            </div>
          )}

          {entityType === 'Φυσικό Πρόσωπο' && (
            <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Όνομα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Επώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Πατρώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Μητρώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ημ/νία Γέννησης</FormLabel><div className="flex-1"><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()} /></PopoverContent></Popover><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Τόπος Γέννησης</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* 2. Στοιχεία Ταυτότητας & ΑΦΜ */}
      <AccordionItem value="identity">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <span className="text-primary">Στοιχεία Ταυτότητας &amp; ΑΦΜ</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {entityType === 'Φυσικό Πρόσωπο' && (
                    <>
                        <FormField control={form.control} name="identity.type" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Τύπος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="identity.number" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Αριθμός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="identity.issueDate" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ημ/νία Έκδοσης</FormLabel><div className="flex-1"><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="identity.issuingAuthority" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Εκδ. Αρχή</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    </>
                  )}
                 <FormField control={form.control} name="afm" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">ΑΦΜ</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                 <FormField control={form.control} name="doy" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">ΔΟΥ</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
             </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* 3. Στοιχεία Επικοινωνίας */}
      <AccordionItem value="contact">
        <AccordionTrigger>
           <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-primary">Στοιχεία Επικοινωνίας</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6 p-1 pt-4">
             {/* Emails Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Emails</h3>
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
                    <h3 className="text-sm font-medium">Τηλέφωνα</h3>
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
                        <FormField
                        control={form.control}
                        name={`phones.${index}.indicators`}
                        render={() => (
                            <FormItem>
                                <div className="flex items-center space-x-4 pl-1 pt-2">
                                {PHONE_INDICATORS.map((indicator) => {
                                    const Icon = PhoneIndicatorIcons[indicator];
                                    return (
                                        <FormField
                                            key={indicator}
                                            control={form.control}
                                            name={`phones.${index}.indicators`}
                                            render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(indicator)}
                                                    onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...(field.value || []), indicator])
                                                        : field.onChange(
                                                            field.value?.filter((v) => v !== indicator)
                                                        );
                                                    }}
                                                />
                                                </FormControl>
                                                <FormLabel className="font-normal text-sm flex items-center gap-1.5">
                                                    {Icon && <Icon className="h-4 w-4"/>}
                                                    {indicator}
                                                </FormLabel>
                                            </FormItem>
                                            )}
                                        />
                                    );
                                })}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    ))}
                </div>
            </div>
        </AccordionContent>
      </AccordionItem>
      
      {/* 4. Κοινωνικά Δίκτυα */}
      <AccordionItem value="socials">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            <span className="text-primary">Κοινωνικά Δίκτυα &amp; Websites</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                     <h3 className="text-sm font-medium">Σύνδεσμοι</h3>
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
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-primary">Στοιχεία Διεύθυνσης</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="address.street" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Οδός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
              <FormField control={form.control} name="address.number" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Αριθμός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
              <FormField control={form.control} name="address.region" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Περιοχή</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
              <FormField control={form.control} name="address.postalCode" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ταχ. Κώδικας</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
              <FormField control={form.control} name="address.city" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Πόλη</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
              <FormField control={form.control} name="address.municipality" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Δήμος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 6. Επαγγελματικά Στοιχεία */}
      {entityType !== 'Δημ. Υπηρεσία' && (
        <AccordionItem value="job">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span className="text-primary">Επαγγελματικά Στοιχεία</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ρόλος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ειδικότητα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.companyName" render={({ field }) => (<FormItem className="flex items-center gap-4 md:col-span-2"><FormLabel className="w-40 text-right">Επιχείρηση/Οργανισμός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                </div>
            </AccordionContent>
        </AccordionItem>
      )}


      {/* 7. Λοιπά */}
      <AccordionItem value="notes">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <span className="text-primary">Σημειώσεις</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-1 pt-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Σημειώσεις</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
