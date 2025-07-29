
'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { SOCIAL_TYPES, socialIcons } from '../../utils/socialIcons';
import { ContactFormValues } from '@/shared/lib/validation/contactSchema';

interface SocialFieldSetProps {
  form: UseFormReturn<ContactFormValues>;
  index: number;
  onRemove: () => void;
}

export function SocialFieldSet({ form, index, onRemove }: SocialFieldSetProps) {
    const selectedType = form.watch(`socials.${index}.type`);
    const Icon = socialIcons[selectedType] || socialIcons.default;
    
    return (
        <div className="p-3 border rounded-md bg-muted/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name={`socials.${index}.type`}
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="w-20 text-right">Τύπος</FormLabel>
                            <div className="flex-1">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4" />
                                                <SelectValue/>
                                            </div>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {SOCIAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField control={form.control} name={`socials.${index}.label`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Ετικέτα</FormLabel><div className="flex-1"><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Επαγγελματικό">Επαγγελματικό</SelectItem><SelectItem value="Προσωπικό">Προσωπικό</SelectItem></SelectContent></Select></div><FormMessage /></FormItem>)} />
        </div>
        <div className="flex items-center gap-4">
                <FormLabel className="w-20 text-right">URL</FormLabel>
                <div className="flex-1 flex items-center gap-2">
                    <FormField control={form.control} name={`socials.${index}.url`} render={({ field }) => (<FormControl><Input {...field} /></FormControl>)} />
                    <Button type="button" variant="ghost" size="icon" onClick={onRemove}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                </div>
        </div>
        <FormMessage className="pl-24">{form.formState.errors.socials?.[index]?.url?.message}</FormMessage>
        </div>
    );
}
