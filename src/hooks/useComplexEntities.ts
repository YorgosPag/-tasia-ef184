
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
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [page, setPage] = useState(1);
  const [canGoNext, setCanGoNext] = useState(true);
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
    async (direction: 'next' | 'prev' | 'first' = 'first') => {
      if (!type) {
        setEntities([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        let q;
        const baseQuery = collection(db, 'tsia-complex-entities');
        
        // Base constraints
        let constraints = [where('type', '==', type), orderBy('name')];

        if (debouncedSearchQuery) {
            constraints.push(where('name', '>=', debouncedSearchQuery));
            constraints.push(where('name', '<=', debouncedSearchQuery + '\uf8ff'))
        }

        if (direction === 'next' && lastDoc) {
          q = query(baseQuery, ...constraints, startAfter(lastDoc), limit(PAGE_SIZE));
        } else if (direction === 'prev' && firstDoc) {
          q = query(baseQuery, ...constraints, endBefore(firstDoc), limitToLast(PAGE_SIZE));
        } else {
          // First page
          q = query(baseQuery, ...constraints, limit(PAGE_SIZE));
          setPage(1);
        }

        const documentSnapshots = await getDocs(q);
        const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));

        if (newEntities.length > 0) {
            setEntities(newEntities);
            setFirstDoc(documentSnapshots.docs[0] || null);
            setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
        }
        
        setCanGoNext(documentSnapshots.docs.length === PAGE_SIZE);

        if(direction === 'next' && newEntities.length > 0) setPage(p => p + 1);
        if(direction === 'prev' && newEntities.length > 0) setPage(p => p - 1);

      } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        setError('Αποτυχία φόρτωσης δεδομένων. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console.');
      } finally {
        setIsLoading(false);
      }
    },
    [type, lastDoc, firstDoc, debouncedSearchQuery]
  );
  
  const nextPage = useCallback(() => {
    if (canGoNext) {
        fetchEntities('next');
    }
  }, [canGoNext, fetchEntities]);

  const prevPage = useCallback(() => {
    if (page > 1) {
        fetchEntities('prev');
    }
  }, [page, fetchEntities]);
  
  useEffect(() => {
    if(type) {
        fetchEntities('first');
    } else {
        setEntities([]);
    }
  }, [type, debouncedSearchQuery]); // Removed fetchEntities from dependency array as it's stable

  return {
    entities,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev: page > 1,
    listTypes,
    isLoadingListTypes,
    refetch: () => {
        fetchListTypes();
        if (type) fetchEntities('first');
    },
  };
}
