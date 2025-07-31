"use client";

import { useQuery } from "@tanstack/react-query";
import {
  collection,
  onSnapshot,
  query as firestoreQuery,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContactFormValues } from "../lib/validation/contactSchema";

// Combine the form values with an ID and createdAt
export interface Contact extends ContactFormValues {
  id: string;
  createdAt: any;
}

async function fetchContacts(): Promise<Contact[]> {
  const contactsCollection = collection(db, "contacts");
  // Perform sorting on the database side for efficiency
  const q = firestoreQuery(contactsCollection, orderBy("name", "asc"));

  return new Promise((resolve, reject) => {
    // Using onSnapshot for real-time updates.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const contacts = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Contact,
        );
        resolve(contacts);
      },
      (error) => {
        console.error("Failed to fetch contacts:", error);
        reject(error);
      },
    );
    // In a real app with more complex lifecycle, you might manage this unsubscribe
    // function, but for React Query's queryFn, this setup works well.
  });
}

export function useContacts() {
  const {
    data: contacts = [],
    isLoading,
    isError,
  } = useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    // Keep data fresh for 5 minutes, refetch in background
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  return { contacts, isLoading, isError };
}
