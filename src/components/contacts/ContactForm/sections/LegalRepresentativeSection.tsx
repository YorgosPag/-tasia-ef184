
'use client';

import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserCircle } from 'lucide-react';
import type { ContactFormProps } from '../types';
import { Card, CardContent } from '@/components/ui/card';

export function LegalRepresentativeSection({ form }: Pick<ContactFormProps, 'form'>) {
    return (
        <AccordionItem value="representative">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <UserCircle className="h-5 w-5" />
                <span>Νόμιμος Εκπρόσωπος</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="p-1 pt-4">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-4">
                                <FormItem>
                                    <FormLabel>Ονοματεπώνυμο</FormLabel>
                                    <FormControl><Input placeholder="π.χ. Ιωάννης Παπαδόπουλος" /></FormControl>
                                </FormItem>
                                 <FormItem>
                                    <FormLabel>Ιδιότητα</FormLabel>
                                    <FormControl><Input placeholder="π.χ. Διαχειριστής" /></FormControl>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>ΑΦΜ Εκπροσώπου</FormLabel>
                                    <FormControl><Input placeholder="9 ψηφία" /></FormControl>
                                </FormItem>
                             </div>
                             <div className="space-y-4">
                                 <FormItem>
                                    <FormLabel>ΔΟΥ Εκπροσώπου</FormLabel>
                                    <FormControl><Input placeholder="π.χ. ΔΟΥ Καλαμαριάς" /></FormControl>
                                </FormItem>
                                <FormItem>
                                    <FormLabel>Email Εκπροσώπου</FormLabel>
                                    <FormControl><Input type="email" placeholder="π.χ. representative@email.com" /></FormControl>
                                </FormItem>
                                 <FormItem>
                                    <FormLabel>Τηλέφωνο Εκπροσώπου</FormLabel>
                                    <FormControl><Input type="tel" placeholder="+30 69..." /></FormControl>
                                </FormItem>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
    );
}
