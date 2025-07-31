"use client";

import React from "react";
import { Control, useController } from "react-hook-form";
import type { ContactFormValues } from "@/lib/validation/contactSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PhoneIndicatorIcons,
  PHONE_INDICATORS,
  PhoneIndicatorType,
} from "../../utils/phoneIndicators";

interface PhoneIndicatorsProps {
  control: Control<ContactFormValues>;
  name: `phones.${number}.indicators`;
}

export function PhoneIndicators({ control, name }: PhoneIndicatorsProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="flex items-center space-x-4 pl-1 pt-2">
            {PHONE_INDICATORS.map((indicator) => {
              const Icon = PhoneIndicatorIcons[indicator];
              return (
                <FormField
                  key={indicator}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(indicator)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            return checked
                              ? field.onChange([...currentValue, indicator])
                              : field.onChange(
                                  currentValue?.filter(
                                    (v: PhoneIndicatorType) => v !== indicator,
                                  ),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm flex items-center gap-1.5">
                        {Icon && <Icon className="h-4 w-4" />}
                        {indicator}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
