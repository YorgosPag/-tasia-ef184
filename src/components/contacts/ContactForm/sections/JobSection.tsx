
'use client';

import React, { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Briefcase, Loader2 } from 'lucide-react';
import { type ContactFormProps } from '../types';
import { useDebounce } from 'use-debounce';
import { Separator } from '@/shared/components/ui/separator';

const GEMI_API_URL = 'https://opendata-api.businessportal.gr/api/opendata/v1/companies/';
const GEMI_API_KEY = 'b98MlVJ7vDF8gQIWN6d79cgStU8QJp9o';


export function JobSection({ form }: ContactFormProps) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });
    const arGemiValue = useWatch({ control: form.control, name: 'job.arGemi' });
    const afmValue = useWatch({ control: form.control, name: 'afm' });

    const [debouncedArGemi] = useDebounce(arGemiValue, 1000);
    const [debouncedAfm] = useDebounce(afmValue, 1000);
    
    const [isLoadingGemi, setIsLoadingGemi] = useState(false);

    useEffect(() => {
        const fetchGemiData = async () => {
            const searchKey = debouncedArGemi?.trim() || debouncedAfm?.trim();
            if (!searchKey) {
                return;
            }
            setIsLoadingGemi(true);
            try {
                const response = await fetch(`${GEMI_API_URL}${searchKey}`, {
                    headers: {
                        'x-api-key': GEMI_API_KEY,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if(data && data.length > 0) {
                        const companyData = data[0];
                         form.setValue('job.companyName', companyData.brandName, { shouldDirty: true });
                         form.setValue('job.companyTitle', companyData.title, { shouldDirty: true });
                         form.setValue('job.commercialTitle', companyData.distinctiveTitle, { shouldDirty: true });
                         form.setValue('job.gemhStatus', companyData.status, { shouldDirty: true });
                         form.setValue('job.gemhDate', companyData.statusDate, { shouldDirty: true });
                         form.setValue('job.gemhAddress', companyData.address, { shouldDirty: true });
                         form.setValue('job.gemhActivity', companyData.activity, { shouldDirty: true });
                         form.setValue('job.gemhDOY', companyData.doy, { shouldDirty: true });
                         form.setValue('afm', companyData.afm, { shouldDirty: true });
                         form.setValue('doy', companyData.doy, { shouldDirty: true });
                         form.setValue('job.arGemi', companyData.gemiNo, { shouldDirty: true });
                    } else {
                         console.warn('Δεν βρέθηκε επιχείρηση στο ΓΕΜΗ');
                    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedArGemi, debouncedAfm, form.setValue]);


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
                </div>
                 
                 <Separator/>
                  <h4 className="text-sm font-medium pt-2">Στοιχεία από ΓΕΜΗ</h4>
                  <p className="text-xs text-muted-foreground -mt-2">Εισάγετε ΑΦΜ ή Αρ. ΓΕΜΗ για αυτόματη συμπλήρωση.</p>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="job.arGemi" render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="w-40 text-right">Αριθμός ΓΕΜΗ</FormLabel>
                            <div className="flex-1 relative">
                                <FormControl><Input {...field} /></FormControl>
                                {isLoadingGemi && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                                <FormMessage />
                            </div>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="job.companyName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Επωνυμία</FormLabel><div className="flex-1"><FormControl><Input {...field} disabled /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.companyTitle" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Τίτλος</FormLabel><div className="flex-1"><FormControl><Input {...field} disabled /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.commercialTitle" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Διακριτικός Τίτλος</FormLabel><div className="flex-1"><FormControl><Input {...field} disabled /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.gemhStatus" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Κατάσταση ΓΕΜΗ</FormLabel><div className="flex-1"><FormControl><Input {...field} disabled /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.gemhDate" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ημ/νία Κατάστασης</FormLabel><div className="flex-1"><FormControl><Input {...field} disabled /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.gemhDOY" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">ΔΟΥ (από ΓΕΜΗ)</FormLabel><div className="flex-1"><FormControl><Input {...field} disabled /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.gemhActivity" render={({ field }) => (<FormItem className="flex items-center gap-4 md:col-span-2"><FormLabel className="w-40 text-right">Δραστηριότητα</FormLabel><div className="flex-1"><FormControl><Input {...field} disabled /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.gemhAddress" render={({ field }) => (<FormItem className="flex items-center gap-4 md:col-span-2"><FormLabel className="w-40 text-right">Διεύθυνση ΓΕΜΗ</FormLabel><div className="flex-1"><FormControl><Input {...field} disabled /></FormControl><FormMessage /></div></FormItem>)} />
                 </div>
            </AccordionContent>
        </AccordionItem>
    );
}
