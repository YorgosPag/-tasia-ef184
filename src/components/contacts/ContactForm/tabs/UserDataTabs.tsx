
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Phone, Map as MapIcon, Info, User } from "lucide-react";
import { ContactSection } from "../sections/ContactSection";
import { SocialsSection } from "../sections/SocialsSection";
import { AddressSection } from "../sections/AddressSection";
import { NotesSection } from "../sections/NotesSection";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "@/lib/validation/contactSchema";
import { BasicInfoSection } from "../sections/BasicInfoSection";

interface UserDataTabsProps {
  form: UseFormReturn<ContactFormValues>;
}

export function UserDataTabs({ form }: UserDataTabsProps) {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="flex flex-wrap h-auto justify-start w-full gap-2">
        <TabsTrigger
          value="basic"
          className="flex-1 min-w-[160px] text-center"
        >
          Βασικά Στοιχεία
        </TabsTrigger>
        <TabsTrigger
          value="contact"
          className="flex-1 min-w-[160px] text-center"
        >
          Επικοινωνία & Socials
        </TabsTrigger>
        <TabsTrigger
          value="addresses"
          className="flex-1 min-w-[160px] text-center"
        >
          Διευθύνσεις
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex-1 min-w-[160px] text-center">
          Σημειώσεις
        </TabsTrigger>
      </TabsList>
      <TabsContent value="basic" className="mt-4">
        <Accordion
          type="single"
          collapsible
          defaultValue="basic"
          className="w-full"
        >
          <AccordionItem value="basic">
            <AccordionTrigger>
              <div className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                <span>Βασικά Στοιχεία</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-1">
              <BasicInfoSection form={form} onFileSelect={() => {}} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
      <TabsContent value="contact" className="mt-4">
        <Accordion
          type="single"
          collapsible
          defaultValue="contact"
          className="w-full"
        >
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
        </Accordion>
      </TabsContent>
      <TabsContent value="addresses" className="mt-4">
        <Accordion
          type="single"
          collapsible
          defaultValue="addresses"
          className="w-full"
        >
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
        </Accordion>
      </TabsContent>
      <TabsContent value="notes" className="mt-4">
        <Accordion
          type="single"
          collapsible
          defaultValue="notes"
          className="w-full"
        >
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
      </TabsContent>
    </Tabs>
  );
}
