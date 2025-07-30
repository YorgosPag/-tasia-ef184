'use client';

import React from 'react';
import { Control, useController } from 'react-hook-form';
import type { ContactFormValues } from '@/lib/validation/contactSchema';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { countryCodes } from '../../utils/countryCodes';

interface CountryCodeSelectProps {
  control: Control<ContactFormValues>;
  name: `phones.${number}.countryCode`;
}

export function CountryCodeSelect({ control, name }: CountryCodeSelectProps) {
  const { field } = useController({ control, name });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button variant="outline" role="combobox" className="w-[120px] justify-between">
            {field.value ? countryCodes.find(c => c.code === field.value)?.flag : "Select"}
            {field.value}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {countryCodes.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={() => field.onChange(country.code)}
                >
                  <Check className={cn("mr-2 h-4 w-4", country.code === field.value ? "opacity-100" : "opacity-0")} />
                  {country.flag} <span className="ml-2">{country.name} ({country.code})</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
