'use client';

import { FormTextField } from "@/eco/components/form/FormTextField";
import { Control } from "react-hook-form";

interface ContactInfoSectionProps {
  control: Control<any>;
}

export function ContactInfoSection({ control }: ContactInfoSectionProps) {
  return (
      <div className="space-y-4 pt-4">
        <div className="grid md:grid-cols-2 gap-4">
            <FormTextField control={control} name="contactInfo.email" label="Email" type="email" />
            <FormTextField control={control} name="contactInfo.landline" label="Σταθερό Τηλέφωνο" />
            <FormTextField control={control} name="contactInfo.phone" label="Κινητό Τηλέφωνο" />
        </div>
      </div>
  );
}
