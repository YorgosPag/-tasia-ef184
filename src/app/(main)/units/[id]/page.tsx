"use client";
import { Loader2 } from "lucide-react";
import { useUnitDetails } from "@/hooks/use-unit-details";
import dynamic from "next/dynamic";

const UnitDetailsPageView = dynamic(
  () =>
    import("@/components/units/UnitDetailsPageView").then(
      (mod) => mod.UnitDetailsPageView,
    ),
  {
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    ),
    ssr: false,
  },
);

export default function UnitDetailsPage() {
  const unitDetailsProps = useUnitDetails();

  if (unitDetailsProps.isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  // Ensure unit is not null before rendering the details view.
  // This satisfies the strict type requirement of UnitDetailsPageView.
  if (!unitDetailsProps.unit) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Δεν βρέθηκε το ακίνητο.</p>
      </div>
    );
  }

  return (
    <UnitDetailsPageView {...unitDetailsProps} unit={unitDetailsProps.unit} />
  );
}
