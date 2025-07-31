
'use client';
import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWatchedFields } from '../hooks/useWatchedFields';
import type { ContactFormProps } from '../types';
import { ContactFormValues } from '@/lib/validation/contactSchema';

export function HeadquartersSection({ form }: Pick<ContactFormProps, 'form'>) {
  const { addresses } = useWatchedFields(form);
  const { fields } = useFieldArray({ control: form.control, name: 'addresses' });

  const gemhAddressIndex = addresses.findIndex((addr) => addr.fromGEMI);

  if (gemhAddressIndex === -1) {
    return (
      <Card className="relative border-muted">
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center mb-4">
            🔄 Αναμένουμε στοιχεία από το Γ.Ε.ΜΗ. Τα πεδία θα συμπληρωθούν αυτόματα μόλις συνδεθεί η υπηρεσία.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50">
            <FormItem><FormLabel>Οδός</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
            <FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
            <FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
            <FormItem><FormLabel>Δήμος/Πόλη</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
            <FormItem><FormLabel>Ταχυδρομική Θυρίδα</FormLabel><FormControl><Input disabled placeholder="-" /></FormControl></FormItem>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card key={JSON.stringify(addresses[gemhAddressIndex])} className="relative border-destructive/50">
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-destructive font-semibold text-center mb-4">
          ❗ Τα παρακάτω στοιχεία αντλήθηκαν αυτόματα από το Γ.Ε.ΜΗ. και δεν μπορούν να τροποποιηθούν από εδώ.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name={`addresses.${gemhAddressIndex}.street`} control={form.control} render={({field}) => (<FormItem><FormLabel>Οδός</FormLabel><FormControl><Input {...field} disabled /></FormControl></FormItem>)}/>
          <FormField name={`addresses.${gemhAddressIndex}.number`} control={form.control} render={({field}) => (<FormItem><FormLabel>Αριθμός</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
          <FormField name={`addresses.${gemhAddressIndex}.postalCode`} control={form.control} render={({field}) => (<FormItem><FormLabel>Ταχ. Κώδικας</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
          <FormField name={`addresses.${gemhAddressIndex}.municipality`} control={form.control} render={({field}) => (<FormItem><FormLabel>Δήμος/Πόλη</FormLabel><FormControl><Input {...field} disabled/></FormControl></FormItem>)}/>
          <FormField name={`addresses.${gemhAddressIndex}.poBox`} control={form.control} render={({field}) => (<FormItem><FormLabel>Ταχυδρομική Θυρίδα</FormLabel><FormControl><Input {...field} disabled placeholder="-"/></FormControl></FormItem>)}/>
        </div>
      </CardContent>
    </Card>
  );
}
