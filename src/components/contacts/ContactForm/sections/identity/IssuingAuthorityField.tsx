
'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/lib/validation/contactSchema';
import { useCustomLists } from '@/hooks/useCustomLists';
import { CreatableCombobox } from '@/components/common/autocomplete/CreatableCombobox';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/hooks/use-toast';

interface IssuingAuthorityFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export function IssuingAuthorityField({ form }: IssuingAuthorityFieldProps) {
  const { lists, fetchAllLists } = useCustomLists();

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
    if (!newValue.trim()) return null;

    try {
        await addDoc(collection(db, 'tsia-custom-lists', issuingAuthoritiesList.id, 'tsia-items'), {
            value: newValue,
            createdAt: serverTimestamp(),
        });
        toast({ title: 'Επιτυχία', description: `Η αρχή "${newValue}" προστέθηκε.` });
        fetchAllLists();
        return newValue;
    } catch (error) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η προσθήκη της νέας αρχής.'});
        return null;
    }
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
