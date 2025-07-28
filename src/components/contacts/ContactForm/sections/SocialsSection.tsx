'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Link as LinkIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { type ContactFormProps } from '../types';
import { SOCIAL_TYPES, socialIcons } from '../utils/socialIcons';


export function SocialsSection({ form }: ContactFormProps) {
    const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "socials" });

    return (
        <AccordionItem value="socials">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <LinkIcon className="h-5 w-5" />
                <span>Κοινωνικά Δίκτυα &amp; Websites</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Σύνδεσμοι</h3>
                        <Button type="button" variant="ghost" size="sm" onClick={() => appendSocial({ type: 'Website', label: 'Επαγγελματικό', url: '' })}>
                            <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Link
                        </Button>
                    </div>
                    <div className="w-full space-y-2">
                        {socialFields.map((field, index) => {
                            const selectedType = form.watch(`socials.${index}.type`);
                            const Icon = socialIcons[selectedType] || socialIcons.default;
                            return (
                                <div key={field.id} className="p-3 border rounded-md bg-muted/30 space-y-4">
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
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                </div>
                                <FormMessage className="pl-24">{form.formState.errors.socials?.[index]?.url?.message}</FormMessage>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </AccordionContent>
      </AccordionItem>
    );
}
