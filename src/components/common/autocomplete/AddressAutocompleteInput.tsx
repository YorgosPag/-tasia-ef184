
'use client';

import React from 'react';
import { InstantSearch } from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import type { UseFormReturn } from 'react-hook-form';
import { Autocomplete } from './Autocomplete';

const searchClient = algoliasearch(
  process***REMOVED***.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process***REMOVED***.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY!
);

interface AddressAutocompleteInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  onSelect: (hit: any) => void;
  indexName: string;
  algoliaKey: string;
}

export function AddressAutocompleteInput({
  form,
  name,
  label,
  onSelect,
  indexName,
  algoliaKey,
}: AddressAutocompleteInputProps) {
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
