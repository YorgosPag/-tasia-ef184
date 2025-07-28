
'use client';

import React, { useState, useEffect } from 'react';
import { useWatch, useFieldArray } from 'react-hook-form';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent } from '@/shared/components/ui/card';
import { BasicInfoSection } from './ContactForm/sections/BasicInfoSection';
import { IdentitySection } from './ContactForm/sections/IdentitySection';
import { ContactSection } from './ContactForm/sections/ContactSection';
import { AddressSection } from './ContactForm/sections/AddressSection';
import { JobSection } from './ContactForm/sections/JobSection';
import { NotesSection } from './ContactForm/sections/NotesSection';
import { type ContactFormProps } from './ContactForm/types';
import { SocialsSection } from './ContactForm/sections/SocialsSection';
import { LegalRepresentativeSection } from './ContactForm/sections/LegalRepresentativeSection';
import { FormItem, FormLabel, FormControl, FormField, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Phone, Link as LinkIcon, Map as MapIcon, Info, UserCircle } from 'lucide-react';


export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const entityType = useWatch({ control: form.control, name: 'entityType' });
  const addresses = useWatch({ control: form.control, name: 'addresses' }) || [];
  const gemhAddressIndex = addresses.findIndex(addr => addr.fromGEMI);
  
  const renderLegalPersonForm = () => (
     <div className="w-full space-y-4">
        <Accordion type="multiple" defaultValue={['personal']} className="w-full">
            <BasicInfoSection form={form} onFileSelect={onFileSelect} />
        </Accordion>
        
        <Tabs defaultValue="gemh-data" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gemh-data">Στοιχεία από ΓΕΜΗ</TabsTrigger>
                <TabsTrigger value="user-data">Στοιχεία από Χρήστη</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gemh-data" className="mt-4">
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">Γενικά Στοιχεία</TabsTrigger>
                        <TabsTrigger value="headquarters">Διεύθυνση Έδρας (ΓΕΜΗ)</TabsTrigger>
                        <TabsTrigger value="representatives">Εκπρόσωποι από ΓΕΜΗ</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="mt-4">
                        <Accordion type="single" collapsible defaultValue="job" className="w-full space-y-2">
                             <JobSection form={form} />
                        </Accordion>
                    </TabsContent>
                    
                     <TabsContent value="headquarters" className="mt-4">
                        {gemhAddressIndex !== -1 ? (
                             <Card key={JSON.stringify(addresses[gemhAddressIndex])} className="relative border-destructive/50">
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-sm text-destructive font-semibold text-center mb-4">
                                       ❗ Τα παρακάτω στοιχεία αντλήθηκαν αυτόματα από το Γ.Ε.ΜΗ.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField name={`addresses.${gemhAddressIndex}.street`} control={form.control} render={({field}) => (<FormItem><FormLabel>Οδός</FormLabel><FormControl><Input {...field} disabled /></FormControl></FormItem>)}/>
                                        <FormField name={`addresses.${gemhAddressIndex}.number`} control={form.control} render={({field}) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
                                        <FormField name={`addresses.${gemhAddressIndex}.postalCode`} control={form.control} render={({field}) => (<FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
                                        <FormField name={`addresses.${gemhAddressIndex}.municipality`} control={form.control} render={({field}) => (<FormItem><FormLabel>Δήμος/Πόλη</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">Δεν βρέθηκε διεύθυνση από το ΓΕΜΗ.</div>
                        )}
                    </TabsContent>

                    <TabsContent value="representatives" className="mt-4">
                         <Accordion type="single" collapsible defaultValue="representative" className="w-full">
                            <LegalRepresentativeSection form={form} />
                        </Accordion>
                    </TabsContent>
                </Tabs>
            </TabsContent>

            <TabsContent value="user-data" className="mt-4">
                 <Tabs defaultValue="contact" className="w-full">
                     <TabsList className="grid w-full grid-cols-3">
                         <TabsTrigger value="contact">Επικοινωνία & Socials</TabsTrigger>
                         <TabsTrigger value="addresses">Διευθύνσεις</TabsTrigger>
                         <TabsTrigger value="notes">Σημειώσεις</TabsTrigger>
                     </TabsList>
                      <TabsContent value="contact" className="mt-4">
                         <Accordion type="single" collapsible defaultValue="contact" className="w-full">
                              <AccordionItem value="contact">
                                 <AccordionTrigger>
                                     <div className="flex items-center gap-2 text-primary">
                                         <Phone className="h-5 w-5" />
                                         <span>Επικοινωνία & Socials</span>
                                     </div>
                                 </AccordionTrigger>
                                 <AccordionContent className="p-1">
                                     <ContactSection form={form} />
                                     <SocialsSection form={form} />
                                 </AccordionContent>
                             </AccordionItem>
                         </Accordion>
                     </TabsContent>
                      <TabsContent value="addresses" className="mt-4">
                         <Accordion type="single" collapsible defaultValue="addresses" className="w-full">
                              <AccordionItem value="addresses">
                                 <AccordionTrigger>
                                     <div className="flex items-center gap-2 text-primary">
                                         <MapIcon className="h-5 w-5" />
                                         <span>Διευθύνσεις</span>
                                     </div>
                                 </AccordionTrigger>
                                 <AccordionContent className="p-1">
                                     <AddressSection form={form} />
                                 </AccordionContent>
                             </AccordionItem>
                         </Accordion>
                     </TabsContent>
                      <TabsContent value="notes" className="mt-4">
                         <Accordion type="single" collapsible defaultValue="notes" className="w-full">
                             <AccordionItem value="notes">
                                 <AccordionTrigger>
                                     <div className="flex items-center gap-2 text-primary">
                                         <Info className="h-5 w-5" />
                                         <span>Σημειώσεις</span>
                                     </div>
                                 </AccordionTrigger>
                                 <AccordionContent className="p-1">
                                     <NotesSection form={form} />
                                 </AccordionContent>
                             </AccordionItem>
                         </Accordion>
                     </TabsContent>
                 </Tabs>
            </TabsContent>
        </Tabs>
    </div>
  );

  const renderDefaultForm = () => (
     <Accordion type="multiple" value={openSections} onValueChange={onOpenChange} className="w-full">
      <BasicInfoSection form={form} onFileSelect={onFileSelect} />
      <IdentitySection form={form} />
      <AccordionItem value="contact">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <Phone className="h-5 w-5" />
                    <span>Επικοινωνία & Socials</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <ContactSection form={form} />
                <SocialsSection form={form} />
            </AccordionContent>
      </AccordionItem>
      <AccordionItem value="addresses">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <MapIcon className="h-5 w-5" />
                    <span>Διευθύνσεις</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <AddressSection form={form} />
            </AccordionContent>
      </AccordionItem>
      <JobSection form={form} />
      <AccordionItem value="notes">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <Info className="h-5 w-5" />
                    <span>Σημειώσεις</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <NotesSection form={form} />
            </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (entityType === 'Νομικό Πρόσωπο') ? renderLegalPersonForm() : renderDefaultForm();
}
