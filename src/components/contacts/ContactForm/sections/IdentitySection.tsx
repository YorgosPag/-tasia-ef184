
'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { type ContactFormProps } from '../types';
import { CreatableCombobox } from '@/components/common/autocomplete/CreatableCombobox';
import { useCustomLists } from '@/hooks/useCustomLists';
import { useCustomListActions } from '@/hooks/useCustomListActions';
import { useDocumentNumberMask } from '../utils/documentMasks';

export function IdentitySection({ form }: ContactFormProps) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });
    const { lists, fetchAllLists } = useCustomLists();
    const { addNewItemToList } = useCustomListActions(lists, fetchAllLists);

    const identityTypesList = lists.find(l => l.id === 'jIt8lRiNcgatSchI90yd');
    const identityTypeOptions = identityTypesList?.items.map(item => ({
        value: item.value,
        label: item.value,
    })) || [];

    const handleCreateIdentityType = async (newValue: string) => {
        if (!identityTypesList) return null;
        return await addNewItemToList(identityTypesList.id, newValue, identityTypesList.hasCode);
    };

    const identityType = form.watch('identity.type');
    const { placeholder, formatValue } = useDocumentNumberMask(identityType);

    return (
        <div className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entityType === 'Φυσικό Πρόσωπο' && (
                    <>
                        <FormField
                            control={form.control}
                            name="identity.type"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-4">
                                    <FormLabel className="w-40 text-right">Τύπος</FormLabel>
                                    <div className="flex-1">
                                         <CreatableCombobox
                                            options={identityTypeOptions}
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            onCreate={handleCreateIdentityType}
                                            placeholder="π.χ. Ταυτότητα, Διαβατήριο..."
                                        />
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={form.control} 
                            name="identity.number" 
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-4">
                                    <FormLabel className="w-40 text-right">Αριθμός</FormLabel>
                                    <div className="flex-1">
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                placeholder={placeholder}
                                                onChange={(e) => {
                                                    const formattedValue = formatValue(e.target.value);
                                                    field.onChange(formattedValue);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )} 
                        />
                        <FormField control={form.control} name="identity.issueDate" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ημ/νία Έκδοσης</FormLabel><div className="flex-1"><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="identity.issuingAuthority" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Εκδ. Αρχή</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    </>
                )}
                <FormField control={form.control} name="afm" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">ΑΦΜ</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                <FormField control={form.control} name="doy" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">ΔΟΥ</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
            </div>
        </div>
    );
}
