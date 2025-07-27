
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
    const q = query(collection(db, 'tsia-complex-entities'), orderBy('type'));
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
        setError("Αδυναμία φόρτωσης τύπων λίστας. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console.");
    } finally {
        setIsLoadingListTypes(false);
    }
  }, []);

  useEffect(() => {
    fetchListTypes();
  }, [fetchListTypes]);


  const fetchEntities = useCallback(async () => {
      if (!type) {
        setEntities([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        let constraints = [where('type', '==', type)];
        
        // This is a very basic search. For more complex scenarios (case-insensitive, partial match),
        // a more advanced solution like Algolia or a separate normalized field would be needed.
        // This query looks for an exact match on any field. Due to Firestore limitations,
        // we can't query across multiple fields dynamically. We will filter client-side for now.
        const q = query(collection(db, 'tsia-complex-entities'), ...constraints);
        
        const documentSnapshots = await getDocs(q);
        
        let newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        if (debouncedSearchQuery) {
            const lowercasedQuery = debouncedSearchQuery.toLowerCase();
            newEntities = newEntities.filter(entity => {
                // Search across all values of an entity
                return Object.values(entity).some(value => 
                    String(value).toLowerCase().includes(lowercasedQuery)
                );
            });
        }
        
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
    fetchEntities();
  }, [fetchEntities]);

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
