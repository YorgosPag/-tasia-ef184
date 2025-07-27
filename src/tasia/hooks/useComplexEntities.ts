
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
  
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
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

  const fetchEntities = useCallback(async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
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
      
      if(direction === 'initial') {
        const countQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalCount(countSnapshot.data().count);
      }
      
      let finalQuery;
      const baseQuery = collection(db, 'tsia-complex-entities');
      
      constraints.push(orderBy('__name__')); 
      
      if (direction === 'next' && lastVisible) {
          constraints.push(startAfter(lastVisible));
          constraints.push(limit(PAGE_SIZE));
      } else if (direction === 'prev' && firstVisible) {
          constraints.push(endBefore(firstVisible));
          constraints.push(limitToLast(PAGE_SIZE));
      } else { // initial
            constraints.push(limit(PAGE_SIZE));
      }
      
      finalQuery = query(baseQuery, ...constraints);
      
      const documentSnapshots = await getDocs(finalQuery);
      
      const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
      
      if(documentSnapshots.docs.length > 0) {
        setFirstVisible(documentSnapshots.docs[0]);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      } else {
        setFirstVisible(null);
        setLastVisible(null);
      }
      
      setEntities(newEntities);

    } catch (err: any) {
      console.error('Error fetching complex entities:', err);
      setError('Αποτυχία φόρτωσης δεδομένων. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console. ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [type, debouncedFilters, lastVisible, firstVisible]);
  
  const refetch = useCallback(() => {
    setPage(1);
    setLastVisible(null);
    setFirstVisible(null);
    fetchEntities('initial');
  }, [fetchEntities]);

  useEffect(() => {
    refetch();
  }, [type, debouncedFilters]);

  const nextPage = useCallback(() => {
    setPage(p => p + 1);
    fetchEntities('next');
  }, [fetchEntities]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(p => p - 1);
      fetchEntities('prev');
    }
  }, [page, fetchEntities]);
  
  const canGoNext = totalCount !== null ? (page * PAGE_SIZE) < totalCount : false;

  return {
    entities,
    isLoading,
    error,
    listTypes,
    isLoadingListTypes,
    refetch,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev: page > 1,
    totalCount,
    page,
  };
}
