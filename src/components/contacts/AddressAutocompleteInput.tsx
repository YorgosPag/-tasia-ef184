'use client';

import React, { useState, useEffect } from 'react';
import { useSearchBox, useHits, InstantSearch, Configure } from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/shared/components/ui/command';
import { useDebounce } from 'use-debounce';
import type { UseFormReturn } from 'react-hook-form';

const searchClient = algoliasearch(
  process***REMOVED***.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process***REMOVED***.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY!,
);

const Autocomplete = ({
  form,
  name,
  label,
  onSelect,
  algoliaKey
}: {
  form: UseFormReturn<any>,
  name: string,
  label: string,
  onSelect: (hit: any) => void,
  algoliaKey: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refine } = useSearchBox();
  const { hits } = useHits();

  // Παρακολουθεί την τιμή του πεδίου στο form
  const fieldValue = form.watch(name);
  const [inputValue, setInputValue] = useState(fieldValue || '');
  const [debouncedQuery] = useDebounce(inputValue, 300);

  // Sync local input state αν αλλάξει εξωτερικά το form value
  useEffect(() => {
    if (fieldValue !== inputValue) {
      setInputValue(fieldValue || '');
    }
    // eslint-disable-next-line
  }, [fieldValue]);

  // Refine Algolia όταν ο χρήστης σταματήσει να γράφει
  useEffect(() => {
    refine(debouncedQuery);
  }, [debouncedQuery, refine]);

  const handleSelect = (hit: any) => {
    onSelect(hit); // Ενημερώνει τα υπόλοιπα πεδία
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

export function AddressAutocompleteInput({
  form,
  name,
  label,
  onSelect,
  indexName,
  algoliaKey
}: {
  form: UseFormReturn<any>,
  name: string,
  label: string,
  onSelect: (hit: any) => void,
  indexName: string,
  algoliaKey: string
}) {
  if (
    !process***REMOVED***.NEXT_PUBLIC_ALGOLIA_APP_ID ||
    !process***REMOVED***.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY ||
    !indexName
  ) {
    return (
      <div className="text-destructive text-xs p-2 rounded-md bg-destructive/10">
        Η αναζήτηση Algolia δεν έχει ρυθμιστεί. Βεβαιωθείτε ότι οι μεταβλητές περιβάλλοντος υπάρχουν.
      </div>
    );
  }

  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <Configure hitsPerPage={5} />
      <Autocomplete
        form={form}
        name={name}
        label={label}
        onSelect={onSelect}
        algoliaKey={algoliaKey}
      />
    </InstantSearch>
  );
}
