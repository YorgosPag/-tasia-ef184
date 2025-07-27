
'use client';

import React, { useState } from 'react';
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
  const [inputValue, setInputValue] = useState(control.getValues(name) || '');
  const [debouncedQuery] = useDebounce(inputValue, 300);
  const [isOpen, setIsOpen] = useState(false);

  const { hits } = useHits();

  const handleSelect = (hit: any) => {
    onSelect(hit);
    setInputValue(hit[label]); // Update input with selected value
    setIsOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      control.setValue(name, e.target.value); // Keep form state in sync
      if (!isOpen) {
          setIsOpen(true);
      }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
           <FormField
            control={control}
            name={name}
            render={({ field }) => (
                 <FormItem className="flex items-center gap-4">
                    <FormLabel className="w-40 text-right">{label}</FormLabel>
                    <div className="flex-1">
                        <FormControl>
                            <Input
                            {...field}
                            value={inputValue}
                            onChange={handleInputChange}
                            onClick={() => setIsOpen(true)}
                            />
                        </FormControl>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
            />
        </div>
      </PopoverTrigger>
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
                    {hit[label] as string}
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
  const indexName = 'prod_tsia-complex-entities'; 

  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure filters={`type:'Διοικητική Διαίρεση Ελλάδας'`} />
        <Autocomplete control={control} name={name} label={label} onSelect={onSelect} />
    </InstantSearch>
  );
}
