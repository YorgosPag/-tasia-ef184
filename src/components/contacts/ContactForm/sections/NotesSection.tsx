"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "@/lib/validation/contactSchema";

interface NotesSectionProps {
  form: UseFormReturn<ContactFormValues>;
}

export function NotesSection({ form }: NotesSectionProps) {
  return (
    <div className="p-1 pt-4">
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Σημειώσεις</FormLabel>
            <FormControl>
              <Textarea placeholder="" className="resize-y" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
