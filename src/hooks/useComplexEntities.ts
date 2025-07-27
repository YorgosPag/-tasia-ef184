
'use client';

import { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import {
  collection,
  query,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useDebounce } from 'use-debounce';

export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any; 
}

const fetchDistinctTypes = async (): Promise<string[]> => {
    // Correctly fetch the 'title' from the 'tsia-custom-lists' which acts as the 'type' for complex entities.
    const q = query(collection(db, "tsia-custom-lists"), orderBy("title", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().title);
};

export function useComplexEntities(type?: string, searchQuery?: string) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [listTypes, setListTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListTypesCallback = useCallback(async () => {
    setIsLoadingListTypes(true);
    try {
        const types = await fetchDistinctTypes();
        setListTypes(types);
    } catch (err) {
        console.error("Failed to fetch list types", err);
        setError("Αδυναμία φόρτωσης τύπων λίστας.");
    } finally {
        setIsLoadingListTypes(false);
    }
  }, []);

  useEffect(() => {
    fetchListTypesCallback();
  }, [fetchListTypesCallback]);
  
  // This hook is now simplified. It doesn't fetch entities directly.
  // It provides the list types and a way for the Algolia component to set the displayed hits.
  // The actual fetching is delegated to Algolia's `useInfiniteHits` inside the `AlgoliaSearchBox`.

  const setHits = useCallback((hits: any[]) => {
      // The hits from Algolia are what we display.
      // We map them to our ComplexEntity format.
      const formattedEntities = hits.map(hit => ({
          ...hit,
          id: hit.objectID,
      }));
      setEntities(formattedEntities);
  }, []);

  const refetch = () => {
      // In an Algolia setup, refetching is handled by the search components.
      // We can keep this as a no-op or trigger a refresh in the Algolia component if needed.
      console.log("Refetch called, but data is now driven by Algolia.");
      fetchListTypesCallback(); // Allow refetching list types
  };

  return {
    entities,
    isLoading: isLoading || isLoadingListTypes, // Combine loading states
    error,
    listTypes,
    isLoadingListTypes,
    refetch,
    setHits, // Expose the setter for Algolia to use
  };
}
