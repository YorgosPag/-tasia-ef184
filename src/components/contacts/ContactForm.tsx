
'use client';

import React, { useState, useEffect } from 'react';
import { useWatch, useFieldArray } from 'react-hook-form';
import { Accordion } from '@/shared/components/ui/accordion';
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
import { FormItem, FormLabel, FormControl, FormDescription, FormField, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCustomLists } from '@/hooks/useCustomLists';
import { CreatableCombobox } from '@/components/common/autocomplete/CreatableCombobox';

export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  const entityType = useWatch({ control: form.control, name: 'entityType' });
  const { lists, addNewItemToList } = useCustomLists();

  const addressListKey = 'Yz439YFkR4U4eRAwDNy5';
  const addressTypeOptions = React.useMemo(() => {
    const addressList = lists.find(l => l.id === addressListKey);
    return addressList?.items.map(item => ({ label: item.value, value: item.value })) || [];
  }, [lists]);
  
  const handleCreateAddressType = async (value: string) => {
    const result = await addNewItemToList(addressListKey, value, false);
    return !!result;
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
    keyName: 'fieldId',
  });
  
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
                 <div className="space-y-4">
                    {/* Έδρα - First Address */}
                    <Card>
                      <CardContent className="p-6 space-y-4">
                         <h3 className="text-lg font-semibold text-primary">Έδρα (αυτόματη από το ΓΕΜΗ)</h3>
                         <p className="text-sm text-muted-foreground">Η διεύθυνση αυτή αντλείται αυτόματα από τα στοιχεία του ΓΕΜΗ.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <FormItem><FormLabel>Οδός</FormLabel><FormControl><Input /></FormControl></FormItem>
                            <FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input /></FormControl></FormItem>
                            <FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input /></FormControl></FormItem>
                            <FormItem><FormLabel>Χώρα</FormLabel><FormControl><Input /></FormControl></FormItem>
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
                             <FormField
                                name="addresses[0].fromGEMI"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Η έδρα αυτή προέρχεται από το ΓΕΜΗ</FormLabel>
                                            <FormDescription>Ενεργοποιήστε αν η διεύθυνση έχει αντληθεί αυτόματα από το ΓΕΜΗ.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional Addresses */}
                    {fields.map((field, index) => {
                         const addressType = form.watch(`addresses.${index}.type`);
                         const title = `Διεύθυνση ${index + 1}` + (addressType ? ` – ${addressType}` : '');
                         const fromGEMI = form.watch(`addresses.${index}.fromGEMI`);

                         return (
                            <Card key={field.fieldId} className="relative">
                              <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">{title}</h3>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                
                                <FormField
                                  name={`addresses.${index}.type`}
                                  control={form.control}
                                  render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Τύπος Διεύθυνσης</FormLabel>
                                         <CreatableCombobox 
                                            options={addressTypeOptions}
                                            value={field.value}
                                            onChange={(value) => {
                                                field.onChange(value);
                                            }}
                                            onCreate={handleCreateAddressType}
                                            placeholder="Επιλέξτε ή δημιουργήστε τύπο..."
                                        />
                                        <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <Separator />
                                <div className="text-sm text-muted-foreground mb-1">Διεύθυνση (χειροκίνητη εισαγωγή)</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField name={`addresses.${index}.street`} control={form.control} render={({field}) => (<FormItem><FormLabel>Οδός</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                                    <FormField name={`addresses.${index}.number`} control={form.control} render={({field}) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                                    <FormField name={`addresses.${index}.postalCode`} control={form.control} render={({field}) => (<FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                                    <FormField name={`addresses.${index}.country`} control={form.control} render={({field}) => (<FormItem><FormLabel>Χώρα</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>)}/>
                                    <FormItem><FormLabel>Οικισμός</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Δημοτική/Τοπική Κοινότητα</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Δημοτική Ενότητα</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Δήμος</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Περιφερειακή Ενότητα</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Περιφέρεια</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Αποκεντρωμένη Διοίκηση</FormLabel><FormControl><Input /></FormControl></FormItem>
                                    <FormItem><FormLabel>Μεγάλη Γεωγραφική Ενότητα</FormLabel><FormControl><Input /></FormControl></FormItem>
                                </div>
                                
                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <FormField
                                    name={`addresses.${index}.fromGEMI`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Από ΓΕΜΗ</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    name={`addresses.${index}.isActive`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Ενεργή διεύθυνση</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} defaultChecked={true} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                
                                {!fromGEMI && (
                                     <FormField
                                      name={`addresses.${index}.originNote`}
                                      control={form.control}
                                      render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Σημείωση για την προέλευση της διεύθυνσης</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="π.χ. Προστέθηκε από τον χρήστη έπειτα από επικοινωνία"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                )}
                              </CardContent>
                            </Card>
                         )
                    })}

                    <div className="flex justify-end">
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ type: '', isActive: true, street: '', number: '', postalCode: '', country: 'Ελλάδα' })}>
                            <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Διεύθυνσης
                        </Button>
                    </div>

                </div>
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
