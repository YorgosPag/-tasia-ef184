
'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Unit } from '@/hooks/use-unit-details';

export const unitSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  name: z.string().min(1, "Name is required"),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος']),
  area: z.string().optional(),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  orientation: z.string().optional(),
  amenities: z.string().optional(),
});

export type UnitFormValues = z.infer<typeof unitSchema>;

interface UnitDetailsFormProps {
  form: UseFormReturn<UnitFormValues>;
  unit: Unit;
  getStatusClass: (status: Unit['status'] | undefined) => string;
}

export function UnitDetailsForm({ form, unit, getStatusClass }: UnitDetailsFormProps) {
  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Επεξεργασία Ακινήτου: {unit.name} ({unit.identifier})</CardTitle>
            <CardDescription>
              Τύπος: {unit.type || 'N/A'} |
              {unit.levelSpan ? ` Όροφοι: ${unit.levelSpan}` : ` ID Ορόφου: ${unit.floorIds?.join(', ')}`}
            </CardDescription>
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={`w-[180px] ${getStatusClass(field.value)}`}>
                      <SelectValue placeholder="Επιλέξτε κατάσταση" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem>
                    <SelectItem value="Κρατημένο">Κρατημένο</SelectItem>
                    <SelectItem value="Πωλημένο">Πωλημένο</SelectItem>
                    <SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
        <FormField control={form.control} name="identifier" render={({ field }) => (<FormItem><FormLabel>Κωδικός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Αναγνωριστικό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="orientation" render={({ field }) => (<FormItem><FormLabel>Προσανατολισμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="area" render={({ field }) => (<FormItem><FormLabel>Εμβαδόν (τ.μ.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="bedrooms" render={({ field }) => (<FormItem><FormLabel>Υπνοδωμάτια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Μπάνια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="md:col-span-2">
          <FormField control={form.control} name="amenities" render={({ field }) => (<FormItem><FormLabel>Παροχές (με κόμμα)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
      </CardContent>
    </>
  );
}
