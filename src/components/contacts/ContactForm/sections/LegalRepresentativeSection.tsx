
'use client';

import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import { UserCircle } from 'lucide-react';
import { type ContactFormProps } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';

export function LegalRepresentativeSection({ form }: ContactFormProps) {
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
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground">
                            Αυτή η ενότητα είναι υπό κατασκευή. Εδώ θα μπορείτε να προσθέσετε και να διαχειριστείτε τους νόμιμους εκπροσώπους της εταιρείας.
                        </p>
                    </CardContent>
                </Card>
            </AccordionContent>
        </AccordionItem>
    );
}
