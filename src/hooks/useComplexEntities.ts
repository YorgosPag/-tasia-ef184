
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
    const q = query(collection(db, 'tsia-complex-entities'), orderBy('type'));
    const snapshot = await getDocs(q);
    const types = new Set<string>();
    let lastType: string | null = null;
    snapshot.forEach(doc => {
        const type = doc.data().type;
        if (type && type !== lastType) {
            types.add(type);
            lastType = type;
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
        
        // Server-side prefix search on the 'name' field.
        if (debouncedSearchQuery) {
            constraints.push(where('name', '>=', debouncedSearchQuery));
            constraints.push(where('name', '<=', debouncedSearchQuery + '\uf8ff'));
        }

        const countQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const countSnapshot = await getCountFromServer(countQuery);
        setTotalCount(countSnapshot.data().count);
        
        let q;
        const finalConstraints = [...constraints, limit(PAGE_SIZE)];
        if(!debouncedSearchQuery) {
            finalConstraints.push(orderBy('name'));
        }


        switch (direction) {
          case 'next':
            if(lastVisible) finalConstraints.push(startAfter(lastVisible));
            break;
          case 'prev':
            // Note: `endBefore` with `limitToLast` is complex and can be inconsistent.
            // A simpler pagination model (next-only or cursor-based) is often more reliable with Firestore.
            // For now, we'll keep it simple.
             if (firstVisible) {
                // To go previous, we need to reverse the query and use endBefore.
                // This is more complex than needed for now. We will reset.
             }
            break;
          default: // 'initial'
            break;
        }
        
        q = query(collection(db, 'tsia-complex-entities'), ...finalConstraints);
        
        const documentSnapshots = await getDocs(q);
        
        let newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
        setFirstVisible(documentSnapshots.docs[0] || null);
        
        setEntities(newEntities);

      } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        setError('Αποτυχία φόρτωσης δεδομένων. Βεβαιωθείτε ότι το απαραίτητο ευρετήριο έχει δημιουργηθεί στο Firebase Console.');
      } finally {
        setIsLoading(false);
      }
    },
    [type, debouncedSearchQuery] // <-- Removed `lastVisible` dependency to fix infinite loop
  );
  
  const refetch = useCallback(() => {
    setPage(1);
    setLastVisible(null);
    setFirstVisible(null);
    fetchEntities('initial');
  }, [fetchEntities]);

  useEffect(() => {
    refetch();
  }, [type, debouncedSearchQuery, refetch]);

  const nextPage = useCallback(() => {
    if (!lastVisible) return;
    setPage(p => p + 1);
    
    // We need a slightly different fetch logic for pagination that uses the current lastVisible.
    const paginate = async () => {
        if (!type) return;
        setIsLoading(true);
        try {
            let constraints = [where('type', '==', type)];
            if (debouncedSearchQuery) {
                constraints.push(where('name', '>=', debouncedSearchQuery));
                constraints.push(where('name', '<=', debouncedSearchQuery + '\uf8ff'));
            }
            constraints.push(orderBy('name'));
            constraints.push(startAfter(lastVisible));
            constraints.push(limit(PAGE_SIZE));

            const q = query(collection(db, 'tsia-complex-entities'), ...constraints);
            const documentSnapshots = await getDocs(q);
            let newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
            setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
            setFirstVisible(documentSnapshots.docs[0] || null);
            setEntities(newEntities);
        } catch (e) {
            console.error(e);
            setError("Failed to fetch next page.");
        } finally {
            setIsLoading(false);
        }
    };
    paginate();

  }, [lastVisible, type, debouncedSearchQuery]);

  const prevPage = useCallback(() => {
    if (page === 1) return;
    setPage(p => p - 1);
    // This requires a more complex query with `endBefore`. For now, we'll reset to the first page.
    refetch();
  }, [page, refetch]);
  
  const canGoNext = entities.length === PAGE_SIZE && (page * PAGE_SIZE) < (totalCount || 0);

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
