
'use client';

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Button } from '@/shared/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandGroup, CommandItem, CommandList } from '@/shared/components/ui/command';
import { useCustomLists } from '@/hooks/useCustomLists';
import { ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { UseFormReturn } from 'react-hook-form';
import type { ContactFormValues } from '@/shared/lib/validation/contactSchema';

interface IssuingAuthorityFieldProps {
  form: UseFormReturn<ContactFormValues>;
}

export function IssuingAuthorityField({ form }: IssuingAuthorityFieldProps) {
  const { lists, isLoading } = useCustomLists();

  const issuingAuthoritiesList = lists.find(
    (l) => l.id === 'iGOjn86fcktREwMeDFPz'
  );
  const issuingAuthorityOptions =
    issuingAuthoritiesList?.items.map((item) => ({
      value: item.value,
      label: item.value,
    })) || [];
    
  return (
    <FormField
      control={form.control}
      name="identity.issuingAuthority"
      render={({ field }) => (
        <FormItem className="flex items-center gap-4">
          <FormLabel className="w-40 text-right">Εκδ. Αρχή</FormLabel>
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-full justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                    disabled={isLoading || issuingAuthorityOptions.length === 0}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : field.value ? (
                      issuingAuthorityOptions.find(
                        (opt) => opt.value === field.value
                      )?.label
                    ) : (
                      'Επιλέξτε αρχή...'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Αναζήτηση αρχής..." />
                  <CommandList>
                    <CommandEmpty>Δεν βρέθηκε αρχή.</CommandEmpty>
                    <CommandGroup>
                      {issuingAuthorityOptions.map((option) => (
                        <CommandItem
                          value={option.label}
                          key={option.value}
                          onSelect={() => {
                            form.setValue('identity.issuingAuthority', option.value, { shouldDirty: true });
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              option.value === field.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>
              Επιλέξτε αρχή από τις προσαρμοσμένες λίστες.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
