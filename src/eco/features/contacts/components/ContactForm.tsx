
'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2, X, Calendar as CalendarIcon } from 'lucide-react';
import type { Contact } from '../hooks/useContacts';
import { useCustomLists } from '../../custom-lists/hooks/useCustomLists';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const contactSchema = z.object({
  name: z.string().min(1, 'Το όνομα/επωνυμία είναι υποχρεωτικό.'),
  entityType: z.enum(['Φυσικό Πρόσωπο', 'Νομικό Πρόσωπο', 'Δημ. Υπηρεσία']),
  
  // Personal Info
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  birthDate: z.date().optional().nullable(),
  birthPlace: z.string().optional(),
  gender: z.enum(['Άνδρας', 'Γυναίκα', 'Άλλο']).optional(),
  nationality: z.string().optional(),
  photoUrl: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),

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
    instagram: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
    tiktok: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
  }).optional(),

  // Address Info
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
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
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  isSubmitting: boolean;
  onSubmit: (data: ContactFormValues) => void;
  onCancel: () => void;
  initialData?: Contact | null;
}

export const ContactForm = ({ isSubmitting, onSubmit, onCancel, initialData }: ContactFormProps) => {
  const { lists, isLoading: isLoadingLists } = useCustomLists();
  const rolesList = lists.find(l => l.title === 'Ρόλοι')?.items || [];

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

  const selectedEntityType = useWatch({ control: form.control, name: 'entityType' });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{initialData ? 'Επεξεργασία Επαφής' : 'Νέα Επαφή'}</h2>
            <Button variant="ghost" size="icon" onClick={onCancel} type="button">
                <X className="h-5 w-5" />
            </Button>
        </div>
        
        <FormField
            control={form.control}
            name="entityType"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>Τύπος Επαφής</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col md:flex-row space-y-1 md:space-y-0 md:space-x-4"
                    >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="Φυσικό Πρόσωπο" /></FormControl>
                        <FormLabel className="font-normal">Φυσικό Πρόσωπο</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="Νομικό Πρόσωπο" /></FormControl>
                        <FormLabel className="font-normal">Νομικό Πρόσωπο</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="Δημ. Υπηρεσία" /></FormControl>
                        <FormLabel className="font-normal">Δημόσια Υπηρεσία</FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <Accordion type="multiple" defaultValue={['personal-info', 'id-tax-info', 'contact-info', 'socials-info', 'address-info', 'job-info', 'other-info']} className="w-full space-y-2">
            <AccordionItem value="personal-info">
                <AccordionTrigger>Προσωπικά Στοιχεία</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Επωνυμία / Ονοματεπώνυμο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    {selectedEntityType === 'Φυσικό Πρόσωπο' && (
                        <>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Όνομα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Επώνυμο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem><FormLabel>Όνομα Πατέρα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem><FormLabel>Όνομα Μητέρας</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Ημ/νία Γέννησης</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, 'PPP') : <span>Επιλογή</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()}/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem><FormLabel>Τόπος Γέννησης</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Φύλο</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Άνδρας">Άνδρας</SelectItem><SelectItem value="Γυναίκα">Γυναίκα</SelectItem><SelectItem value="Άλλο">Άλλο</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="nationality" render={({ field }) => (<FormItem><FormLabel>Υπηκοότητα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                            <FormField control={form.control} name="photoUrl" render={({ field }) => (<FormItem><FormLabel>Φωτογραφία (URL)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        </>
                    )}
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="id-tax-info">
                <AccordionTrigger>Στοιχεία Ταυτότητας &amp; ΑΦΜ</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <FormField control={form.control} name="afm" render={({ field }) => (<FormItem><FormLabel>Α.Φ.Μ.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="identity.number" render={({ field }) => (<FormItem><FormLabel>Α.Δ. Ταυτότητας</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="identity.issueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Ημερομηνία Έκδοσης</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, 'PPP') : <span>Επιλογή</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1980} toYear={new Date().getFullYear()}/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                    <FormField control={form.control} name="identity.issuingAuthority" render={({ field }) => (<FormItem><FormLabel>Αρχή Έκδοσης</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="contact-info">
                <AccordionTrigger>Στοιχεία Επικοινωνίας</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                     <FormField control={form.control} name="contactInfo.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="contactInfo.landline" render={({ field }) => (<FormItem><FormLabel>Σταθερό Τηλέφωνο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (<FormItem><FormLabel>Κινητό Τηλέφωνο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="socials-info">
                <AccordionTrigger>Κοινωνικά Δίκτυα</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                     <FormField control={form.control} name="socials.website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="socials.facebook" render={({ field }) => (<FormItem><FormLabel>Facebook</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="socials.instagram" render={({ field }) => (<FormItem><FormLabel>Instagram</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="socials.tiktok" render={({ field }) => (<FormItem><FormLabel>TikTok</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="address-info">
                <AccordionTrigger>Στοιχεία Διεύθυνσης</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="address.street" render={({ field }) => (<FormItem><FormLabel>Οδός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="address.number" render={({ field }) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="address.region" render={({ field }) => (<FormItem><FormLabel>Περιοχή</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="address.postalCode" render={({ field }) => (<FormItem><FormLabel>Τ.Κ.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="address.municipality" render={({ field }) => (<FormItem><FormLabel>Δήμος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="address.city" render={({ field }) => (<FormItem><FormLabel>Πόλη/Νομός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="job-info">
                <AccordionTrigger>Επαγγελματικά Στοιχεία</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                     <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem><FormLabel>Ρόλος</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger>{isLoadingLists ? <Loader2 className="h-4 w-4 animate-spin"/> : <SelectValue/>}</SelectTrigger></FormControl><SelectContent>{rolesList.map(role => <SelectItem key={role.id} value={role.value}>{role.value}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem><FormLabel>Επάγγελμα/Ειδικότητα</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                     <FormField control={form.control} name="job.companyName" render={({ field }) => (<FormItem><FormLabel>Επιχείρηση/Οργανισμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="other-info">
                <AccordionTrigger>Λοιπά</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                     <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Σημειώσεις</FormLabel><FormControl><Textarea {...field} rows={5}/></FormControl><FormMessage /></FormItem>)}/>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Άκυρο
          </Button>
          <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Αποθήκευση Αλλαγών
          </Button>
        </div>
      </form>
    </Form>
  );
};
