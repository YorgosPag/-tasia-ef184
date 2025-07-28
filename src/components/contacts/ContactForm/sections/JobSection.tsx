
'use client';

import React, { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Briefcase, Loader2 } from 'lucide-react';
import { type ContactFormProps } from '../types';
import { useDebounce } from 'use-debounce';

const GEMI_API_URL = 'https://opendata-api.businessportal.gr/api/opendata/v1/companies/';
const GEMI_API_KEY = 'b98MlVJ7vDF8gQIWN6d79cgStU8QJp9o';


export function JobSection({ form }: ContactFormProps) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });
    const arGemiValue = useWatch({ control: form.control, name: 'job.arGemi' });
    const [debouncedArGemi] = useDebounce(arGemiValue, 1000);
    const [isLoadingGemi, setIsLoadingGemi] = useState(false);

    useEffect(() => {
        const fetchGemiData = async () => {
            if (!debouncedArGemi || debouncedArGemi.trim().length === 0) {
                return;
            }
            setIsLoadingGemi(true);
            try {
                const response = await fetch(`${GEMI_API_URL}${debouncedArGemi}`, {
                    headers: {
                        'x-api-key': GEMI_API_KEY,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('GEMI Data Found:', data);
                } else if (response.status === 404) {
                    console.warn('Δεν βρέθηκε επιχείρηση στο ΓΕΜΗ');
                } else {
                    console.error('Error fetching from GEMI API:', response.statusText);
                }
            } catch (error) {
                console.error('Network error while fetching from GEMI API:', error);
            } finally {
                setIsLoadingGemi(false);
            }
        };

        fetchGemiData();
    }, [debouncedArGemi]);


    if (entityType === 'Δημ. Υπηρεσία') {
        return null;
    }

    return (
        <AccordionItem value="job">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <Briefcase className="h-5 w-5" />
                <span>Επαγγελματικά Στοιχεία</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ρόλος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ειδικότητα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.companyName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Επιχείρηση/Οργανισμός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.arGemi" render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="w-40 text-right">Αριθμός ΓΕΜΗ</FormLabel>
                            <div className="flex-1 relative">
                                <FormControl><Input {...field} placeholder="Εισάγετε αρ. ΓΕΜΗ για αυτόματη λήψη..." /></FormControl>
                                {isLoadingGemi && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                                <FormMessage />
                            </div>
                        </FormItem>
                    )} />
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
