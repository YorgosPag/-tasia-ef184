"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import type { ContactFormProps } from "../types";
import { JobSection } from "../sections/JobSection";
import { RegistrationInfoSection } from "../sections/RegistrationInfoSection";
import { EnrichedDataSection } from "../sections/EnrichedDataSection";
import { HeadquartersSection } from "../sections/HeadquartersSection";
import { BranchesSection } from "../sections/BranchesSection";
import { ObjectiveSection } from "../sections/ObjectiveSection";
import { StatusesSection } from "../sections/StatusesSection";
import { CapitalSection } from "../sections/CapitalSection";
import { StocksSection } from "../sections/StocksSection";
import { DocumentsSection } from "../sections/DocumentsSection";
import { DocSummarySection } from "../sections/DocSummarySection";
import { ActivitiesSection } from "../sections/ActivitiesSection";
import { DecisionsSection } from "../sections/DecisionsSection";
import { EstablishmentSection } from "../sections/EstablishmentSection";
import { VersionsSection } from "../sections/VersionsSection";
import { ExternalLinksSection } from "../sections/ExternalLinksSection";
import { LegalRepresentativeSection } from "../sections/LegalRepresentativeSection";

export function GemhDataTabs({ form }: Pick<ContactFormProps, "form">) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="flex flex-wrap h-auto justify-start w-full gap-2">
        <TabsTrigger
          value="general"
          className="flex-1 min-w-[160px] text-center"
        >
          Γενικά Στοιχεία
        </TabsTrigger>
        <TabsTrigger
          value="representative"
          className="flex-1 min-w-[160px] text-center"
        >
          Νόμιμος Εκπρόσωπος
        </TabsTrigger>
        <TabsTrigger
          value="registration"
          className="flex-1 min-w-[160px] text-center"
        >
          Καταχώριση στο ΓΕΜΗ
        </TabsTrigger>
        <TabsTrigger
          value="enriched"
          className="flex-1 min-w-[160px] text-center"
        >
          Εμπλουτισμένα Στοιχεία
        </TabsTrigger>
        <TabsTrigger
          value="headquarters"
          className="flex-1 min-w-[160px] text-center"
        >
          Διεύθυνση Έδρας (ΓΕΜΗ)
        </TabsTrigger>
        <TabsTrigger
          value="branches"
          className="flex-1 min-w-[160px] text-center"
        >
          Καταστήματα / Υποκαταστήματα
        </TabsTrigger>
        <TabsTrigger
          value="objective"
          className="flex-1 min-w-[160px] text-center"
        >
          Σκοπός & Αντικείμενο
        </TabsTrigger>
        <TabsTrigger
          value="statuses"
          className="flex-1 min-w-[160px] text-center"
        >
          Καταστάσεις ΓΕΜΗ
        </TabsTrigger>
        <TabsTrigger
          value="capital"
          className="flex-1 min-w-[160px] text-center"
        >
          Κεφάλαιο Εταιρείας
        </TabsTrigger>
        <TabsTrigger
          value="stocks"
          className="flex-1 min-w-[160px] text-center"
        >
          Μετοχική Σύνθεση
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className="flex-1 min-w-[160px] text-center"
        >
          Έγγραφα ΓΕΜΗ
        </TabsTrigger>
        <TabsTrigger
          value="docSummary"
          className="flex-1 min-w-[160px] text-center"
        >
          Σύνοψη Εγγράφων ΓΕΜΗ
        </TabsTrigger>
        <TabsTrigger
          value="activities"
          className="flex-1 min-w-[160px] text-center"
        >
          Δραστηριότητες (ΚΑΔ)
        </TabsTrigger>
        <TabsTrigger
          value="decisions"
          className="flex-1 min-w-[160px] text-center"
        >
          Αποφάσεις Οργάνων
        </TabsTrigger>
        <TabsTrigger
          value="establishment"
          className="flex-1 min-w-[160px] text-center"
        >
          Στοιχεία Σύστασης (ΥΜΣ)
        </TabsTrigger>
        <TabsTrigger
          value="versions"
          className="flex-1 min-w-[160px] text-center"
        >
          Ιστορικό Εκδόσεων Εταιρείας
        </TabsTrigger>
        <TabsTrigger
          value="externalLinks"
          className="flex-1 min-w-[160px] text-center"
        >
          Σύνδεσμοι Τρίτων Φορέων
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-4">
        <JobSection form={form} />
      </TabsContent>

      <TabsContent value="representative" className="mt-4">
        <Accordion type="single" collapsible className="w-full">
          <LegalRepresentativeSection form={form} />
        </Accordion>
      </TabsContent>

      <TabsContent value="registration" className="mt-4">
        <RegistrationInfoSection form={form} />
      </TabsContent>

      <TabsContent value="enriched" className="mt-4">
        <EnrichedDataSection form={form} />
      </TabsContent>

      <TabsContent value="headquarters" className="mt-4">
        <HeadquartersSection form={form} />
      </TabsContent>

      <TabsContent value="branches" className="mt-4">
        <BranchesSection form={form} />
      </TabsContent>

      <TabsContent value="objective" className="mt-4">
        <ObjectiveSection form={form} />
      </TabsContent>

      <TabsContent value="statuses" className="mt-4">
        <StatusesSection form={form} />
      </TabsContent>

      <TabsContent value="capital" className="mt-4">
        <CapitalSection />
      </TabsContent>

      <TabsContent value="stocks" className="mt-4">
        <StocksSection />
      </TabsContent>

      <TabsContent value="documents" className="mt-4">
        <DocumentsSection />
      </TabsContent>

      <TabsContent value="docSummary" className="mt-4">
        <DocSummarySection form={form} />
      </TabsContent>

      <TabsContent value="activities" className="mt-4">
        <ActivitiesSection />
      </TabsContent>

      <TabsContent value="decisions" className="mt-4">
        <DecisionsSection />
      </TabsContent>

      <TabsContent value="establishment" className="mt-4">
        <EstablishmentSection />
      </TabsContent>

      <TabsContent value="versions" className="mt-4">
        <VersionsSection form={form} />
      </TabsContent>

      <TabsContent value="externalLinks" className="mt-4">
        <ExternalLinksSection form={form} />
      </TabsContent>
    </Tabs>
  );
}
