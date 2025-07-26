'use client';

import { useQuery } from '@tanstack/react-query';
import { collection, onSnapshot, query as firestoreQuery } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { ContactFormValues } from '../lib/validation/contactSchema';

// Combine the form values with an ID and createdAt
export interface Contact extends ContactFormValues {
  id: string;
  createdAt: any;
}

async function fetchContacts(): Promise<Contact[]> {
  const contactsCollection = collection(db, 'contacts');
  const q = firestoreQuery(contactsCollection);
  
  return new Promise((resolve, reject) => {
    onSnapshot(q, (snapshot) => {
      const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      // Sort on the client side
      contacts.sort((a, b) => a.name.localeCompare(b.name));
      resolve(contacts);
    }, (error) => {
      console.error("Failed to fetch contacts:", error);
      reject(error);
    });
  });
}

export function useContacts() {
    const { data: contacts = [], isLoading, isError } = useQuery<Contact[]>({
      queryKey: ['contacts'],
      queryFn: fetchContacts,
      // Keep data fresh for 5 minutes, refetch in background
      staleTime: 1000 * 60 * 5, 
      refetchOnWindowFocus: true,
    });
    
    return { contacts, isLoading, isError };
}
