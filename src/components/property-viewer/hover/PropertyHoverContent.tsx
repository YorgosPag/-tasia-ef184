"use client";

import { Separator } from "@/components/ui/separator";
import { HoverHeaderSection } from "./HoverHeaderSection";
import { HoverInstructionSection } from "./HoverInstructionSection";
import { HoverLocationSection } from "./HoverLocationSection";
import { HoverPricingSection } from "./HoverPricingSection";
import { HoverQuickInfoSection } from "./HoverQuickInfoSection";
import type { PropertyHoverData } from "./types";

export function PropertyHoverContent({
  property,
}: {
  property: PropertyHoverData;
}) {
  return (
    <div className="space-y-3 p-1">
      <HoverHeaderSection property={property} />
      <Separator />
      <HoverLocationSection property={property} />
      <Separator />
      <HoverPricingSection property={property} />
      {property.quickInfo && (
        <>
          <Separator />
          <HoverQuickInfoSection quickInfo={property.quickInfo} />
        </>
      )}
      <Separator />
      <HoverInstructionSection />
    </div>
  );
}
