'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Phone, PlusCircle, Trash2, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command';
import { type ContactFormProps } from '../types';
import { countryCodes } from '../utils/countryCodes';
import { PhoneIndicatorIcons, PHONE_INDICATORS } from '../utils/phoneIndicators';


export function ContactSection({ form }: ContactFormProps) {
    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: "emails" });
    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: "phones" });

    return (
        <AccordionItem value="contact">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <Phone className="h-5 w-5" />
                <span>Στοιχεία Επικοινωνίας</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-1 pt-4">
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
                            <FormField control={form.control} name={`emails.${index}.type`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`emails.${index}.value`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl></FormItem>)} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                        ))}
                    </div>
                </div>

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
                                <FormField control={form.control} name={`phones.${index}.type`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <div className="flex items-center gap-4">
                                    <FormLabel className="w-20 text-right">Αριθμός</FormLabel>
                                    <div className="flex-1 flex items-center gap-2">
                                        <FormField control={form.control} name={`phones.${index}.countryCode`} render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" role="combobox" className="w-[120px] justify-between">
                                                            {field.value ? countryCodes.find(c => c.code === field.value)?.flag : "Select"}
                                                            {field.value}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command><CommandInput placeholder="Search country..." /><CommandEmpty>No country found.</CommandEmpty>
                                                        <CommandList><CommandGroup>
                                                            {countryCodes.map((country) => (
                                                                <CommandItem key={country.code} value={country.name} onSelect={() => field.onChange(country.code)}>
                                                                    <Check className={cn("mr-2 h-4 w-4", country.code === field.value ? "opacity-100" : "opacity-0")}/>
                                                                    {country.flag} <span className="ml-2">{country.name} ({country.code})</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup></CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )}/>
                                        <FormField control={form.control} name={`phones.${index}.value`} render={({ field }) => (<FormControl><Input {...field} type="tel" /></FormControl>)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                    </div>
                                    <FormMessage>{form.formState.errors.phones?.[index]?.value?.message}</FormMessage>
                                </div>
                            </div>
                            <FormField
                            control={form.control}
                            name={`phones.${index}.indicators`}
                            render={() => (
                                <FormItem>
                                    <div className="flex items-center space-x-4 pl-1 pt-2">
                                    {PHONE_INDICATORS.map((indicator) => {
                                        const Icon = PhoneIndicatorIcons[indicator];
                                        return (
                                            <FormField
                                                key={indicator}
                                                control={form.control}
                                                name={`phones.${index}.indicators`}
                                                render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(indicator)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), indicator])
                                                            : field.onChange(
                                                                field.value?.filter((v) => v !== indicator)
                                                            );
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal text-sm flex items-center gap-1.5">
                                                        {Icon && <Icon className="h-4 w-4"/>}
                                                        {indicator}
                                                    </FormLabel>
                                                </FormItem>
                                                )}
                                            />
                                        );
                                    })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        ))}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
