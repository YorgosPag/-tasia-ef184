'use client';

import React, { useState, useEffect } from 'react';
import { useSearchBox, useHits } from 'react-instantsearch-hooks-web';
import type { UseFormReturn } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/shared/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';

interface AutocompleteProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  onSelect: (hit: any) => void;
  algoliaKey: string;
}

export function Autocomplete({ form, name, label, onSelect, algoliaKey }: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refine } = useSearchBox();
  const { hits } = useHits();
  const fieldValue = form.watch(name);
  const [inputValue, setInputValue] = useState(fieldValue || '');
  const [debouncedQuery] = useDebounce(inputValue, 300);

  useEffect(() => {
    if (fieldValue !== inputValue) {
      setInputValue(fieldValue || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]);
  
  useEffect(() => {
      refine(debouncedQuery);
  }, [debouncedQuery, refine]);


  const handleSelect = (hit: any) => {
    onSelect(hit);
    const rawValue = hit[algoliaKey];
    const selectedLabel = Array.isArray(rawValue) ? (rawValue[0] || '') : (rawValue || '');
    setInputValue(selectedLabel);
    form.setValue(name, selectedLabel, { shouldDirty: true });
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    form.setValue(name, value, { shouldDirty: true });
    if (!isOpen && value) {
      setIsOpen(true);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
            <FormLabel className="w-40 text-left sm:text-right shrink-0">{label}</FormLabel>
            <div className="flex-1 w-full">
              <PopoverTrigger asChild>
                <FormControl>
                  <Input
                    {...field}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onClick={() => setIsOpen(true)}
                    autoComplete="off"
                    className="text-left"
                  />
                </FormControl>
              </PopoverTrigger>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandList>
            {hits.length > 0 && (
              <CommandGroup>
                {hits.map((hit: any) => {
                  const raw = hit[algoliaKey];
                  const hitValue =
                    (hit._highlightResult?.[algoliaKey]?.value) ||
                    (Array.isArray(raw) ? raw[0] : raw) ||
                    '';
                  return (
                    <CommandItem
                      key={hit.objectID}
                      value={typeof hitValue === 'string' ? hitValue : ''}
                      onSelect={() => handleSelect(hit)}
                    >
                      <span dangerouslySetInnerHTML={{ __html: hitValue }} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {hits.length === 0 && debouncedQuery && (
              <CommandEmpty>Δεν βρέθηκαν αποτελέσματα.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
