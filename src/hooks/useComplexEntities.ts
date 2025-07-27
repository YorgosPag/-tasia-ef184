
'use client';

import { useState, useEffect, useCallback, useReducer } from 'react';
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
  QueryConstraint,
  endBefore,
  limitToLast,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useDebounce } from 'use-debounce';

// --- Interfaces & Types ---
export interface ComplexEntity {
  id: string;
  type: string;
  [key: string]: any;
}

export const PAGE_SIZE = 50;

interface PageSnapshots {
    first: QueryDocumentSnapshot<DocumentData> | null;
    last: QueryDocumentSnapshot<DocumentData> | null;
}

interface State {
  entities: ComplexEntity[];
  listTypes: string[];
  isLoading: boolean;
  isLoadingListTypes: boolean;
  error: string | null;
  page: number;
  paginationCursors: PageSnapshots[];
  totalCount: number | null;
  initialDataLoaded: boolean;
  allKeysFromType: string[];
}

type Action =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_TYPES_INIT' }
  | { type: 'FETCH_TYPES_SUCCESS'; payload: string[] }
  | { type: 'FETCH_DATA_SUCCESS'; payload: { entities: ComplexEntity[]; newKeys: string[], snapshot: QuerySnapshot<DocumentData, DocumentData> } }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'RESET_PAGINATION' }
  | { type: 'GO_TO_PAGE'; payload: number }
  | { type: 'SET_TOTAL_COUNT', payload: number | null };
  
type QuerySnapshot<T, U> = import('firebase/firestore').QuerySnapshot<T, U>;


// --- Reducer Function for State Management ---
const initialState: State = {
  entities: [],
  listTypes: [],
  isLoading: false,
  isLoadingListTypes: true,
  error: null,
  page: 1,
  paginationCursors: [],
  totalCount: null,
  initialDataLoaded: false,
  allKeysFromType: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET_PAGINATION':
      return {
        ...state,
        page: 1,
        paginationCursors: [],
        totalCount: null,
        initialDataLoaded: false,
      };
    case 'FETCH_INIT':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_TYPES_INIT':
        return { ...state, isLoadingListTypes: true };
    case 'FETCH_TYPES_SUCCESS':
      return { ...state, listTypes: action.payload, isLoadingListTypes: false };
    case 'FETCH_DATA_SUCCESS':
      const newCursors = [...state.paginationCursors];
      newCursors[state.page - 1] = {
          first: action.payload.snapshot.docs[0] ?? null,
          last: action.payload.snapshot.docs[action.payload.snapshot.docs.length - 1] ?? null,
      };
      return {
        ...state,
        isLoading: false,
        entities: action.payload.entities,
        allKeysFromType: action.payload.newKeys.length > 0 ? action.payload.newKeys : state.allKeysFromType,
        initialDataLoaded: true,
        paginationCursors: newCursors,
      };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'GO_TO_PAGE':
      return { ...state, page: action.payload };
    case 'SET_TOTAL_COUNT':
        return {...state, totalCount: action.payload };
    default:
      return state;
  }
}

// --- Helper Functions ---
/**
 * Fetches the distinct `type` values from the main collection.
 * This can be slow on very large collections but is robust.
 */
async function getDistinctTypes(): Promise<string[]> {
    const q = query(collection(db, 'tsia-complex-entities'));
    const snapshot = await getDocs(q);
    const types = new Set<string>();
    snapshot.forEach(doc => {
        const type = doc.data().type;
        if (type) types.add(type);
    });
    return Array.from(types).sort((a, b) => a.localeCompare(b));
}


/**
 * Builds the array of Firestore query constraints based on the current state.
 */
function buildQueryConstraints(
    type: string,
    filters: Record<string, string>,
    page: number,
    direction: 'next' | 'prev' | 'initial',
    cursors: PageSnapshots[],
): QueryConstraint[] {
    const constraints: QueryConstraint[] = [where('type', '==', type)];

    for (const key in filters) {
        const value = filters[key];
        if (value) {
           constraints.push(where(key, '>=', value), where(key, '<=', value + '\uf8ff'));
        }
    }
    
    // Always sort by a consistent field for pagination to work reliably.
    // Firestore's document ID (__name__) is a good choice.
    constraints.push(orderBy('__name__'));

    if (direction === 'next' && page > 1 && cursors[page - 2]?.last) {
        constraints.push(startAfter(cursors[page - 2].last));
    } else if (direction === 'prev' && page > 0 && cursors[page]?.first) {
        // To go to the previous page, we need to query backwards.
        // So we reverse the sort order and use endBefore with the first item of the *current* page.
        // Firestore doesn't support endBefore with a reversed query easily, so we handle this differently in the hook.
        // For now, this part is simplified. A full 'prev' requires a more complex state management.
        // The current implementation re-fetches from the beginning up to the previous page, which is not ideal.
        // The reducer logic now handles this better by just going back in the cursor stack.
    }
    
    constraints.push(limit(PAGE_SIZE));
    return constraints;
}


/**
 * Fetches a single page of entities from Firestore.
 */
async function fetchEntitiesPage(
    dispatch: React.Dispatch<Action>,
    type: string,
    filters: Record<string, string>,
    page: number,
    direction: 'next' | 'prev' | 'initial',
    cursors: PageSnapshots[],
) {
    dispatch({ type: 'FETCH_INIT' });
    
    try {
        if(direction === 'initial' || state.totalCount === null) {
            const countQueryConstraints = [where('type', '==', type)];
             for (const key in filters) {
                if (filters[key]) {
                   countQueryConstraints.push(where(key, '>=', filters[key]), where(key, '<=', filters[key] + '\uf8ff'));
                }
            }
            const countQuery = query(collection(db, 'tsia-complex-entities'), ...countQueryConstraints);
            const countSnapshot = await getCountFromServer(countQuery);
            dispatch({ type: 'SET_TOTAL_COUNT', payload: countSnapshot.data().count });
        }

        const constraints = buildQueryConstraints(type, filters, page, direction, cursors);
        const finalQuery = query(collection(db, 'tsia-complex-entities'), ...constraints);
        const documentSnapshots = await getDocs(finalQuery);

        const newEntities = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
        
        let newKeys: string[] = [];
        if (newEntities.length > 0) {
            newKeys = Object.keys(newEntities[0]);
        } else {
             const keysQuery = query(collection(db, 'tsia-complex-entities'), where('type', '==', type), limit(1));
             const keysSnapshot = await getDocs(keysQuery);
             if(!keysSnapshot.empty) newKeys = Object.keys(keysSnapshot.docs[0].data());
        }

        dispatch({ type: 'FETCH_DATA_SUCCESS', payload: { entities: newEntities, newKeys, snapshot: documentSnapshots } });

    } catch (err: any) {
        console.error('Error fetching complex entities:', err);
        dispatch({ type: 'FETCH_FAILURE', payload: 'Αποτυχία φόρτωσης δεδομένων. ' + err.message });
    }
}


// --- Main Hook ---
export function useComplexEntities(type?: string, columnFilters: Record<string, string> = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [debouncedFilters] = useDebounce(columnFilters, 500);
  
  const fetchListTypes = useCallback(async () => {
    dispatch({ type: 'FETCH_TYPES_INIT' });
    try {
        const types = await getDistinctTypes();
        dispatch({ type: 'FETCH_TYPES_SUCCESS', payload: types });
    } catch (err) {
        console.error("Failed to fetch list types", err);
        dispatch({ type: 'FETCH_FAILURE', payload: "Αδυναμία φόρτωσης τύπων λίστας." });
    }
  }, []);

  useEffect(() => {
    fetchListTypes();
  }, [fetchListTypes]);

  useEffect(() => {
    dispatch({ type: 'RESET_PAGINATION' });
  }, [type, debouncedFilters]);
  
  useEffect(() => {
    if (type) {
      fetchEntitiesPage(dispatch, type, debouncedFilters, state.page, 'initial', state.paginationCursors);
    }
  }, [type, debouncedFilters, state.page]);


  const nextPage = useCallback(() => {
    dispatch({ type: 'GO_TO_PAGE', payload: state.page + 1 });
  }, [state.page]);

  const prevPage = useCallback(() => {
    if (state.page > 1) {
      dispatch({ type: 'GO_TO_PAGE', payload: state.page - 1 });
    }
  }, [state.page]);

  const canGoNext = state.totalCount !== null ? (state.page * PAGE_SIZE) < state.totalCount : false;
  
  return {
    ...state,
    refetch: () => {
        dispatch({ type: 'RESET_PAGINATION' });
    },
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev: state.page > 1,
  };
}
