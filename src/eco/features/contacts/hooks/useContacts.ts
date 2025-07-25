
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface Contact {
  id: string;
  name: string; 
  entityType: 'Φυσικό Πρόσωπο' | 'Νομικό Πρόσωπο' | 'Δημ. Υπηρεσία';
  
  // Personal Info
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  birthDate?: Timestamp;
  birthPlace?: string;
  gender?: 'Άνδρας' | 'Γυναίκα' | 'Άλλο';
  nationality?: string;
  photoUrl?: string; // Replaces logoUrl for photo
  
  // ID & Tax Info
  identity?: {
    type?: 'Ταυτότητα' | 'Διαβατήριο';
    number?: string;
    issueDate?: Timestamp;
    issuingAuthority?: string;
  };
  afm?: string;
  doy?: string;

  // Contact Info
  contactInfo?: {
    email?: string;
    phone?: string;
    landline?: string;
  };

  // Social Networks
  socials?: {
    website?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };

  // Address Info
  address?: {
    street?: string;
    number?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    municipality?: string;
  };
  
  // Professional Info
  job?: {
    role?: string;
    specialty?: string;
    title?: string;
    companyName?: string;
  };
  
  // Other
  notes?: string;
  
  createdAt: any;
}


export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'tsia-contacts'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      setContacts(contactsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching contacts:", error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των επαφών.' });
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [toast]);

  const addContact = useCallback(async (data: Omit<Contact, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'tsia-contacts'), { ...data, createdAt: serverTimestamp() });
      toast({ title: 'Επιτυχία', description: 'Η επαφή δημιουργήθηκε.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η δημιουργία απέτυχε.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  const updateContact = useCallback(async (id: string, data: Partial<Omit<Contact, 'id' | 'createdAt'>>) => {
    setIsSubmitting(true);
    try {
      const dataToUpdate = { ...data };
      if (data.birthDate) {
        (dataToUpdate as any).birthDate = Timestamp.fromDate(data.birthDate as any);
      }
      if (data.identity?.issueDate) {
        (dataToUpdate as any).identity.issueDate = Timestamp.fromDate(data.identity.issueDate as any);
      }
      await updateDoc(doc(db, 'tsia-contacts', id), dataToUpdate);
      toast({ title: 'Επιτυχία', description: 'Η επαφή ενημερώθηκε.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση απέτυχε.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  const deleteContact = useCallback(async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'tsia-contacts', id));
      toast({ title: 'Επιτυχία', description: 'Η επαφή διαγράφηκε.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  return { contacts, isLoading, isSubmitting, addContact, updateContact, deleteContact };
}
