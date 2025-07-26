'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import type { Building, BuildingFormValues } from '@/app/buildings/[id]/page';

interface BuildingDetailsFormProps {
  form: UseFormReturn<BuildingFormValues>;
  building: Building;
}

export function BuildingDetailsForm({ form, building }: BuildingDetailsFormProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Κτίριο: {building.address}</CardTitle>
        <CardDescription>
          Τύπος: {building.type} | Ημερομηνία Δημιουργίας: {building.createdAt}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Διεύθυνση</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Τύπος</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="constructionYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Έτος Κατασκευής</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || '')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Φωτογραφίας</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Περιγραφή</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </>
  );
}
