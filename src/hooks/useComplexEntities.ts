
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
  getCountFromServer,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useDebounce } from 'use-debounce';

export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any; 
}

export const PAGE_SIZE = 50;

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


export function useComplexEntities(type?: string, columnFilters: Record<string, string> = {}) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [listTypes, setListTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pageDocs, setPageDocs] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([null]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [debouncedFilters] = useDebounce(columnFilters, 500);

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

  const fetchPage = useCallback(async (pageNumber: number, direction: 'next' | 'prev' | 'initial') => {
    if (!type) {
      setEntities([]);
      setTotalCount(0);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const constraints: QueryConstraint[] = [where('type', '==', type)];
      for (const key in debouncedFilters) {
        const value = debouncedFilters[key];
        if (value) {
          // Use exact match for filtering
          constraints.push(where(key, '==', value));
        }
      }

      if (direction === 'initial' || totalCount === null) {
        const countQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalCount(countSnapshot.data().count);
      }
      
      const baseQuery = collection(db, 'tsia-complex-entities');
      constraints.push(orderBy('__name__')); // Consistent ordering

      const lastDoc = pageDocs[pageNumber -1];

      if (direction === 'next' && lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      constraints.push(limit(PAGE_SIZE));

      const finalQuery = query(baseQuery, ...constraints);
      const documentSnapshots = await getDocs(finalQuery);
      
      if (!documentSnapshots.empty) {
        setEntities(documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity)));
        
        setPageDocs(prev => {
          const newDocs = [...prev];
          newDocs[pageNumber] = documentSnapshots.docs[documentSnapshots.docs.length - 1];
          return newDocs;
        });

      } else {
        setEntities([]);
      }
    } catch (err: any) {
      console.error('Error fetching complex entities:', err);
      setError('Αποτυχία φόρτωσης δεδομένων. ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [type, debouncedFilters, pageDocs, totalCount]);

  const resetAndFetch = useCallback(() => {
      setPage(1);
      setPageDocs([null]);
      setTotalCount(null);
      if(type) {
        fetchPage(1, 'initial');
      }
  }, [type, fetchPage]);

  useEffect(() => {
    resetAndFetch();
  }, [type, debouncedFilters]);
  
  const nextPage = useCallback(() => {
    const newPage = page + 1;
    fetchPage(newPage, 'next');
    setPage(newPage);
  }, [page, fetchPage]);

  const prevPage = useCallback(() => {
      // Re-fetching from the beginning up to the previous page's start is complex.
      // A simpler UX is to just go back to page 1.
      if (page > 1) {
          resetAndFetch();
      }
  }, [page, resetAndFetch]);

  
  const canGoNext = totalCount !== null ? (page * PAGE_SIZE) < totalCount : false;

  return {
    entities,
    isLoading,
    error,
    listTypes,
    isLoadingListTypes,
    refetch: resetAndFetch,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev: page > 1,
    totalCount,
    page,
  };
}

    