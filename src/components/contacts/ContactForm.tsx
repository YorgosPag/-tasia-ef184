
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
import { FormItem, FormLabel, FormControl, FormField, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCustomLists } from '@/hooks/useCustomLists';
import { CreatableCombobox } from '@/components/common/autocomplete/CreatableCombobox';
import { addressFieldsMap, handleAddressSelect } from './ContactForm/utils/addressHelpers';
import { AddressAutocompleteInput } from '../common/autocomplete/AddressAutocompleteInput';


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

  const gemhAddressIndex = fields.findIndex((field, index) => form.getValues(`addresses.${index}.fromGEMI`));
  const gemhAddress = gemhAddressIndex !== -1 ? fields[gemhAddressIndex] : null;
  const manualAddresses = fields.filter((field, index) => !form.getValues(`addresses.${index}.fromGEMI`));

  
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
                        {gemhAddress ? (
                            <Card key={gemhAddress.fieldId} className="relative border-primary/50">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-primary">Έδρα</h3>
                                        <p className="text-sm text-destructive font-semibold">❗Αυτόματα από Γ.Ε.ΜΗ.</p>
                                    </div>
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
                 <Accordion type="multiple" defaultValue={['contact', 'socials']} className="w-full space-y-2">
                    <ContactSection form={form} />
                    <SocialsSection form={form} />
                    <AddressSection form={form} />
                    <NotesSection form={form} />
                 </Accordion>
            </TabsContent>
        </Tabs>
    </div>
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
