
'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type UseFormReturn } from 'react-hook-form';

interface GemiCompanyInfoProps {
  form: UseFormReturn<any>;
}

export function GemiCompanyInfo({ form }: GemiCompanyInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField control={form.control} name="job.gemhDOY" render={({ field }) => (<FormItem><FormLabel>ΔΟΥ (από ΓΕΜΗ)</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.gemhGemiOffice" render={({ field }) => (<FormItem><FormLabel>Τοπική Υπηρεσία Γ.Ε.ΜΗ.</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.legalType" render={({ field }) => (<FormItem><FormLabel>Νομική Μορφή</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.prefecture" render={({ field }) => (<FormItem><FormLabel>Νομός</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.companyName" render={({ field }) => (<FormItem><FormLabel>Επωνυμία</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.commercialTitle" render={({ field }) => (<FormItem><FormLabel>Διακριτικός Τίτλος</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.companyTitle" render={({ field }) => (<FormItem><FormLabel>Τίτλος</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.gemhActivity" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Δραστηριότητα</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.gemhStatus" render={({ field }) => (<FormItem><FormLabel>Κατάσταση ΓΕΜΗ</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
      <FormField control={form.control} name="job.gemhDate" render={({ field }) => (<FormItem><FormLabel>Ημ/νία Κατάστασης</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>)} />
    </div>
  );
}
