
'use client';

import React from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ADDRESS_TYPES } from '../../utils/addressHelpers';
import type { ContactFormValues } from '@/shared/lib/validation/contactSchema';

interface AddressTypeSelectProps {
    control: Control<ContactFormValues>;
    name: `addresses.${number}.type`;
}

export function AddressTypeSelect({ control, name }: AddressTypeSelectProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
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
            )}
        />
    );
}
