
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  where,
  endBefore,
  limitToLast,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useDebounce } from 'use-debounce';

export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any; // Allow any other string keys with any value type
}

const PAGE_SIZE = 50;

async function getDistinctTypes(): Promise<string[]> {
    // This query can be slow if you have millions of entities.
    // For very large datasets, a separate collection of types would be more performant.
    const q = query(collection(db, 'tsia-complex-entities'));
    const snapshot = await getDocs(q);
    const types = new Set<string>();
    snapshot.forEach(doc => {
        const type = doc.data().type;
        if (type) {
            types.add(type);
        }
    });
    return Array.from(types).sort();
}


export function useComplexEntities(type?: string) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [listTypes, setListTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const fetchListTypes = useCallback(async () => {
    setIsLoadingListTypes(true);
    try {
        const types = await getDistinctTypes();
        setListTypes(types);
    } catch(err) {
        console.error("Failed to fetch list types", err);
        setError("Αδυναμία φόρτωσης τύπων λίστας.");
    } finally {
        setIsLoadingListTypes(false);
    }
  }, []);

  useEffect(() => {
    fetchListTypes();
  }, [fetchListTypes]);


  const fetchEntities = useCallback(
    async () => {
      if (!type) {
        setEntities([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        let constraints = [where('type', '==', type)];

        // This query does not support searching on fields other than 'name' currently.
        // A more complex solution with a search index (e.g., Algolia) would be needed for that.
        if (debouncedSearchQuery) {
            constraints.push(orderBy('name')); // Search requires an order by on the searched field
            const strFront = debouncedSearchQuery;
            const strBack = debouncedSearchQuery.slice(0, -1) + String.fromCharCode(debouncedSearchQuery.charCodeAt(debouncedSearchQuery.length - 1) + 1);
            
            constraints.push(where('name', '>=', strFront));
            constraints.push(where('name', '<', strBack));
        }
        
        const q = query(collection(db, 'tsia-complex-entities'), ...constraints, limit(PAGE_SIZE));
        
        const documentSnapshots = await getDocs(q);
        const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        setEntities(newEntities);

      } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        setError('Αποτυχία φόρτωσης δεδομένων. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console.');
      } finally {
        setIsLoading(false);
      }
    },
    [type, debouncedSearchQuery]
  );
  
  const refetch = useCallback(() => {
    fetchListTypes();
    if (type) fetchEntities();
  }, [type, fetchListTypes, fetchEntities]);
  
  useEffect(() => {
    if(type) {
        fetchEntities();
    } else {
        setEntities([]);
    }
  }, [type, debouncedSearchQuery, fetchEntities]);

  return {
    entities,
    isLoading: isLoading,
    error,
    searchQuery,
    setSearchQuery,
    listTypes,
    isLoadingListTypes,
    refetch,
  };
}
