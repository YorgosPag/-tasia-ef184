
'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useDocumentNumberMask } from '@/hooks/useDocumentNumberMask';
import type { UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/shared/lib/validation/contactSchema';

interface IdentityNumberFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export function IdentityNumberField({ form }: IdentityNumberFieldProps) {
  const identityType = form.watch('identity.type');
  const { placeholder, formatValue } = useDocumentNumberMask(identityType);
  
  return (
    <FormField
      control={form.control}
      name="identity.number"
      render={({ field }) => (
        <FormItem className="flex items-center gap-4">
          <FormLabel className="w-40 text-right">Αριθμός</FormLabel>
          <div className="flex-1">
            <FormControl>
              <Input
                {...field}
                placeholder={placeholder}
                onChange={(e) => {
                  const formattedValue = formatValue(e.target.value);
                  field.onChange(formattedValue);
                }}
              />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
