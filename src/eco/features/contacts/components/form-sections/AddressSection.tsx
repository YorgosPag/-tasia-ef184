'use client';

import { FormTextField } from "@/eco/components/form/FormTextField";
import { Control } from "react-hook-form";

interface AddressSectionProps {
  control: Control<any>;
}

export function AddressSection({ control }: AddressSectionProps) {
  return (
    <div className="space-y-4 pt-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormTextField control={control} name="address.street" label="Οδός" />
          <FormTextField control={control} name="address.number" label="Αριθμός" />
          <FormTextField control={control} name="address.region" label="Περιοχή" />
          <FormTextField control={control} name="address.postalCode" label="Τ.Κ." />
          <FormTextField control={control} name="address.municipality" label="Δήμος" />
          <FormTextField control={control} name="address.city" label="Πόλη/Νομός" />
        </div>
      </div>
  );
}
