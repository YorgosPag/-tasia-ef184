'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Accordion } from '@/shared/components/ui/accordion';

import type { ContactFormProps } from '../types';
import { JobSection } from '../sections/JobSection';
import { RegistrationInfoSection } from '../sections/RegistrationInfoSection';
import { EnrichedDataSection } from '../sections/EnrichedDataSection';
import { HeadquartersSection } from '../sections/HeadquartersSection';
import { BranchesSection } from '../sections/BranchesSection';
import { ObjectiveSection } from '../sections/ObjectiveSection';
import { StatusesSection } from '../sections/StatusesSection';
import { CapitalSection } from '../sections/CapitalSection';
import { StocksSection } from '../sections/StocksSection';
import { DocumentsSection } from '../sections/DocumentsSection';
import { DocSummarySection } from '../sections/DocSummarySection';
import { ActivitiesSection } from '../sections/ActivitiesSection';
import { DecisionsSection } from '../sections/DecisionsSection';
import { EstablishmentSection } from '../sections/EstablishmentSection';
import { LegalRepresentativeSection } from '../sections/LegalRepresentativeSection';
import { VersionsSection } from '../sections/VersionsSection';
import { ExternalLinksSection } from '../sections/ExternalLinksSection';

export function GemhDataTabs({ form }: Pick<ContactFormProps, 'form'>) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="flex flex-wrap h-auto justify-start w-full gap-1">
        <TabsTrigger value="general">Γενικά Στοιχεία</TabsTrigger>
        <TabsTrigger value="registration">Καταχώριση στο ΓΕΜΗ</TabsTrigger>
        <TabsTrigger value="enriched">Εμπλουτισμένα Στοιχεία</TabsTrigger>
        <TabsTrigger value="headquarters">Διεύθυνση Έδρας (ΓΕΜΗ)</TabsTrigger>
        <TabsTrigger value="branches">Καταστήματα / Υποκαταστήματα</TabsTrigger>
        <TabsTrigger value="objective">Σκοπός & Αντικείμενο</TabsTrigger>
        <TabsTrigger value="statuses">Καταστάσεις ΓΕΜΗ</TabsTrigger>
        <TabsTrigger value="capital">Κεφάλαιο Εταιρείας</TabsTrigger>
        <TabsTrigger value="stocks">Μετοχική Σύνθεση</TabsTrigger>
        <TabsTrigger value="documents">Έγγραφα ΓΕΜΗ</TabsTrigger>
        <TabsTrigger value="docSummary">Σύνοψη Εγγράφων ΓΕΜΗ</TabsTrigger>
        <TabsTrigger value="activities">Δραστηριότητες (ΚΑΔ)</TabsTrigger>
        <TabsTrigger value="decisions">Αποφάσεις Οργάνων</TabsTrigger>
        <TabsTrigger value="establishment">Στοιχεία Σύστασης (ΥΜΣ)</TabsTrigger>
        <TabsTrigger value="representatives">Εκπρόσωποι από ΓΕΜΗ</TabsTrigger>
        <TabsTrigger value="versions">Ιστορικό Εκδόσεων Εταιρείας</TabsTrigger>
        <TabsTrigger value="externalLinks">Σύνδεσμοι Τρίτων Φορέων</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-4">
        <Accordion type="single" collapsible defaultValue="job" className="w-full space-y-2">
          <JobSection form={form} />
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

      <TabsContent value="representatives" className="mt-4">
        <Accordion type="single" collapsible defaultValue="representative" className="w-full">
          <LegalRepresentativeSection form={form} />
        </Accordion>
      </TabsContent>

      <TabsContent value="externalLinks" className="mt-4">
        <ExternalLinksSection form={form} />
      </TabsContent>
    </Tabs>
  );
}
