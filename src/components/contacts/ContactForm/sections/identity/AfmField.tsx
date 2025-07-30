
'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/lib/validation/contactSchema';

interface AfmFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export function AfmField({ form }: AfmFieldProps) {
  return (
    <FormField
      control={form.control}
      name="afm"
      render={({ field }) => (
        <FormItem className="flex items-center gap-4">
          <FormLabel className="w-40 text-right">ΑΦΜ</FormLabel>
          <div className="flex-1">
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
