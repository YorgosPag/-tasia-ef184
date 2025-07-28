
'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
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
import { FormItem, FormLabel, FormControl, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';


export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const entityType = useWatch({ control: form.control, name: 'entityType' });

  const renderLegalPersonForm = () => (
    <Accordion type="multiple" defaultValue={['personal']} className="w-full">
      <BasicInfoSection form={form} onFileSelect={onFileSelect} />
      
      {(entityType === 'Νομικό Πρόσωπο' || entityType === 'Δημ. Υπηρεσία') && (
        <div className="pt-4">
           <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Βασικά Στοιχεία</TabsTrigger>
              <TabsTrigger value="representative">Εκπρόσωπος</TabsTrigger>
              <TabsTrigger value="contact">Επικοινωνία</TabsTrigger>
              <TabsTrigger value="addresses">Διευθύνσεις</TabsTrigger>
              <TabsTrigger value="notes">Σημειώσεις</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="mt-4">
                <Accordion type="multiple" defaultValue={['identity', 'job']} className="w-full space-y-2">
                    <IdentitySection form={form} />
                    <JobSection form={form} />
                </Accordion>
            </TabsContent>

             <TabsContent value="representative" className="mt-4">
                <Accordion type="multiple" defaultValue={['representative']} className="w-full">
                  <LegalRepresentativeSection form={form} />
                </Accordion>
             </TabsContent>
            
            <TabsContent value="contact" className="mt-4">
                <Accordion type="multiple" defaultValue={['contact', 'socials']} className="w-full space-y-2">
                    <ContactSection form={form} />
                    <SocialsSection form={form} />
                </Accordion>
            </TabsContent>
            
            <TabsContent value="addresses" className="mt-4">
                <Accordion type="multiple" defaultValue={['addresses']} className="w-full">
                    <AccordionItem value="addresses">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2 text-primary">
                                <span>Έδρα Νομικού Προσώπου</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-1 pt-4">
                           <Card>
                             <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormItem><FormLabel>Οικισμός</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Δημοτική/Τοπική Κοινότητα</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Δημοτική Ενότητα</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Δήμος</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Περιφερειακή Ενότητα</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Περιφέρεια</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Αποκεντρωμένη Διοίκηση</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Μεγάλη Γεωγραφική Ενότητα</FormLabel><FormControl><Input /></FormControl></FormItem>
                                </div>
                                <div className="pt-4">
                                     <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Η έδρα αυτή προέρχεται από το ΓΕΜΗ</FormLabel>
                                            <FormDescription>Ενεργοποιήστε αν η διεύθυνση έχει αντληθεί αυτόματα από το ΓΕΜΗ.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch defaultChecked={false} />
                                        </FormControl>
                                    </FormItem>
                                </div>
                             </CardContent>
                           </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4">
                <Accordion type="multiple" defaultValue={['notes']} className="w-full">
                    <NotesSection form={form} />
                </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Accordion>
  );

  const renderDefaultForm = () => (
     <Accordion type="multiple" value={openSections} onValueChange={onOpenChange} className="w-full">
      <BasicInfoSection form={form} onFileSelect={onFileSelect} />
      <IdentitySection form={form} />
      <ContactSection form={form} />
      <SocialsSection form={form} />
      <AddressSection form={form} />
      <JobSection form={form} />
      <NotesSection form={form} />
    </Accordion>
  );

  return (entityType === 'Νομικό Πρόσωπο' || entityType === 'Δημ. Υπηρεσία') ? renderLegalPersonForm() : renderDefaultForm();
}
