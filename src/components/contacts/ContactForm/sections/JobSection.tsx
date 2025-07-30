
'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { type ContactFormProps } from '../types';
import { useGemiData } from '../hooks/useGemiData';
import { GemiCompanyMetadata } from './job/GemiCompanyMetadata';
import { GemiCompanyInfo } from './job/GemiCompanyInfo';
import { JobRoleSection } from './job/JobRoleSection';

export function JobSection({ form }: Pick<ContactFormProps, 'form'>) {
    const { entityType } = useWatch({ control: form.control, name: 'entityType' });
    const { isLoadingGemi } = useGemiData(form);

    if (entityType === 'Δημ. Υπηρεσία' || entityType === 'Φυσικό Πρόσωπο') {
        return null;
    }
    
    return (
        <div className="space-y-4 p-1">
            <p className="text-xs text-muted-foreground -mt-2">Εισάγετε ΑΦΜ ή Αρ. ΓΕΜΗ για αυτόματη συμπλήρωση.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="job.arGemi" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Αριθμός ΓΕΜΗ</FormLabel>
                        <div className="relative">
                            <FormControl><Input {...field} /></FormControl>
                            {isLoadingGemi && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="afm" render={({ field }) => (
                    <FormItem>
                        <FormLabel>ΑΦΜ</FormLabel>
                        <div className="relative">
                            <FormControl><Input {...field} /></FormControl>
                            {isLoadingGemi && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            
            <GemiCompanyInfo form={form} />
            <GemiCompanyMetadata form={form} />
            <JobRoleSection form={form} />
        </div>
    );
}
