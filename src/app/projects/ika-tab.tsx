'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkersTabContent } from './ika/WorkersTabContent';
import { TimesheetTabContent } from './ika/TimesheetTabContent';
import { StampsCalculationTabContent } from './ika/StampsCalculationTabContent';
import { ApdPaymentsTabContent } from './ika/ApdPaymentsTabContent';


export function IkaTab() {
  return (
    <Tabs defaultValue="workers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="workers">Εργατοτεχνίτες</TabsTrigger>
            <TabsTrigger value="timesheet">Παρουσιολόγιο</TabsTrigger>
            <TabsTrigger value="stamps-calculation">Υπολογισμός Ενσήμων</TabsTrigger>
            <TabsTrigger value="apd-payments">ΑΠΔ & Πληρωμές</TabsTrigger>
        </TabsList>
        <TabsContent value="workers">
           <WorkersTabContent />
        </TabsContent>
        <TabsContent value="timesheet">
           <TimesheetTabContent />
        </TabsContent>
        <TabsContent value="stamps-calculation">
           <StampsCalculationTabContent />
        </TabsContent>
        <TabsContent value="apd-payments">
           <ApdPaymentsTabContent />
        </TabsContent>
    </Tabs>
  );
}
