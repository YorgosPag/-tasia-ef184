
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
  
  const [page, setPage] = useState(1);
  const [pageDocs, setPageDocs] = useState<(QueryDocumentSnapshot<DocumentData> | null)[]>([null]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [allKeysFromType, setAllKeysFromType] = useState<string[]>([]);

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
      setInitialDataLoaded(true);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const constraints: QueryConstraint[] = [where('type', '==', type)];
      
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

      const lastDoc = pageDocs[pageNumber - 1];

      if (direction === 'next' && lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      constraints.push(limit(PAGE_SIZE));

      const finalQuery = query(baseQuery, ...constraints);
      const documentSnapshots = await getDocs(finalQuery);
      
      const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
      
      if (documentSnapshots.docs.length > 0) {
        if(allKeysFromType.length === 0) {
            setAllKeysFromType(Object.keys(newEntities[0]));
        }
        setPageDocs(prev => {
          const newDocs = [...prev];
          newDocs[pageNumber] = documentSnapshots.docs[documentSnapshots.docs.length - 1];
          return newDocs;
        });
      } else {
         if(allKeysFromType.length === 0){
             const keysQuery = query(collection(db, 'tsia-complex-entities'), where('type', '==', type), limit(1));
             const keysSnapshot = await getDocs(keysQuery);
             if(!keysSnapshot.empty) {
                setAllKeysFromType(Object.keys(keysSnapshot.docs[0].data()));
             }
        }
      }
      setEntities(newEntities);

    } catch (err: any) {
      console.error('Error fetching complex entities:', err);
      setError('Αποτυχία φόρτωσης δεδομένων. ' + err.message);
    } finally {
      setIsLoading(false);
      if(!initialDataLoaded) setInitialDataLoaded(true);
    }
  }, [type, debouncedFilters, pageDocs, allKeysFromType.length, initialDataLoaded, totalCount]);

  const resetAndFetch = useCallback(() => {
      setPage(1);
      setPageDocs([null]);
      setTotalCount(null);
      setEntities([]);
      setAllKeysFromType([]);
      setInitialDataLoaded(false);
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
    // This is simplified as a full reset to avoid complex state management
    // of previous page cursors. For this app's use case, it's acceptable.
    resetAndFetch();
  }, [resetAndFetch]);

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
    initialDataLoaded,
    allKeysFromType,
  };
}
