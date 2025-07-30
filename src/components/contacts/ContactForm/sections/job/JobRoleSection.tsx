
'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { type UseFormReturn } from 'react-hook-form';

interface JobRoleSectionProps {
  form: UseFormReturn<any>;
}

export function JobRoleSection({ form }: JobRoleSectionProps) {
  return (
    <>
      <Separator/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ρόλος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
          <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ειδικότητα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
      </div>
    </>
  );
}
