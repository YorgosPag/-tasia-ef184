
'use client';

import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion';
import { Phone, Link as LinkIcon, Map as MapIcon, Info, User, Briefcase } from 'lucide-react';

import { BasicInfoSection } from '../sections/BasicInfoSection';
import { IdentitySection } from '../sections/IdentitySection';
import { ContactSection } from '../sections/ContactSection';
import { SocialsSection } from '../sections/SocialsSection';
import { AddressSection } from '../sections/AddressSection';
import { JobSection } from '../sections/JobSection';
import { NotesSection } from '../sections/NotesSection';
import type { ContactFormProps } from '../types';

export function NaturalPersonLayout({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {
  return (
    <Accordion type="multiple" value={openSections} onValueChange={onOpenChange} className="w-full">
        <AccordionItem value="personal">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <User className="h-5 w-5" />
                    <span>Βασικά Στοιχεία</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                 <BasicInfoSection form={form} onFileSelect={onFileSelect} />
            </AccordionContent>
        </AccordionItem>

        <IdentitySection form={form} />
      
        <AccordionItem value="contact">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <Phone className="h-5 w-5" />
                    <span>Επικοινωνία & Socials</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <ContactSection form={form} />
                <SocialsSection form={form} />
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="addresses">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <MapIcon className="h-5 w-5" />
                    <span>Διευθύνσεις</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <AddressSection form={form} />
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="job">
            <AccordionTrigger>
                <div className="flex items-center gap-2 text-primary">
                    <Briefcase className="h-5 w-5" />
                    <span>Επαγγελματικά Στοιχεία</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                 <JobSection form={form} />
            </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notes">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                <span>Σημειώσεις</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <NotesSection form={form} />
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  );
}
