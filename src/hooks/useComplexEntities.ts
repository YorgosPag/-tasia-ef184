
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  
  const [pageDocs, setPageDocs] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([]);
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
      let constraints: QueryConstraint[] = [where('type', '==', type)];
      for (const key in debouncedFilters) {
        const value = debouncedFilters[key];
        if (value) {
            constraints.push(where(key, '==', value));
        }
      }

      if (direction === 'initial' || totalCount === null) {
        const countQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalCount(countSnapshot.data().count);
      }

      const baseQuery = collection(db, 'tsia-complex-entities');
      constraints.push(orderBy('__name__'));

      if (direction === 'next' && pageDocs[pageNumber - 1]) {
        constraints.push(startAfter(pageDocs[pageNumber - 1]));
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


  useEffect(() => {
    setPage(1);
    setPageDocs([null]);
    setTotalCount(null); // Reset count to force refetch on type/filter change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, debouncedFilters]);
  
  useEffect(() => {
    // This effect runs only when type/filters change and after state has been reset
    if(type) {
      fetchPage(1, 'initial');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, debouncedFilters, pageDocs.length === 1 && pageDocs[0] === null]);


  const nextPage = useCallback(() => {
    const newPage = page + 1;
    setPage(newPage);
    fetchPage(newPage, 'next');
  }, [page, fetchPage]);

  // Previous page logic needs to be re-thought as Firestore doesn't have a direct 'prev' cursor.
  // The simplest way is to re-fetch up to the previous page.
  const prevPage = useCallback(() => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchPage(newPage, 'initial'); // Refetching up to the new page number
    }
  }, [page, fetchPage]);
  
  const canGoNext = totalCount !== null ? (page * PAGE_SIZE) < totalCount : false;

  return {
    entities,
    isLoading,
    error,
    listTypes,
    isLoadingListTypes,
    refetch: () => {
        setPage(1);
        setPageDocs([null]);
        setTotalCount(null);
        fetchPage(1, 'initial');
    },
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev: page > 1,
    totalCount,
    page,
  };
}
