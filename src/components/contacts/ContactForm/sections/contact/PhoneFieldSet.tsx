
'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import type { ContactFormProps } from '../../types';
import { Button } from '@/shared/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';
import { CountryCodeSelect } from './CountryCodeSelect';
import { PhoneIndicators } from './PhoneIndicators';

export function PhoneFieldSet({ form }: Pick<ContactFormProps, 'form'>) {
    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control: form.control,
        name: "phones"
    });

    return (
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
                            <FormField
                                control={form.control}
                                name={`phones.${index}.type`}
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-4">
                                        <FormLabel className="w-20 text-right">Τύπος</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-4">
                                <FormLabel className="w-20 text-right">Αριθμός</FormLabel>
                                <div className="flex-1 flex items-center gap-2">
                                    <CountryCodeSelect
                                        control={form.control}
                                        name={`phones.${index}.countryCode`}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`phones.${index}.value`}
                                        render={({ field }) => (<FormControl><Input {...field} type="tel" /></FormControl>)}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                                <FormMessage>{form.formState.errors.phones?.[index]?.value?.message}</FormMessage>
                            </div>
                        </div>
                        <PhoneIndicators
                            control={form.control}
                            name={`phones.${index}.indicators`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
