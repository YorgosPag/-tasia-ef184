
'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { useCustomLists } from '@/hooks/useCustomLists';
import { useCustomListActions } from '@/shared/hooks/useCustomListActions';
import { CreatableCombobox } from '@/components/common/autocomplete/CreatableCombobox';

interface IssuingAuthorityFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export function IssuingAuthorityField({ form }: IssuingAuthorityFieldProps) {
  const { lists, fetchAllLists } = useCustomLists();
  const { addNewItemToList } = useCustomListActions(fetchAllLists);

  const issuingAuthoritiesList = lists.find(
    (l) => l.id === 'iGOjn86fcktREwMeDFPz'
  );

  const issuingAuthorityOptions =
    issuingAuthoritiesList?.items.map((item) => ({
      value: item.value,
      label: item.value,
    })) || [];
  
  const handleCreateIssuingAuthority = async (newValue: string) => {
    if (!issuingAuthoritiesList) return null;
    return await addNewItemToList(issuingAuthoritiesList.id, newValue, issuingAuthoritiesList.hasCode);
  }

  return (
    <FormField
      control={form.control}
      name="identity.issuingAuthority"
      render={({ field }) => (
        <FormItem className="flex items-center gap-4">
          <FormLabel className="w-40 text-right">Εκδ. Αρχή</FormLabel>
          <div className="flex-1">
            <CreatableCombobox
              options={issuingAuthorityOptions}
              value={field.value || ''}
              onChange={field.onChange}
              onCreate={handleCreateIssuingAuthority}
              placeholder="Επιλέξτε ή δημιουργήστε αρχή..."
            />
            <FormDescription>
              Επιλέξτε αρχή ή πληκτρολογήστε για να προσθέσετε νέα.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
