"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Contact } from "@/hooks/use-contacts";

export function useContactsOptions() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const notaryQuery = query(
          collection(db, "contacts"),
          where("job.role", "==", "Notary"),
          orderBy("name"),
        );
        const lawyerQuery = query(
          collection(db, "contacts"),
          where("job.role", "==", "Lawyer"),
          orderBy("name"),
        );

        const [notarySnapshot, lawyerSnapshot] = await Promise.all([
          getDocs(notaryQuery),
          getDocs(lawyerQuery),
        ]);

        const notaries = notarySnapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Contact,
        );
        const lawyers = lawyerSnapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as Contact,
        );

        setContacts([...notaries, ...lawyers]);
      } catch (error) {
        console.error("Failed to fetch contact options:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return { contacts, isLoading };
}
