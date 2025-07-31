"use client";

import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { User, Building2, Landmark } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ContactFormValues } from "@/lib/validation/contactSchema";

interface EntityTypeSelectorProps {
  form: UseFormReturn<ContactFormValues>;
}

export function EntityTypeSelector({ form }: EntityTypeSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="entityType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="sr-only">Τύπος Οντότητας</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => {
                field.onChange(value);
                form.setValue("name", "", { shouldDirty: true }); // Clear name when type changes
                if (value === "Φυσικό Πρόσωπο") {
                  const firstName = form.getValues("firstName") || "";
                  const lastName = form.getValues("lastName") || "";
                  form.setValue("name", `${firstName} ${lastName}`.trim(), {
                    shouldDirty: true,
                  });
                }
              }}
              defaultValue={field.value}
              value={field.value}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1"
            >
              <FormItem>
                <FormControl>
                  <RadioGroupItem
                    value="Φυσικό Πρόσωπο"
                    id="Φυσικό Πρόσωπο"
                    className="sr-only"
                  />
                </FormControl>
                <Label
                  htmlFor="Φυσικό Πρόσωπο"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors",
                    "hover:bg-[#e46767]/10 hover:border-primary",
                    field.value === "Φυσικό Πρόσωπο" && "border-primary",
                  )}
                >
                  <User className="mb-3 h-6 w-6" />
                  Φυσικό Πρόσωπο
                </Label>
              </FormItem>
              <FormItem>
                <FormControl>
                  <RadioGroupItem
                    value="Νομικό Πρόσωπο"
                    id="Νομικό Πρόσωπο"
                    className="sr-only"
                  />
                </FormControl>
                <Label
                  htmlFor="Νομικό Πρόσωπο"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors",
                    "hover:bg-[#e46767]/10 hover:border-primary",
                    field.value === "Νομικό Πρόσωπο" && "border-primary",
                  )}
                >
                  <Building2 className="mb-3 h-6 w-6" />
                  Νομικό Πρόσωπο
                </Label>
              </FormItem>
              <FormItem>
                <FormControl>
                  <RadioGroupItem
                    value="Δημ. Υπηρεσία"
                    id="Δημ. Υπηρεσία"
                    className="sr-only"
                  />
                </FormControl>
                <Label
                  htmlFor="Δημ. Υπηρεσία"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 cursor-pointer transition-colors",
                    "hover:bg-[#e46767]/10 hover:border-primary",
                    field.value === "Δημ. Υπηρεσία" && "border-primary",
                  )}
                >
                  <Landmark className="mb-3 h-6 w-6" />
                  Δημ. Υπηρεσία
                </Label>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
