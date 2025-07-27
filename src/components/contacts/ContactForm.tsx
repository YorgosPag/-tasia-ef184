
'use client';

import React from 'react';
import { UseFormReturn, useFieldArray, useWatch } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon, PlusCircle, Trash2, User, Building2, Landmark, Info, Phone, Link as LinkIcon, MapPin, Briefcase, Map, Home } from 'lucide-react';
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

const PhoneIndicatorIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    Viber: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M18.1 4.5C16.5 3.4 14.6 2.8 12.6 2.8s-3.9.6-5.4 1.7c-1.5 1.1-2.6 2.7-3.1 4.5-.5 1.8-.5 3.7.1 5.5.6 1.8 1.7 3.4 3.1 4.5l-2.1 6.2 6.5-2.2c1.4.9 3 1.4 4.7 1.4h.1c4.5 0 8.1-3.6 8.1-8.1 0-2.3-1-4.4-2.6-5.9zM12.7 20.1c-1.5 0-3-.5-4.2-1.5l-.2-.1-4.4 1.5 1.5-4.3-.2-.2c-1-1.3-1.6-2.9-1.6-4.6 0-4 3.2-7.2 7.2-7.2h.1c1.8 0 3.5.7 4.8 1.9l-1.8 1.8c-.8-.7-1.8-1.1-2.9-1.1h-.1c-2.8 0-5.1 2.3-5.1 5.1 0 1.5.7 2.9 1.7 3.8l.2.2-1.1 3.1 3.1-1.1.2.1c1 .6 2.1.9 3.3.9h.1c2.8 0 5.1-2.3 5.1-5.1 0-1.4-.6-2.7-1.5-3.6l1.8-1.8c1.6 1.5 2.6 3.6 2.6 5.9 0 4.5-3.6 8.1-8.1 8.1z"/></svg>
    ),
    WhatsApp: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2A10.06 10.06 0 0 0 2 12.06a10.06 10.06 0 0 0 10.04 10.04h.1a10.06 10.06 0 0 0 10.04-10.04A10.06 10.06 0 0 0 12.04 2zM12 20.5a8.44 8.44 0 0 1-4.4-1.3L3.5 20.3l1.2-4a8.3 8.3 0 0 1-1.4-4.8A8.5 8.5 0 0 1 12 3.6a8.5 8.5 0 0 1 8.5 8.5 8.5 8.5 0 0 1-8.5 8.4zM16.3 14.4c-.2-.1-1.2-.6-1.4-.7s-.3-.1-.4.1-.5.7-.6.8-.2.2-.4.1-1.1-.4-2.1-1.3c-.8-.7-1.3-1.6-1.5-1.8s0-.3.1-.4.2-.2.4-.4c.1-.1.2-.2.2-.4s0-.2-.1-.4c-.1-.2-1.1-2.6-1.5-3.5s-.6-.8-.8-.8h-.4a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 3.9 3.9 0 0 0 .9 2.6c.1.1 1.8 2.8 4.4 3.9.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.2-.5 1.4-1 .2-.5.2-1 .1-1s-.2-.2-.4-.3z"/></svg>
    ),
    Telegram: (props) => (
      <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.33l-1.3-4.4 7.2-4.4c.4-.2.1-.7-.3-.4l-5.8 3.5-3.8-1.2c-.5-.2-.5-.8 0-1l12.4-4.5c.5-.2 1.1.2 1 .7l-2.1 10.3c-.2.5-.7.7-1.2.5l-4.2-2.1-1.9 1.8c-.3.2-.8.2-1.1-.1z"/></svg>
    ),
};


const SOCIAL_TYPES = ['Website', 'LinkedIn', 'Facebook', 'Instagram', 'GitHub', 'TikTok', 'Άλλο'];
const PHONE_INDICATORS = ['Viber', 'WhatsApp', 'Telegram'];
const ADDRESS_TYPES = ['Κατοικίας', 'Επαγγελματική', 'Έδρα', 'Υποκατάστημα', 'Αποθήκη', 'Εξοχικό', 'Άλλο'];


export function ContactForm({ form, onFileSelect }: ContactFormProps) {
  const entityType = form.watch('entityType');
  const contactId = form.getValues('id'); 

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: "emails" });
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: "phones" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "socials" });
  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control: form.control, name: "addresses" });

  const getFullAddress = (index: number) => {
    const address = form.watch(`addresses.${index}`);
    return [address.street, address.number, address.city, address.postalCode].filter(Boolean).join(' ');
  }

  return (
    <Accordion type="multiple" defaultValue={['personal', 'identity', 'contact', 'addresses', 'job', 'socials', 'notes']} className="w-full">
      {/* 1. Βασικά Στοιχεία */}
      <AccordionItem value="personal">
        <AccordionTrigger>
          <div className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            <span>Βασικά Στοιχεία</span>
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
          <div className="flex items-center gap-2 text-primary">
            <Info className="h-5 w-5" />
            <span>Στοιχεία Ταυτότητας &amp; ΑΦΜ</span>
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
           <div className="flex items-center gap-2 text-primary">
            <Phone className="h-5 w-5" />
            <span>Στοιχεία Επικοινωνίας</span>
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
          <div className="flex items-center gap-2 text-primary">
            <LinkIcon className="h-5 w-5" />
            <span>Κοινωνικά Δίκτυα &amp; Websites</span>
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
       <AccordionItem value="addresses">
        <AccordionTrigger>
          <div className="flex items-center gap-2 text-primary">
            <Map className="h-5 w-5" />
            <span>Στοιχεία Διεύθυνσης</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
          <div className="flex justify-end">
             <Button type="button" variant="ghost" size="sm" onClick={() => appendAddress({ type: 'Κύρια' })}>
                <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Διεύθυνσης
            </Button>
          </div>
           <div className="space-y-4">
              {addressFields.map((field, index) => {
                 const fullAddress = getFullAddress(index);
                 const googleMapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;
                
                return (
                  <div key={field.id} className="p-4 border rounded-md bg-muted/30 space-y-4 relative">
                     <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeAddress(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                      <FormField control={form.control} name={`addresses.${index}.type`} render={({ field }) => (
                          <FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Τύπος Διεύθυνσης</FormLabel>
                          <div className="flex-1"><Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                              <SelectContent>{ADDRESS_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                          </Select><FormMessage /></div></FormItem>
                      )} />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`addresses.${index}.street`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Οδός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name={`addresses.${index}.number`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Αριθμός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name={`addresses.${index}.region`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Περιοχή</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name={`addresses.${index}.postalCode`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ταχ. Κώδικας</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name={`addresses.${index}.city`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Πόλη</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name={`addresses.${index}.municipality`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Δήμος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                     </div>
                      {googleMapsUrl && (
                        <div className="flex justify-end pt-2">
                          <Button asChild variant="outline" size="sm" type="button">
                              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                  <Map className="mr-2 h-4 w-4" />
                                  Προβολή στον Χάρτη
                              </a>
                          </Button>
                        </div>
                      )}
                  </div>
                )
              })}
           </div>
        </AccordionContent>
      </AccordionItem>

      {/* 6. Επαγγελματικά Στοιχεία */}
      {entityType !== 'Δημ. Υπηρεσία' && (
        <AccordionItem value="job">
            <AccordionTrigger>
              <div className="flex items-center gap-2 text-primary">
                <Briefcase className="h-5 w-5" />
                <span>Επαγγελματικά Στοιχεία</span>
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
          <div className="flex items-center gap-2 text-primary">
            <Info className="h-5 w-5" />
            <span>Σημειώσεις</span>
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
