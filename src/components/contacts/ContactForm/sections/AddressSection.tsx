'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Map, PlusCircle, Trash2 } from 'lucide-react';
import { AddressAutocompleteInput } from '@/components/common/autocomplete/AddressAutocompleteInput';
import { addressFieldsMap, ADDRESS_TYPES, getFullAddress, handleAddressSelect } from '../utils/addressHelpers';
import { type ContactFormProps } from '../types';


export function AddressSection({ form }: ContactFormProps) {
    const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control: form.control, name: "addresses" });

    return (
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
              const fullAddress = getFullAddress(form, index);
              const googleMapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;

              return (
                <div key={field.id} className="p-4 border rounded-md bg-muted/30 space-y-4 relative">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeAddress(index)}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                  <FormField control={form.control} name={`addresses.${index}.type`} render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-40 text-right">Τύπος Διεύθυνσης</FormLabel>
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ADDRESS_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name={`addresses.${index}.street`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Οδός</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${index}.number`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Αριθμός</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${index}.toponym`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Τοπωνύμιο</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${index}.postalCode`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Ταχ. Κώδικας</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    {addressFieldsMap.map(f => (
                      <AddressAutocompleteInput
                        key={f.formKey}
                        form={form}
                        name={`addresses.${index}.${f.formKey}`}
                        label={f.label}
                        algoliaKey={f.algoliaKey}
                        onSelect={(hit: any) => handleAddressSelect(form, index, hit)}
                        indexName={process***REMOVED***.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
                      />
                    ))}
                    <FormField control={form.control} name={`addresses.${index}.country`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Χώρα</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
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
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
}
