import type { UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/shared/lib/validation/contactSchema';

export const ADDRESS_TYPES = ['Κατοικίας', 'Επαγγελματική', 'Έδρα', 'Υποκατάστημα', 'Αποθήκη', 'Εξοχικό', 'Άλλο'];

export const addressFieldsMap: { formKey: keyof ContactFormValues['addresses'][0], label: string, algoliaKey: string }[] = [
  { formKey: 'settlements', label: 'Οικισμός', algoliaKey: 'Οικισμοί' },
  { formKey: 'municipalLocalCommunities', label: 'Δημοτική/Τοπική Κοινότητα', algoliaKey: 'Δημοτικές/Τοπικές Κοινότητες' },
  { formKey: 'municipalUnities', label: 'Δημοτική Ενότητα', algoliaKey: 'Δημοτικές Ενότητες' },
  { formKey: 'municipality', label: 'Δήμος', algoliaKey: 'Δήμοι' },
  { formKey: 'regionalUnities', label: 'Περιφερειακή Ενότητα', algoliaKey: 'Περιφερειακές ενότητες' },
  { formKey: 'regions', label: 'Περιφέρεια', algoliaKey: 'Περιφέρειες' },
  { formKey: 'decentralizedAdministrations', label: 'Αποκεντρωμένη Διοίκηση', algoliaKey: 'Αποκεντρωμένες Διοικήσεις' },
  { formKey: 'largeGeographicUnits', label: 'Μεγάλη Γεωγραφική Ενότητα', algoliaKey: 'Μεγάλες γεωγραφικές ενότητες' },
];

export const getFullAddress = (form: UseFormReturn<ContactFormValues>, index: number) => {
  const address = form.watch(`addresses.${index}`);
  if (!address) return '';
  return [address.street, address.number, address.settlements, address.postalCode, address.country, address.poBox]
    .filter(Boolean)
    .join(' ');
};

export const handleAddressSelect = (
  form: UseFormReturn<ContactFormValues>,
  idx: number,
  hit: any
) => {
  addressFieldsMap.forEach(({ formKey, algoliaKey }) => {
    const raw = hit[algoliaKey];

    let value: string = '';

    if (Array.isArray(raw)) {
      value = raw.find((v) => typeof v === 'string') || '';
    } else if (typeof raw === 'string') {
      value = raw;
    }

    if (value) {
      form.setValue(`addresses.${idx}.${formKey}` as const, value, { shouldDirty: true });
    }
  });
};
