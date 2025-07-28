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
      finalValue = val[0] || '';
    } else if (typeof val === 'string') {
      finalValue = val;
    }
    const currentValue = form.getValues(`addresses.${idx}.${fieldMap.formKey}` as const);
    
    // Always set the value if a selection is made from autocomplete.
    // The user can manually override it later if needed.
    form.setValue(`addresses.${idx}.${fieldMap.formKey}` as const, finalValue, { shouldDirty: true });
  });
};
