
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
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { AMENITIES_LIST, KITCHEN_LAYOUTS, ORIENTATIONS } from '@/lib/unit-helpers';

export const unitSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  name: z.string().min(1, "Name is required"),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος', 'Προς Ενοικίαση']),
  
  // Area fields
  netArea: z.string().optional(),
  grossArea: z.string().optional(),
  commonArea: z.string().optional(),
  semiOutdoorArea: z.string().optional(),
  architecturalProjectionsArea: z.string().optional(),
  balconiesArea: z.string().optional(),
  
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  orientation: z.string().optional(),
  kitchenLayout: z.string().optional(),
  description: z.string().optional(),
  isPenthouse: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
  levelSpan: z.number().int().min(1).default(1),
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
                    <SelectItem value="Προς Ενοικίαση">Προς Ενοικίαση</SelectItem>
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
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="identifier" render={({ field }) => (<FormItem><FormLabel>Κωδικός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Αναγνωριστικό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            
            <FormField control={form.control} name="orientation" render={({ field }) => (
              <FormItem><FormLabel>Προσανατολισμός</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε προσανατολισμό..."/></SelectTrigger></FormControl>
                    <SelectContent>{ORIENTATIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            
             <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Υπνοδωμάτια</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε αριθμό..."/></SelectTrigger></FormControl>
                      <SelectContent>
                          {[...Array(8).keys()].map(i => (
                              <SelectItem key={i} value={i.toString()}>{i === 0 ? 'Χωρίς υπνοδωμάτιο' : `${i} υπνοδωμάτιο(α)`}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Λουτρά (Περιγραφή)</FormLabel><FormControl><Input placeholder="π.χ. 1 με παράθυρο, 1 WC" {...field} /></FormControl><FormMessage /></FormItem>)} />

             <FormField control={form.control} name="kitchenLayout" render={({ field }) => (
                <FormItem>
                    <FormLabel>Σαλόνι, Κουζίνα</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε διαρρύθμιση..."/></SelectTrigger></FormControl>
                        <SelectContent>{KITCHEN_LAYOUTS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}/>
            <FormField control={form.control} name="isPenthouse" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5"><FormLabel>Ρετιρέ</FormLabel></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            <FormField control={form.control} name="levelSpan" render={({ field }) => (
                <FormItem>
                  <FormLabel>Αριθμός Ορόφων που καταλαμβάνει</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <Separator />
        <div>
            <h3 className="text-base font-semibold mb-4">Ανάλυση Εμβαδού (τ.μ.)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="netArea" render={({ field }) => (<FormItem><FormLabel>Καθαρά</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="grossArea" render={({ field }) => (<FormItem><FormLabel>Μικτά</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="commonArea" render={({ field }) => (<FormItem><FormLabel>Κοινόχρηστα</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="semiOutdoorArea" render={({ field }) => (<FormItem><FormLabel>Ημιυπαίθριοι</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="architecturalProjectionsArea" render={({ field }) => (<FormItem><FormLabel>Αρχ. Προεξοχές</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="balconiesArea" render={({ field }) => (<FormItem><FormLabel>Μπαλκόνια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
        </div>

        <Separator />
        <div>
            <h3 className="text-base font-semibold mb-4">Παροχές</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {AMENITIES_LIST.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    (field.value || []).filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
        </div>

        <Separator />
        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel className="text-base font-semibold">Περιγραφή</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
      </CardContent>
    </>
  );
}
