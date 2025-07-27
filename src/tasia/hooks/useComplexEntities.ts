
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

  const refetch = useCallback(() => {
    setPage(1);
    setLastVisible(null);
    setFirstVisible(null);
  }, []);

  const buildQueryConstraints = useCallback(() => {
    let constraints: QueryConstraint[] = [where('type', '==', type)];
    for (const key in debouncedFilters) {
      const value = debouncedFilters[key];
      if (value) {
        constraints.push(where(key, '==', value));
      }
    }
    return constraints;
  }, [type, debouncedFilters]);
  
  const fetchPage = useCallback(async (pageDirection: 'next' | 'prev' | 'initial') => {
    if (!type) return;

    setIsLoading(true);
    setError(null);

    try {
        const constraints = buildQueryConstraints();
        const baseQuery = collection(db, 'tsia-complex-entities');

        let pageQuery;
        if (pageDirection === 'next' && lastVisible) {
            pageQuery = query(baseQuery, ...constraints, orderBy('__name__'), startAfter(lastVisible), limit(PAGE_SIZE));
        } else if (pageDirection === 'prev' && firstVisible) {
            pageQuery = query(baseQuery, ...constraints, orderBy('__name__'), endBefore(firstVisible), limitToLast(PAGE_SIZE));
        } else { // initial
            pageQuery = query(baseQuery, ...constraints, orderBy('__name__'), limit(PAGE_SIZE));
        }
        
        const documentSnapshots = await getDocs(pageQuery);
        const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        setFirstVisible(documentSnapshots.docs[0] || null);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
        setEntities(newEntities);

    } catch (err: any) {
      console.error('Error fetching entities:', err);
      setError('Αποτυχία φόρτωσης δεδομένων. ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [type, buildQueryConstraints, firstVisible, lastVisible]);
  
  
  useEffect(() => {
      refetch();
  }, [type, debouncedFilters, refetch]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!type) {
        setEntities([]);
        setTotalCount(0);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const constraints = buildQueryConstraints();
        const countQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalCount(countSnapshot.data().count);
        await fetchPage('initial');
      } catch (err: any) {
        console.error('Error on initial fetch:', err);
        setError('Αποτυχία φόρτωσης δεδομένων. ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [type, debouncedFilters, buildQueryConstraints, fetchPage]);


  const nextPage = useCallback(() => {
    if (!lastVisible) return;
    setPage(p => p + 1);
    fetchPage('next');
  }, [lastVisible, fetchPage]);

  const prevPage = useCallback(() => {
    if (!firstVisible) return;
    setPage(p => p - 1);
    fetchPage('prev');
  }, [firstVisible, fetchPage]);
  
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
