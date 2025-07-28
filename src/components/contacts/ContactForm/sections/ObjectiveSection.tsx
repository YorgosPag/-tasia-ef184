
'use client';
import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import type { ContactFormProps } from '../types';

export function ObjectiveSection({ form }: Pick<ContactFormProps, 'form'>) {
  return (
    <Card className="relative border-muted">
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground text-center mb-4">
          🛈 Ο σκοπός της εταιρείας, όπως έχει δηλωθεί στο Γ.Ε.ΜΗ.
        </p>
        <FormField
          name="job.objective"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Σκοπός Εταιρείας</FormLabel>
              <FormControl>
                <Textarea {...field} disabled placeholder="—" className="min-h-[120px]" />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
