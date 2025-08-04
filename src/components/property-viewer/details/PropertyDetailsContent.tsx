"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { PropertyDetails } from "./types";
import { PropertyHeaderSection } from "./PropertyHeaderSection";
import { PropertyLocationSection } from "./PropertyLocationSection";
import { PropertySpecsSection } from "./PropertySpecsSection";
import { PropertyDescriptionSection } from "./PropertyDescriptionSection";
import { PropertyFeaturesSection } from "./PropertyFeaturesSection";
import { PropertyPeopleSection } from "./PropertyPeopleSection";
import { PropertyDocumentsSection } from "./PropertyDocumentsSection";
import { PropertyDatesSection } from "./PropertyDatesSection";
import { PropertyActionsSection } from "./PropertyActionsSection";

export function PropertyDetailsContent({ property }: { property: PropertyDetails }) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-1">
        <PropertyHeaderSection property={property} />
        <Separator />
        <PropertyLocationSection property={property} />
        <Separator />
        <PropertySpecsSection property={property} />
        {property.description && (
          <>
            <Separator />
            <PropertyDescriptionSection description={property.description} />
          </>
        )}
        {property.features.length > 0 && (
          <>
            <Separator />
            <PropertyFeaturesSection features={property.features} />
          </>
        )}
        {(property.owner || property.agent) && (
          <>
            <Separator />
            <PropertyPeopleSection owner={property.owner} agent={property.agent} />
          </>
        )}
        {property.documents.length > 0 && (
          <>
            <Separator />
            <PropertyDocumentsSection documents={property.documents} />
          </>
        )}
        <Separator />
        <PropertyDatesSection dates={property.dates} />
        <Separator />
        <PropertyActionsSection />
      </div>
    </ScrollArea>
  );
}