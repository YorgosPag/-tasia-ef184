'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Control } from 'react-hook-form';

interface FormSelectFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  options: { id: string; value: string }[];
  isLoading?: boolean;
}

export function FormSelectField({
  control,
  name,
  label,
  placeholder,
  options,
  isLoading = false,
}: FormSelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
            <FormControl>
              <SelectTrigger>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue placeholder={placeholder} />}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
