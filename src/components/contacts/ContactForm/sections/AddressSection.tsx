
'use client';

import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddressCard } from './address/AddressCard';
import { ContactFormValues } from '@/lib/validation/contactSchema';

interface AddressSectionProps {
    form: UseFormReturn<ContactFormValues>;
}

export function AddressSection({ form }: AddressSectionProps) {
    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: 'addresses',
      keyName: 'fieldId',
    });

    const manualAddresses = fields.filter((_, index) => !form.getValues(`addresses.${index}.fromGEMI`));
    const originalIndices = new Map(fields.map((field, index) => [field.fieldId, index]));

    return (
        <div className="space-y-4 p-1">
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => append({ type: 'Κύρια', country: 'Ελλάδα', fromGEMI: false, isActive: true })}>
              <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Διεύθυνσης
            </Button>
          </div>
          <div className="space-y-4">
            {manualAddresses.map((field, relativeIndex) => {
              const originalIndex = originalIndices.get(field.fieldId)!;
              return (
                <AddressCard
                  key={field.fieldId}
                  form={form}
                  index={originalIndex}
                  onRemove={() => remove(originalIndex)}
                />
              );
            })}
          </div>
        </div>
    )
}
