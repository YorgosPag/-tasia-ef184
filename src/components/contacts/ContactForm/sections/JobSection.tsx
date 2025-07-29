
'use client';

import React, { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Briefcase, Loader2 } from 'lucide-react';
import { type ContactFormProps } from '../types';
import { useDebounce } from 'use-debounce';
import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';

const GEMI_API_URL = 'https://opendata-api.businessportal.gr/api/opendata/v1/companies/';
const GEMI_API_KEY = 'b98MlVJ7vDF8gQIWN6d79cgStU8QJp9o';


export function JobSection({ form }: Pick<ContactFormProps, 'form'>) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });
    const arGemiValue = useWatch({ control: form.control, name: 'job.arGemi' });
    const afmValue = useWatch({ control: form.control, name: 'afm' });
    const isBranch = useWatch({ control: form.control, name: 'job.isBranch' });
    const autoRegistered = useWatch({ control: form.control, name: 'job.autoRegistered' });


    const [debouncedArGemi] = useDebounce(arGemiValue, 1000);
    const [debouncedAfm] = useDebounce(afmValue, 1000);
    
    const [isLoadingGemi, setIsLoadingGemi] = useState(false);
    
    const clearGemiFields = () => {
        form.setValue('job.companyName', '');
        form.setValue('job.companyTitle', '');
        form.setValue('job.commercialTitle', '');
        form.setValue('job.gemhStatus', '');
        form.setValue('job.gemhDate', '');
        form.setValue('job.gemhActivity', '');
        form.setValue('job.gemhDOY', '');
        form.setValue('job.gemhGemiOffice', '');
        form.setValue('job.isBranch', undefined);
        form.setValue('job.autoRegistered', undefined);
        form.setValue('job.legalType', '');
        form.setValue('job.prefecture', '');
        // Also remove the GEMI address if it exists
        const currentAddresses = form.getValues('addresses') || [];
        const nonGemiAddresses = currentAddresses.filter(addr => !addr.fromGEMI);
        form.setValue('addresses', nonGemiAddresses, { shouldDirty: true });
    }

    useEffect(() => {
        const fetchGemiData = async () => {
            const searchKey = debouncedArGemi?.trim() || debouncedAfm?.trim();
            if (!searchKey) {
                clearGemiFields();
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
                    const dataArray = await response.json();
                    if(dataArray && dataArray.length > 0) {
                        const companyData = dataArray[0];
                         // Map GEMH data to form fields
                         form.setValue('job.companyName', companyData.brandName || '', { shouldDirty: true });
                         form.setValue('job.companyTitle', companyData.title || '', { shouldDirty: true });
                         form.setValue('job.commercialTitle', companyData.distinctiveTitle || '', { shouldDirty: true });
                         form.setValue('job.gemhStatus', companyData.status || '', { shouldDirty: true });
                         form.setValue('job.gemhDate', companyData.statusDate || '', { shouldDirty: true });
                         form.setValue('job.gemhActivity', companyData.activity || '', { shouldDirty: true });
                         form.setValue('job.gemhDOY', companyData.doy || '', { shouldDirty: true });
                         form.setValue('job.gemhGemiOffice', companyData.gemiOffice?.descr || '', { shouldDirty: true });
                         form.setValue('job.isBranch', companyData.isBranch || false, { shouldDirty: true });
                         form.setValue('job.autoRegistered', companyData.autoRegistered || false, { shouldDirty: true });
                         form.setValue('job.legalType', companyData.legalType?.descr || '', { shouldDirty: true });
                         form.setValue('job.prefecture', companyData.prefecture?.descr || '', { shouldDirty: true });
                         form.setValue('afm', companyData.afm || afmValue, { shouldDirty: true });
                         form.setValue('job.arGemi', companyData.gemiNo || arGemiValue, { shouldDirty: true });

                        const rawAddress = companyData.address || '';
                        if(rawAddress) {
                            const addressParts = rawAddress.split(',').map((p:string) => p.trim());
                            let streetPart = addressParts[0] || '';
                            let cityPart = addressParts[1] || '';
                            let zipPart = addressParts[2] || '';
                            const streetMatch = streetPart.match(/^(.*)\s([\d\w-]+)$/);
                            let street = streetMatch ? streetMatch[1] : streetPart;
                            let number = streetMatch ? streetMatch[2] : '';
                            const postalCodeRegex = /\b\d{5}\b/;
                            let postalCode = '';
                            if(zipPart && postalCodeRegex.test(zipPart)) {
                                postalCode = zipPart;
                            } else if (cityPart && postalCodeRegex.test(cityPart)) {
                                postalCode = cityPart.match(postalCodeRegex)?.[0] || '';
                                cityPart = cityPart.replace(postalCode, '').trim();
                            }

                            const currentAddresses = form.getValues('addresses') || [];
                            const gemiAddressIndex = currentAddresses.findIndex(addr => addr.fromGEMI);
                            const newAddress = {
                                type: 'Έδρα (ΓΕΜΗ)',
                                fromGEMI: true,
                                street: street,
                                number: number,
                                municipality: cityPart,
                                postalCode: postalCode,
                                country: 'Ελλάδα',
                                poBox: companyData.poBox || '',
                                toponym: '', settlements: '', municipalLocalCommunities: '',
                                municipalUnities: '', regionalUnities: '', regions: '',
                                decentralizedAdministrations: '', largeGeographicUnits: '',
                                isActive: true, customTitle: '', originNote: 'Fetched from GEMH'
                            };
                            
                            if (gemiAddressIndex > -1) {
                                form.setValue(`addresses.${gemiAddressIndex}`, newAddress, { shouldDirty: true });
                            } else {
                                form.setValue('addresses', [...currentAddresses, newAddress], { shouldDirty: true });
                            }
                        }

                    } else {
                         console.warn('Δεν βρέθηκε επιχείρηση στο ΓΕΜΗ');
                         clearGemiFields();
                    }
                } else if (response.status === 404) {
                    console.warn('Δεν βρέθηκε επιχείρηση στο ΓΕΜΗ');
                    clearGemiFields();
                } else {
                    console.error('Error fetching from GEMI API:', response.statusText);
                    clearGemiFields();
                }
            } catch (error) {
                console.error('Network error while fetching from GEMI API:', error);
                clearGemiFields();
            } finally {
                setIsLoadingGemi(false);
            }
        };

        fetchGemiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedArGemi, debouncedAfm]);


    if (entityType === 'Δημ. Υπηρεσία' || entityType === 'Φυσικό Πρόσωπο') {
        return null;
    }
    
    const getAutoRegisteredText = () => {
        if (typeof autoRegistered === 'boolean') {
            return autoRegistered ? 'Αυτοεγγεγραμμένη Εταιρεία' : 'Κανονική Εγγραφή (μέσω Γ.Ε.ΜΗ.)';
        }
        return '-';
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
                <FormField control={form.control} name="job.gemhDOY" render={({ field }) => (<FormItem><FormLabel>ΔΟΥ (από ΓΕΜΗ)</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.gemhGemiOffice" render={({ field }) => (<FormItem><FormLabel>Τοπική Υπηρεσία Γ.Ε.ΜΗ.</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.legalType" render={({ field }) => (<FormItem><FormLabel>Νομική Μορφή</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.prefecture" render={({ field }) => (<FormItem><FormLabel>Νομός</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>Υποκατάστημα / Μητρική</FormLabel>
                        <FormControl>
                            <Badge variant="outline" className="text-muted-foreground block w-fit mt-2">
                            {typeof isBranch === 'boolean' ? (isBranch ? 'Υποκατάστημα' : 'Μητρική Εταιρεία') : '-'}
                            </Badge>
                        </FormControl>
                        <FormDescription>Η πληροφορία αντλείται αυτόματα από το ΓΕΜΗ.</FormDescription>
                    </FormItem>
                    <FormItem>
                        <FormLabel>Τρόπος Εγγραφής</FormLabel>
                        <FormControl>
                            <Badge variant="outline" className="text-muted-foreground block w-fit mt-2">
                            {getAutoRegisteredText()}
                            </Badge>
                        </FormControl>
                        <FormDescription>Η πληροφορία αντλείται αυτόματα από το ΓΕΜΗ.</FormDescription>
                    </FormItem>
                </div>
                <FormField control={form.control} name="job.companyName" render={({ field }) => (<FormItem><FormLabel>Επωνυμία</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.commercialTitle" render={({ field }) => (<FormItem><FormLabel>Διακριτικός Τίτλος</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.companyTitle" render={({ field }) => (<FormItem><FormLabel>Τίτλος</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.gemhActivity" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Δραστηριότητα</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.gemhStatus" render={({ field }) => (<FormItem><FormLabel>Κατάσταση ΓΕΜΗ</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="job.gemhDate" render={({ field }) => (<FormItem><FormLabel>Ημ/νία Κατάστασης</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <Separator/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ρόλος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ειδικότητα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
            </div>
        </div>
    );
}

    
    

    

    