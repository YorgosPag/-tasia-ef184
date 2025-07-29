
'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { ImageUploader } from '../../ImageUploader';
import { type ContactFormProps } from '../types';
import { cn } from '@/shared/lib/utils';
import { User, Building2, Landmark, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';


export function BasicInfoSection({ form }: Pick<ContactFormProps, 'form'|'onFileSelect'>) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });
    const contactId = form.getValues('id'); 

    const legalEntityFormContent = (
      <div className="space-y-4 pt-4">
        {entityType !== 'Νομικό Πρόσωπο' && (
             <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 space-y-2 sm:space-y-0">
                <FormLabel className="sm:w-40 sm:text-right sm:pt-2.5 shrink-0">Επωνυμία</FormLabel>
                <div className="flex-1 space-y-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormControl><Input {...field} placeholder="π.χ. DevConstruct AE" /></FormControl>
                        <FormDescription>Το πλήρες όνομα ή η εμπορική επωνυμία.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                </div>
            </div>
        )}
      </div>
    );

    return (
        <div className="space-y-4 p-1">
            <FormField
                control={form.control}
                name="entityType"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="sr-only">Τύπος Οντότητας</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('name', '', { shouldDirty: true }); // Clear name when type changes
                             if (value === 'Φυσικό Πρόσωπο') {
                                const firstName = form.getValues('firstName') || '';
                                const lastName = form.getValues('lastName') || '';
                                form.setValue('name', `${firstName} ${lastName}`.trim(), { shouldDirty: true });
                            }
                        }}
                        defaultValue={field.value}
                        value={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1"
                        >
                        <FormItem>
                            <FormControl>
                            <RadioGroupItem value="Φυσικό Πρόσωπο" id="Φυσικό Πρόσωπο" className="sr-only" />
                            </FormControl>
                            <Label
                            htmlFor="Φυσικό Πρόσωπο"
                            className={cn(
                                'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors',
                                'hover:bg-[#e46767]/10 hover:border-primary',
                                field.value === 'Φυσικό Πρόσωπο' && 'border-primary'
                            )}
                            >
                            <User className="mb-3 h-6 w-6" />
                            Φυσικό Πρόσωπο
                            </Label>
                        </FormItem>
                        <FormItem>
                            <FormControl>
                                <RadioGroupItem value="Νομικό Πρόσωπο" id="Νομικό Πρόσωπο" className="sr-only" />
                            </FormControl>
                            <Label
                            htmlFor="Νομικό Πρόσωπο"
                             className={cn(
                                'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors',
                                'hover:bg-[#e46767]/10 hover:border-primary',
                                field.value === 'Νομικό Πρόσωπο' && 'border-primary'
                            )}
                            >
                            <Building2 className="mb-3 h-6 w-6" />
                            Νομικό Πρόσωπο
                            </Label>
                        </FormItem>
                        <FormItem>
                            <FormControl>
                                <RadioGroupItem value="Δημ. Υπηρεσία" id="Δημ. Υπηρεσία" className="sr-only" />
                            </FormControl>
                            <Label
                            htmlFor="Δημ. Υπηρεσία"
                             className={cn(
                                'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors',
                                'hover:bg-[#e46767]/10 hover:border-primary',
                                field.value === 'Δημ. Υπηρεσία' && 'border-primary'
                            )}
                            >
                            <Landmark className="mb-3 h-6 w-6" />
                            Δημ. Υπηρεσία
                            </Label>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    </FormItem>
                )}
            />
            
            {entityType !== 'Φυσικό Πρόσωπο' && legalEntityFormContent}

            {entityType === 'Φυσικό Πρόσωπο' && (
                <div className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Όνομα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Επώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Πατρώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Μητρώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ημ/νία Γέννησης</FormLabel><div className="flex-1"><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()} /></PopoverContent></Popover><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Τόπος Γέννησης</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    </div>
                </div>
            )}
        </div>
    );
}
