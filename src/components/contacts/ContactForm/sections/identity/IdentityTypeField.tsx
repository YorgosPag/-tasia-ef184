
'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { CreatableCombobox } from '@/components/common/autocomplete/CreatableCombobox';
import { useCustomLists } from '@/hooks/useCustomLists';
import type { UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/lib/validation/contactSchema';

interface IdentityTypeFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export function IdentityTypeField({ form }: IdentityTypeFieldProps) {
  const { lists } = useCustomLists();

  const identityTypesList = lists.find(
    (l) => l.id === 'jIt8lRiNcgatSchI90yd'
  );
  const identityTypeOptions =
    identityTypesList?.items.map((item) => ({
      value: item.value,
      label: item.value,
    })) || [];

  // This is a placeholder as adding to the list is not required from this combobox
  // It just allows the user to enter a custom value in the form state.
  const handleCreateIdentityType = async (newValue: string) => {
    return newValue;
  };
  
  return (
    <FormField
      control={form.control}
      name="identity.type"
      render={({ field }) => (
        <FormItem className="flex items-center gap-4">
          <FormLabel className="w-40 text-right">Τύπος</FormLabel>
          <div className="flex-1">
            <CreatableCombobox
              options={identityTypeOptions}
              value={field.value || ''}
              onChange={field.onChange}
              onCreate={handleCreateIdentityType}
              placeholder="π.χ. Ταυτότητα, Διαβατήριο..."
            />
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
