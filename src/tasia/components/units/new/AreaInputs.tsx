

'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

const AREA_FIELDS = [
  { name: 'netArea', label: 'Καθαρά' },
  { name: 'grossArea', label: 'Μικτά' },
  { name: 'commonArea', label: 'Κοινόχρηστα' },
  { name: 'semiOutdoorArea', label: 'Ημιυπαίθριοι' },
  { name: 'architecturalProjectionsArea', label: 'Αρχ. Προεξοχές' },
  { name: 'balconiesArea', label: 'Μπαλκόνια' },
];

export function AreaInputs({ control }: { control: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {AREA_FIELDS.map(f =>
        <FormField key={f.name} control={control} name={f.name} render={({ field }) => (
          <FormItem>
            <FormLabel>{f.label}</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      )}
    </div>
  );
}
