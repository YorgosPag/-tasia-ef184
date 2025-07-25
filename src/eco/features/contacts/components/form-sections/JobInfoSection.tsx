'use client';

import { FormTextField } from "@/eco/components/form/FormTextField";
import { FormSelectField } from "@/eco/components/form/FormSelectField";
import { Control } from "react-hook-form";
import { useCustomLists } from "@/eco/features/custom-lists/hooks/useCustomLists";

interface JobInfoSectionProps {
  control: Control<any>;
}

export function JobInfoSection({ control }: JobInfoSectionProps) {
  const { lists, isLoading: isLoadingLists } = useCustomLists();
  const rolesList = lists.find(l => l.title === 'Ρόλοι')?.items || [];

  return (
      <div className="space-y-4 pt-4">
        <div className="grid md:grid-cols-2 gap-4">
          <FormSelectField
            control={control}
            name="job.role"
            label="Ρόλος"
            options={rolesList}
            isLoading={isLoadingLists}
            placeholder="Επιλέξτε ρόλο..."
          />
          <FormTextField control={control} name="job.specialty" label="Επάγγελμα/Ειδικότητα" />
          <FormTextField control={control} name="job.companyName" label="Επιχείρηση/Οργανισμός" />
        </div>
      </div>
  );
}
