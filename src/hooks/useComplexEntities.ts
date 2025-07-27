
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  getCountFromServer
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useDebounce } from 'use-debounce';

export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any; 
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
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Pagination state
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [page, setPage] = useState(1);
  const [canGoNext, setCanGoNext] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);

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


  const fetchEntities = useCallback(async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
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
        if (debouncedSearchQuery) {
            // Firestore does not support partial string matching. This requires a third-party service like Algolia.
            // As a workaround, we can only do exact matches or prefix searches with >= and < tricks.
            // This will remain a limitation for now. The search will be a client-side filter post-fetch.
        }

        const countQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalCount(countSnapshot.data().count);
        
        let q;

        switch (direction) {
          case 'next':
            q = query(collection(db, 'tsia-complex-entities'), ...constraints, startAfter(lastVisible), limit(PAGE_SIZE));
            break;
          case 'prev':
            q = query(collection(db, 'tsia-complex-entities'), ...constraints, endBefore(firstVisible), limitToLast(PAGE_SIZE));
            break;
          default: // 'initial'
            q = query(collection(db, 'tsia-complex-entities'), ...constraints, limit(PAGE_SIZE));
            break;
        }
        
        const documentSnapshots = await getDocs(q);
        
        let newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
        setFirstVisible(documentSnapshots.docs[0] || null);
        
        setEntities(newEntities);
        setCanGoNext(documentSnapshots.docs.length === PAGE_SIZE);

      } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        setError('Αποτυχία φόρτωσης δεδομένων. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console.');
      } finally {
        setIsLoading(false);
      }
    },
    [type, debouncedSearchQuery, lastVisible, firstVisible]
  );
  
  const refetch = useCallback(() => {
    fetchEntities('initial');
  }, [fetchEntities]);

  useEffect(() => {
    setPage(1);
    setLastVisible(null);
    setFirstVisible(null);
    if(type) {
        fetchEntities('initial');
    } else {
        setEntities([]);
        setTotalCount(null);
    }
  }, [type, debouncedSearchQuery]);

  const nextPage = useCallback(() => {
    if (!canGoNext) return;
    setPage(p => p + 1);
    fetchEntities('next');
  }, [canGoNext, fetchEntities]);

  const prevPage = useCallback(() => {
    if (page === 1) return;
    setPage(p => p - 1);
    fetchEntities('prev');
  }, [page, fetchEntities]);
  

  return {
    entities,
    isLoading: isLoading,
    error,
    searchQuery,
    setSearchQuery,
    listTypes,
    isLoadingListTypes,
    refetch,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev: page > 1,
    totalCount,
  };
}
