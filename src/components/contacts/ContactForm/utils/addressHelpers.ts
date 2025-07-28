import type { UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/shared/lib/validation/contactSchema';

export const ADDRESS_TYPES = ['Κατοικίας', 'Επαγγελματική', 'Έδρα', 'Υποκατάστημα', 'Αποθήκη', 'Εξοχικό', 'Άλλο'];

export const addressFieldsMap: {formKey: keyof ContactFormValues['addresses'][0], label: string, algoliaKey: string}[] = [
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
    return [address.street, address.number, address.settlements, address.postalCode, address.country].filter(Boolean).join(' ');
}

export const handleAddressSelect = (form: UseFormReturn<ContactFormValues>, idx: number, hit: any) => {
  addressFieldsMap.forEach(fieldMap => {
    const val = hit[fieldMap.algoliaKey];
    let finalValue = '';
    
    if (Array.isArray(val)) {
      // Find the first string value in the array, if any
      finalValue = val.find(v => typeof v === 'string') || '';
    } else if (typeof val === 'string') {
      finalValue = val;
    }
    
    // Set the value in the form
    form.setValue(`addresses.${idx}.${fieldMap.formKey}` as const, finalValue, { shouldDirty: true });
  });
};
