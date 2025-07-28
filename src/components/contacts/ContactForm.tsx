
'use client';

import React from 'react';
import { UseFormReturn, useFieldArray, useWatch } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon, PlusCircle, Trash2, User, Building2, Landmark, Info, Phone, Link as LinkIcon, Briefcase, Map, Linkedin, Facebook, Instagram, Github, Youtube, Globe, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ImageUploader } from './ImageUploader';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command';
import { AddressAutocompleteInput } from './AddressAutocompleteInput';


interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>;
  onFileSelect: (file: File | null) => void;
}

const PhoneIndicatorIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    Viber: (props) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#8a53a5" d="m14.49 11.33-1.34 1.17a.4.4 0 0 1-.55 0c-1.2-1.2-2.33-2.5-2.88-3.79a.4.4 0 0 1 .13-.56l1.34-1.18c.2-.18.23-.49.07-.72C10.96 5.83 9.55 3.67 9.35 3.33c-.19-.34-.59-.52-1-.49l-1.6.12c-.41.03-.78.27-1 .6-.22.33-1.14 1.5-1.14 3.22 0 2.22 1.21 4.4 3.48 6.62C8.36 15.68 10.5 16.9 12.75 16.9c1.72 0 2.89-.92 3.22-1.14.33-.22.57-.59.6-1l.12-1.6c.03-.41-.15-.81-.49-1-.34-.2-2.5-1.61-2.92-1.83Z"/></svg>
    ),
    WhatsApp: (props) => (
       <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#25D366" d="M16.75 13.96c.2.4.29.82.01 1.21-.28.39-.77.62-1.22.62-.24 0-.49-.06-.73-.18-1.43-.65-2.65-1.53-3.6-2.6-1.02-1.14-1.78-2.43-2.22-3.8-.13-.42-.06-.88.19-1.27.25-.39.66-.64 1.1-.64h.16c.21 0 .41.05.59.16.48.27.97.55 1.45.82.48.27.76.77.76 1.31 0 .18-.04.36-.12.52-.08.16-.18.3-.3.44-.12.14-.25.26-.25.43 0 .18.08.35.23.51.52.56 1.14 1.05 1.81 1.47.33.2.68.31 1.03.31.22 0 .43-.05.62-.16.3-.16.58-.4.78-.71.2-.31.32-.67.24-1.04-.08-.37-.28-.71-.56-1.01-.28-.3-.66-.54-1.07-.71-.41-.17-.85-.14-1.25.08-.4.22-.73.57-.96.99-.23.42-.3.89-.19 1.35.11.46.38.87.75 1.18.37.31.82.5 1.3.51h.01c.48 0 .95-.15 1.34-.44.39-.29.69-.67.87-1.11.18-.44.22-.92.1-1.38-.12-.46-.38-.87-.75-1.18-.37-.31-.82-.5-1.3-.51h.01Z"/></svg>
    ),
    Telegram: (props) => (
       <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#2AABEE" d="m9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-1.02.2-1.31L21.11 4.4c.79-.28 1.49.36 1.25 1.5l-2.4 11.5c-.21.98-1.04 1.2-1.8.75l-4.1-3.2l-1.89 1.8c-.16.16-.3.24-.5.24"/></svg>
    ),
};

const SOCIAL_TYPES = ['Website', 'LinkedIn', 'YouTube', 'Facebook', 'Instagram', 'GitHub', 'TikTok', 'Άλλο'];
const PHONE_INDICATORS = ['Viber', 'WhatsApp', 'Telegram'];
const ADDRESS_TYPES = ['Κατοικίας', 'Επαγγελματική', 'Έδρα', 'Υποκατάστημα', 'Αποθήκη', 'Εξοχικό', 'Άλλο'];

const countryCodes = [
  { name: 'Greece', code: '+30', flag: '🇬🇷' },
  { name: 'Cyprus', code: '+357', flag: '🇨🇾' },
  { name: 'Albania', code: '+355', flag: '🇦🇱' },
  { name: 'Bulgaria', code: '+359', flag: '🇧🇬' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
  { name: 'Italy', code: '+39', flag: '🇮🇹' },
  { name: 'Romania', code: '+40', flag: '🇷🇴' },
  { name: 'Turkey', code: '+90', flag: '🇹🇷' },
  { name: 'North Macedonia', code: '+389', flag: '🇲🇰' },
];

const socialIcons: { [key: string]: React.ElementType } = {
    Website: Globe,
    LinkedIn: Linkedin,
    Facebook: Facebook,
    Instagram: Instagram,
    GitHub: Github,
    YouTube: Youtube,
    TikTok: Info, // Placeholder
    default: LinkIcon,
};

const addressFieldsMap: {formKey: keyof ContactFormValues['addresses'][0], label: string, algoliaKey: string}[] = [
    { formKey: 'settlements', label: 'Οικισμός', algoliaKey: 'Οικισμοί' },
    { formKey: 'municipalLocalCommunities', label: 'Δημοτική/Τοπική Κοινότητα', algoliaKey: 'Δημοτικές/Τοπικές Κοινότητες' },
    { formKey: 'municipalUnities', label: 'Δημοτική Ενότητα', algoliaKey: 'Δημοτικές Ενότητες' },
    { formKey: 'municipality', label: 'Δήμος', algoliaKey: 'Δήμοι' },
    { formKey: 'regionalUnities', label: 'Περιφερειακή Ενότητα', algoliaKey: 'Περιφερειακές ενότητες' },
    { formKey: 'regions', label: 'Περιφέρεια', algoliaKey: 'Περιφέρειες' },
    { formKey: 'decentralizedAdministrations', label: 'Αποκεντρωμένη Διοίκηση', algoliaKey: 'Αποκεντρωμένες Διοικήσεις' },
    { formKey: 'largeGeographicUnits', label: 'Μεγάλη Γεωγραφική Ενότητα', algoliaKey: 'Μεγάλες γεωγραφικές ενότητες' },
];


export function ContactForm({ form, onFileSelect }: ContactFormProps) {
  const entityType = form.watch('entityType');
  const contactId = form.getValues('id'); 

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: "emails" });
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: "phones" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "socials" });
  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control: form.control, name: "addresses" });

  const getFullAddress = (index: number) => {
    const address = form.watch(`addresses.${index}`);
    return [address.street, address.number, address.settlements, address.postalCode, address.country].filter(Boolean).join(' ');
  }

  const handleAddressSelect = (index: number, hit: any) => {
     addressFieldsMap.forEach(field => {
        const val = hit[field.algoliaKey];
        const finalValue = Array.isArray(val) ? val[0] || '' : val || '';
        form.setValue(`addresses.${index}.${field.formKey}`, finalValue, { shouldDirty: true });
     })
  };


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
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Emails</h3>
                    <Button type="button" variant="ghost" size="sm" onClick={() => appendEmail({ type: 'Προσωπικό', value: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Email
                    </Button>
                </div>
                <div className="w-full space-y-2">
                    {emailFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 p-3 border rounded-md bg-muted/30 items-center">
                        <FormField control={form.control} name={`emails.${index}.type`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name={`emails.${index}.value`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl></FormItem>)} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Τηλέφωνα</h3>
                    <Button type="button" variant="ghost" size="sm" onClick={() => appendPhone({ type: 'Κινητό', countryCode: '+30', value: '', indicators: [] })}>
                        <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Τηλεφώνου
                    </Button>
                </div>
                <div className="w-full space-y-2">
                    {phoneFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col gap-3 p-3 border rounded-md bg-muted/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <FormField control={form.control} name={`phones.${index}.type`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <div className="flex items-center gap-4">
                                <FormLabel className="w-20 text-right">Αριθμός</FormLabel>
                                <div className="flex-1 flex items-center gap-2">
                                     <FormField control={form.control} name={`phones.${index}.countryCode`} render={({ field }) => (
                                         <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline" role="combobox" className="w-[120px] justify-between">
                                                        {field.value ? countryCodes.find(c => c.code === field.value)?.flag : "Select"}
                                                        {field.value}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command><CommandInput placeholder="Search country..." /><CommandEmpty>No country found.</CommandEmpty>
                                                    <CommandList><CommandGroup>
                                                        {countryCodes.map((country) => (
                                                            <CommandItem key={country.code} value={country.name} onSelect={() => field.onChange(country.code)}>
                                                                <Check className={cn("mr-2 h-4 w-4", country.code === field.value ? "opacity-100" : "opacity-0")}/>
                                                                {country.flag} <span className="ml-2">{country.name} ({country.code})</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup></CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                     )}/>
                                     <FormField control={form.control} name={`phones.${index}.value`} render={({ field }) => (<FormControl><Input {...field} type="tel" /></FormControl>)} />
                                     <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                                <FormMessage>{form.formState.errors.phones?.[index]?.value?.message}</FormMessage>
                            </div>
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
                    {socialFields.map((field, index) => {
                        const selectedType = form.watch(`socials.${index}.type`);
                        const Icon = socialIcons[selectedType] || socialIcons.default;
                        return (
                            <div key={field.id} className="p-3 border rounded-md bg-muted/30 space-y-4">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <FormField
                                        control={form.control}
                                        name={`socials.${index}.type`}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-4">
                                                <FormLabel className="w-20 text-right">Τύπος</FormLabel>
                                                <div className="flex-1">
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <div className="flex items-center gap-2">
                                                                    <Icon className="h-4 w-4" />
                                                                    <SelectValue/>
                                                                </div>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {SOCIAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField control={form.control} name={`socials.${index}.label`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Ετικέτα</FormLabel><div className="flex-1"><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Επαγγελματικό">Επαγγελματικό</SelectItem><SelectItem value="Προσωπικό">Προσωπικό</SelectItem></SelectContent></Select></div><FormMessage /></FormItem>)} />
                               </div>
                               <div className="flex items-center gap-4">
                                    <FormLabel className="w-20 text-right">URL</FormLabel>
                                    <div className="flex-1 flex items-center gap-2">
                                        <FormField control={form.control} name={`socials.${index}.url`} render={({ field }) => (<FormControl><Input {...field} /></FormControl>)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                    </div>
                                </div>
                                <FormMessage className="pl-24">{form.formState.errors.socials?.[index]?.url?.message}</FormMessage>
                            </div>
                        )
                    })}
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
             <Button type="button" variant="ghost" size="sm" onClick={() => appendAddress({ type: 'Κύρια', country: 'Ελλάδα' })}>
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
                          <div className="flex-1"><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{ADDRESS_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></div></FormItem>
                      )} />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`addresses.${index}.street`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Οδός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name={`addresses.${index}.number`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Αριθμός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name={`addresses.${index}.toponym`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Τοπωνύμιο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name={`addresses.${index}.postalCode`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ταχ. Κώδικας</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        
                        {addressFieldsMap.map(f => (
                           <AddressAutocompleteInput 
                                key={f.formKey}
                                form={form}
                                name={`addresses.${index}.${f.formKey}`}
                                label={f.label}
                                algoliaKey={f.algoliaKey}
                                onSelect={(hit: any) => handleAddressSelect(index, hit)}
                                indexName={process***REMOVED***.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
                            />
                        ))}
                        
                        <FormField control={form.control} name={`addresses.${index}.country`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Χώρα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
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

