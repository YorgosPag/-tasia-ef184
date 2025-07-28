'use client';

import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import { Info } from 'lucide-react';
import { type ContactFormProps } from '../types';

export function NotesSection({ form }: ContactFormProps) {
    return (
        <AccordionItem value="notes">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                <span>Σημειώσεις</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="p-1 pt-4">
                <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Σημειώσεις</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder=""
                        className="resize-y"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </AccordionContent>
        </AccordionItem>
    );
}
