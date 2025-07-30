
'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import type { ContactFormProps } from '../../types';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2 } from 'lucide-react';

export function EmailFieldSet({ form }: Pick<ContactFormProps, 'form'>) {
    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
        control: form.control,
        name: "emails"
    });

    return (
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
                        <FormField
                            control={form.control}
                            name={`emails.${index}.type`}
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-4">
                                    <FormLabel className="w-20 text-right">Τύπος</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`emails.${index}.value`}
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-4">
                                    <FormLabel className="w-20 text-right">Email</FormLabel>
                                    <FormControl><Input {...field} type="email" /></FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
