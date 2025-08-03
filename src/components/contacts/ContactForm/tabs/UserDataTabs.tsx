"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactSection } from "../sections/ContactSection";
import { SocialsSection } from "../sections/SocialsSection";
import { AddressSection } from "../sections/AddressSection";
import { NotesSection } from "../sections/NotesSection";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "@/lib/validation/contactSchema";
import { BasicInfoSection } from "../sections/BasicInfoSection";
import { Card, CardContent } from "@/components/ui/card";

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
        <Card>
          <CardContent className="p-4">
            <BasicInfoSection form={form} onFileSelect={() => {}} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="contact" className="mt-4">
        <Card>
          <CardContent className="p-4">
            <ContactSection form={form} />
            <SocialsSection form={form} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="addresses" className="mt-4">
        <Card>
          <CardContent className="p-4">
            <AddressSection form={form} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notes" className="mt-4">
        <Card>
          <CardContent className="p-4">
            <NotesSection form={form} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
