
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchBox, useHits, InstantSearch, Configure } from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/shared/components/ui/command';
import { useDebounce } from 'use-debounce';

const searchClient = algoliasearch(
  process***REMOVED***.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process***REMOVED***.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY!,
);

const Autocomplete = ({ control, name, label, onSelect }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(''); 
  const [debouncedQuery] = useDebounce(inputValue, 300);
  const { hits } = useHits();

  const handleSelect = (hit: any) => {
    onSelect(hit);
    const selectedLabel = hit[label] || '';
    setInputValue(selectedLabel);
    control.setValue(name, selectedLabel);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (...event: any[]) => void) => {
    const value = e.target.value;
    setInputValue(value);
    fieldOnChange(value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          useEffect(() => {
            if(field.value) setInputValue(field.value);
          }, [field.value]);

          return (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="w-40 text-right">{label}</FormLabel>
              <div className="flex-1">
                <PopoverTrigger asChild>
                  <FormControl>
                    <Input
                      {...field}
                      value={inputValue}
                      onChange={(e) => handleInputChange(e, field.onChange)}
                      onClick={() => setIsOpen(true)}
                    />
                  </FormControl>
                </PopoverTrigger>
                <FormMessage />
              </div>
            </FormItem>
          );
        }}
      />
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandList>
            {hits.length > 0 && (
              <CommandGroup>
                {hits.map((hit) => (
                  <CommandItem
                    key={hit.objectID}
                    value={hit[label] as string}
                    onSelect={() => handleSelect(hit)}
                  >
                    <span dangerouslySetInnerHTML={{ __html: (hit._highlightResult as any)?.[label]?.value || (hit[label] as string) }} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {hits.length === 0 && debouncedQuery && (
              <CommandEmpty>Δεν βρέθηκαν αποτελέσματα.</CommandEmpty>
            )}
          </CommandList>
        </Command>
        <Configure query={debouncedQuery} hitsPerPage={5} />
      </PopoverContent>
    </Popover>
  );
};

export function AddressAutocompleteInput({ control, name, label, onSelect }: any) {
  const indexName = process***REMOVED***.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!; 

  if (!process***REMOVED***.NEXT_PUBLIC_ALGOLIA_APP_ID || !process***REMOVED***.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY || !indexName) {
    return (
        <div className="text-destructive text-xs p-2 rounded-md bg-destructive/10">
            Η αναζήτηση Algolia δεν έχει ρυθμιστεί. Βεβαιωθείτε ότι οι μεταβλητές περιβάλλοντος υπάρχουν.
        </div>
    )
  }

  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure filters={`type:'Διοικητική Διαίρεση Ελλάδας'`} />
        <Autocomplete control={control} name={name} label={label} onSelect={onSelect} />
    </InstantSearch>
  );
}
