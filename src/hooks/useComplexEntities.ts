
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

export function useComplexEntities(type: string) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [page, setPage] = useState(1);
  const [canGoNext, setCanGoNext] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const fetchEntities = useCallback(
    async (direction: 'next' | 'prev' | 'first' = 'first') => {
      setIsLoading(true);
      setError(null);
      try {
        let q;
        const baseQuery = collection(db, 'tsia-complex-entities');
        
        // Base constraints
        let constraints = [where('type', '==', type), orderBy('name')];

        // Search constraint - NOTE: Firestore is limited here.
        // This simple search only works on the ordered field ('name').
        // For multi-field search, a dedicated search service like Algolia is needed.
        if (debouncedSearchQuery) {
            constraints.push(where('name', '>=', debouncedSearchQuery));
            constraints.push(where('name', '<=', debouncedSearchQuery + '\uf8ff'))
        }

        if (direction === 'next' && lastDoc) {
          q = query(baseQuery, ...constraints, startAfter(lastDoc), limit(PAGE_SIZE));
        } else if (direction === 'prev' && firstDoc) {
          // For 'prev', we need to reverse the query order, get the last items before the firstDoc,
          // then reverse the results array client-side.
          const prevQuery = query(baseQuery, ...constraints, endBefore(firstDoc), limitToLast(PAGE_SIZE));
          const documentSnapshots = await getDocs(prevQuery);
          const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
          setEntities(newEntities);
          setFirstDoc(documentSnapshots.docs[0] || null);
          setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
          setPage(p => p - 1);
          setCanGoNext(true); // Since we went back, we can go forward.
          setIsLoading(false);
          return;
        } else {
          // First page
          q = query(baseQuery, ...constraints, limit(PAGE_SIZE));
          setPage(1);
        }

        const documentSnapshots = await getDocs(q);
        const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));

        setEntities(newEntities);
        setFirstDoc(documentSnapshots.docs[0] || null);
        setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
        setCanGoNext(documentSnapshots.docs.length === PAGE_SIZE);

        if(direction === 'next') setPage(p => p + 1);

      } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        setError('Αποτυχία φόρτωσης δεδομένων.');
      } finally {
        setIsLoading(false);
      }
    },
    [type, lastDoc, firstDoc, debouncedSearchQuery]
  );
  
  // Initial fetch and re-fetch on search query change
  useEffect(() => {
    fetchEntities('first');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const nextPage = () => {
      if(canGoNext) fetchEntities('next');
  }
  
  const prevPage = () => {
      if(page > 1) fetchEntities('prev');
  }

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
  };
}
