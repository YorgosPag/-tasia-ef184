"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { AddressAutocompleteInput } from "@/components/common/autocomplete/AddressAutocompleteInput";
import {
  getFullAddress,
  handleAddressSelect,
  addressFieldsMap,
} from "../../utils/addressHelpers";
import { AddressTypeSelect } from "./AddressTypeSelect";
import { MapPreviewButton } from "./MapPreviewButton";
import type { ContactFormValues } from "@/lib/validation/contactSchema";
import { UseFormReturn } from "react-hook-form";

interface AddressCardProps {
  form: UseFormReturn<ContactFormValues>;
  index: number;
  onRemove: () => void;
}

export function AddressCard({ form, index, onRemove }: AddressCardProps) {
  const fullAddress = getFullAddress(form, index);

  return (
    <div className="p-4 border rounded-md bg-muted/30 space-y-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>

      <AddressTypeSelect
        control={form.control}
        name={`addresses.${index}.type`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`addresses.${index}.street`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40 text-right">Οδός</FormLabel>
              <div className="flex-1">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`addresses.${index}.number`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40 text-right">Αριθμός</FormLabel>
              <div className="flex-1">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`addresses.${index}.postalCode`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40 text-right">Ταχ. Κώδικας</FormLabel>
              <div className="flex-1">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`addresses.${index}.country`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40 text-right">Χώρα</FormLabel>
              <div className="flex-1">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`addresses.${index}.poBox`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40 text-right">
                Ταχυδρομική Θυρίδα
              </FormLabel>
              <div className="flex-1">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`addresses.${index}.toponym`}
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40 text-right">Τοπωνύμιο</FormLabel>
              <div className="flex-1">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        {addressFieldsMap.map((f) => (
          <AddressAutocompleteInput
            key={String(f.formKey)}
            form={form}
            name={`addresses.${index}.${String(f.formKey)}`}
            label={f.label}
            algoliaKey={f.algoliaKey}
            onSelect={(hit: any) => handleAddressSelect(form, index, hit)}
            indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
          />
        ))}
      </div>

      <MapPreviewButton fullAddress={fullAddress} />
    </div>
  );
}
