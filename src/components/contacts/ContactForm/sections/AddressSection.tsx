
'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Map as MapIcon, PlusCircle, Trash2 } from 'lucide-react';
import { AddressAutocompleteInput } from '@/components/common/autocomplete/AddressAutocompleteInput';
import { addressFieldsMap, ADDRESS_TYPES, getFullAddress, handleAddressSelect } from '../utils/addressHelpers';
import { type ContactFormProps } from '../types';


export function AddressSection({ form }: ContactFormProps) {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: 'addresses',
      keyName: 'fieldId',
    });

    const manualAddresses = fields.filter((_, index) => !form.getValues(`addresses.${index}.fromGEMI`));
    const originalIndices = new Map(fields.map((field, index) => [field.fieldId, index]));


    return (
        <div className="space-y-4 p-1">
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => append({ type: 'Κύρια', country: 'Ελλάδα', fromGEMI: false })}>
              <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Διεύθυνσης
            </Button>
          </div>
          <div className="space-y-4">
            {manualAddresses.map((field, relativeIndex) => {
              const originalIndex = originalIndices.get(field.fieldId)!;
              const fullAddress = getFullAddress(form, originalIndex);
              const googleMapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;

              return (
                <div key={field.fieldId} className="p-4 border rounded-md bg-muted/30 space-y-4 relative">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => remove(originalIndex)}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                  <FormField control={form.control} name={`addresses.${originalIndex}.type`} render={({ field }) => (
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
                    <FormField control={form.control} name={`addresses.${originalIndex}.street`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Οδός</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${originalIndex}.number`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Αριθμός</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${originalIndex}.postalCode`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Ταχ. Κώδικας</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${originalIndex}.country`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Χώρα</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${originalIndex}.toponym`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Τοπωνύμιο</FormLabel>
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
                        name={`addresses.${originalIndex}.${f.formKey}`}
                        label={f.label}
                        algoliaKey={f.algoliaKey}
                        onSelect={(hit: any) => handleAddressSelect(form, originalIndex, hit)}
                        indexName={process***REMOVED***.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
                      />
                    ))}
                  </div>
                  {googleMapsUrl && (
                    <div className="flex justify-end pt-2">
                      <Button asChild variant="outline" size="sm" type="button">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                          <MapIcon className="mr-2 h-4 w-4" />
                          Προβολή στον Χάρτη
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    )
}
