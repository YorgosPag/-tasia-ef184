
'use client';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/lib/validation/contactSchema';

export function useWatchedFields(form: UseFormReturn<ContactFormValues>) {
  return {
    entityType: useWatch({ control: form.control, name: 'entityType' }),
    addresses: useWatch({ control: form.control, name: 'addresses' }) || [],
  };
}
