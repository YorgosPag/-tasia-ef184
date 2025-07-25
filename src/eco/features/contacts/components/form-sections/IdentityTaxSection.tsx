'use client';

import { FormTextField } from "@/eco/components/form/FormTextField";
import { FormDateField } from "@/eco/components/form/FormDateField";
import { Control } from "react-hook-form";

interface IdentityTaxSectionProps {
  control: Control<any>;
}

export function IdentityTaxSection({ control }: IdentityTaxSectionProps) {
  return (
      <div className="space-y-4 pt-4">
        <div className="grid md:grid-cols-2 gap-4">
            <FormTextField control={control} name="afm" label="Α.Φ.Μ." />
            <FormTextField control={control} name="identity.number" label="Α.Δ. Ταυτότητας" />
            <FormDateField control={control} name="identity.issueDate" label="Ημερομηνία Έκδοσης" fromYear={1980} toYear={new Date().getFullYear()} />
            <FormTextField control={control} name="identity.issuingAuthority" label="Αρχή Έκδοσης" />
        </div>
      </div>
  );
}
