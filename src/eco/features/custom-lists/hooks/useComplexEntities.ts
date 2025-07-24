
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface ComplexEntity {
  id: string;
  type: string;
  name: string;
  address?: string;
  phone?: string;
  region?: string;
  email?: string;
  website?: string;
  notes?: string;
  createdAt: any;
}

export function useComplexEntities(type: string) {
  const [entities, setEntities] = useState<ComplexEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!type) {
        setIsLoading(false);
        return;
    };
    
    const q = query(
        collection(db, 'tsia-complex-entities'),
        where('type', '==', type),
        orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            const entitiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ComplexEntity));
            setEntities(entitiesData);
            setIsLoading(false);
        },
        (error) => {
            console.error("Error fetching complex entities:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των οντοτήτων.' });
            setIsLoading(false);
        }
    );

    return () => unsubscribe();
  }, [type, toast]);

  // CRUD functions would go here (addEntity, updateEntity, deleteEntity)
  return { entities, isLoading };
}
