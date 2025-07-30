
'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { type ContactFormProps } from '../types';
import { AddressCard } from './address/AddressCard';

export function AddressSection({ form }: ContactFormProps) {
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
            <Button type="button" variant="ghost" size="sm" onClick={() => append({ type: 'Κύρια', country: 'Ελλάδα', fromGEMI: false })}>
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
