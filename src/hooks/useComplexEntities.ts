
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any; 
}

const fetchDistinctTypes = async (): Promise<string[]> => {
    // This now fetches only the types from complex entities, which is the intended source.
    const q = query(collection(db, "tsia-complex-entities"));
    const snapshot = await getDocs(q);
    const types = new Set(snapshot.docs.map(doc => doc.data().type));
    return Array.from(types).sort();
};

export function useComplexEntities() {
  const [listTypes, setListTypes] = useState<string[]>([]);
  const [isLoadingListTypes, setIsLoadingListTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListTypesCallback = useCallback(async () => {
    setIsLoadingListTypes(true);
    try {
        const types = await fetchDistinctTypes();
        setListTypes(types);
    } catch (err) {
        console.error("Failed to fetch list types", err);
        setError("Αδυναμία φόρτωσης τύπων λίστας.");
    } finally {
        setIsLoadingListTypes(false);
    }
  }, []);

  useEffect(() => {
    fetchListTypesCallback();
  }, [fetchListTypesCallback]);
  
  const refetch = () => {
      fetchListTypesCallback();
  };

  return {
    listTypes,
    isLoadingListTypes,
    error,
    refetch,
  };
}
