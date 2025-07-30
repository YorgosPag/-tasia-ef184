
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  where,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useQuery } from '@tanstack/react-query';

// --- Interfaces & Constants ---
export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any;
}
export const PAGE_SIZE = 50;

// --- Helper Functions ---

/**
 * Creates an array of Firestore query constraints based on the active filters.
 */
const createFilterConstraints = (
  listType: string,
  filters: Record<string, string>
): QueryConstraint[] => {
  const constraints: QueryConstraint[] = [where('type', '==', listType)];
  for (const key in filters) {
    if (filters[key]) {
      constraints.push(where(key, '==', filters[key]));
    }
  }
  return constraints;
};


// --- Data Fetching Functions ---

/**
 * Fetches a single page of complex entities from Firestore.
 */
async function fetchEntitiesPage(
  listType: string,
  filters: Record<string, string>,
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
): Promise<{ entities: ComplexEntity[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  if (!listType) return { entities: [], lastDoc: null };

  const constraints = createFilterConstraints(listType, filters);
  const entitiesQuery = query(
    collection(db, 'tsia-complex-entities'),
    ...constraints,
    orderBy('createdAt', 'desc'), // Use a consistent field for ordering
    ...(lastDoc ? [startAfter(lastDoc)] : []),
    limit(PAGE_SIZE)
  );

  const snapshot = await getDocs(entitiesQuery);
  const entities = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as ComplexEntity)
  );

  return { entities, lastDoc: snapshot.docs[snapshot.docs.length - 1] || null };
}

/**
 * Fetches all available list types from the 'tsia-list-types' collection.
 */
async function fetchListTypes(): Promise<string[]> {
  const snapshot = await getDocs(query(collection(db, 'tsia-list-types'), orderBy('name')));
  return snapshot.docs.map((doc) => doc.data().name as string);
}

/**
 * Fetches all distinct values for a given field within a specific list type.
 */
async function fetchDistinctValues(listType: string, field: string): Promise<string[]> {
    if (!listType || !field) return [];
    // This is a client-side implementation for fetching distinct values.
    // For large datasets, a server-side function (e.g., Cloud Function) would be more efficient.
    const q = query(collection(db, 'tsia-complex-entities'), where('type', '==', listType));
    const snapshot = await getDocs(q);
    const values = new Set<string>();
    snapshot.forEach(doc => {
        const value = doc.data()[field];
        if (value && typeof value === 'string') {
            values.add(value);
        }
    });
    return Array.from(values).sort();
}


// --- Main Hook ---

export function useComplexEntities(listType: string, filters: Record<string, string>) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [distinctValues, setDistinctValues] = useState<Record<string, string[]>>({});


  const { data: listTypes = [], isLoading: isLoadingListTypes, refetch: refetchListTypes } = useQuery({
      queryKey: ['complexListTypes'],
      queryFn: fetchListTypes
  });
  
  const filterKey = JSON.stringify(filters); // Create a stable key for the filter object

  const fetchPage = useCallback(async (lastDoc: QueryDocumentSnapshot<DocumentData> | null, pageNum: number) => {
    setIsLoading(true);
    try {
      const { entities: newEntities, lastDoc: newLastDoc } = await fetchEntitiesPage(listType, filters, lastDoc);
      setEntities(newEntities);
      setLastVisible(newLastDoc);
      // This is a simplified pagination state; for true prev/next, you'd need to store a history of lastDocs
      setPage(pageNum);
      
      if (!initialDataLoaded) {
          const countQuery = query(collection(db, 'tsia-complex-entities'), ...createFilterConstraints(listType, filters));
          const countSnapshot = await getDocs(countQuery);
          setTotalCount(countSnapshot.size);
          setInitialDataLoaded(true);
      }
    } catch (error) {
      console.error("Failed to fetch entities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [listType, filterKey, initialDataLoaded]);

  useEffect(() => {
    // Fetch distinct values for the first 5 columns when listType changes
    if (listType) {
        const fetchInitialDistinctValues = async () => {
            const tempEntitiesSnapshot = await getDocs(query(collection(db, 'tsia-complex-entities'), where('type', '==', listType), limit(1)));
            if (tempEntitiesSnapshot.empty) return;
            const firstItem = tempEntitiesSnapshot.docs[0].data();
            const keys = Object.keys(firstItem).filter(key => !['id', 'type', 'createdAt', 'uniqueKey'].includes(key)).slice(0, 10);
            
            const newDistinctValues: Record<string, string[]> = {};
            for (const key of keys) {
                newDistinctValues[key] = await fetchDistinctValues(listType, key);
            }
            setDistinctValues(newDistinctValues);
        };
        fetchInitialDistinctValues();
    }
  }, [listType]);

  const refetch = useCallback(() => {
      setInitialDataLoaded(false);
      setPage(1);
      setLastVisible(null);
      fetchPage(null, 1);
      refetchListTypes();
  }, [fetchPage, refetchListTypes]);
  
  useEffect(() => {
      refetch();
  }, [listType, filterKey, refetch]);


  const nextPage = () => {
    if (lastVisible) {
      fetchPage(lastVisible, page + 1);
    }
  };

  const prevPage = () => {
    // A full implementation of previous page would require storing the last document of each page
    // For simplicity, we'll just refetch the first page.
    console.warn("Prev-page functionality is simplified and refetches from the start.");
    refetch();
  };
  
  const canGoNext = entities.length === PAGE_SIZE;
  const canGoPrev = page > 1;

  return {
    entities,
    isLoading,
    listTypes,
    isLoadingListTypes,
    refetch,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    page,
    totalCount,
    initialDataLoaded,
    distinctValues
  };
}
