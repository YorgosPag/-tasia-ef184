
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
import { ContactFormValues } from '@/lib/validation/contactSchema';

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
  photoUrl?: string;
  
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
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
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
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setEditingContact(null);
    setEditingSection(null);
  };
  
  const handleAddNew = () => {
    setSelectedContact(null);
    setEditingContact({ entityType: 'Φυσικό Πρόσωπο' } as any); // Create a dummy object to trigger new mode
    setEditingSection('personal');
  };

  const handleEditSection = (section: string) => {
    setEditingContact(selectedContact);
    setEditingSection(section);
  };

  const handleCancel = () => {
    setEditingContact(null);
    setEditingSection(null);
  };
  
  const handleSaveContact = useCallback(async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
        const dataToSave: Partial<Contact> = {
            ...data,
            birthDate: data.birthDate ? Timestamp.fromDate(data.birthDate) : undefined,
            identity: {
                ...data.identity,
                issueDate: data.identity?.issueDate ? Timestamp.fromDate(data.identity.issueDate) : undefined,
            }
        };

        if (editingContact?.id) {
            await updateDoc(doc(db, 'tsia-contacts', editingContact.id), dataToSave);
            toast({ title: 'Επιτυχία', description: 'Η επαφή ενημερώθηκε.' });
        } else {
            const newDocRef = await addDoc(collection(db, 'tsia-contacts'), { ...dataToSave, createdAt: serverTimestamp() });
            toast({ title: 'Επιτυχία', description: 'Η επαφή δημιουργήθηκε.' });
            // Select the newly created contact
            const newContact = { id: newDocRef.id, ...dataToSave } as Contact;
            setSelectedContact(newContact);
        }
        handleCancel();
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η αποθήκευση απέτυχε.' });
    } finally {
        setIsSubmitting(false);
    }
  }, [editingContact, toast]);


  const deleteContact = useCallback(async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, 'tsia-contacts', id));
      toast({ title: 'Επιτυχία', description: 'Η επαφή διαγράφηκε.' });
      setSelectedContact(null);
      handleCancel();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  return { 
      contacts, 
      isLoading, 
      isSubmitting, 
      selectedContact,
      editingContact,
      editingSection,
      handleSelectContact,
      handleAddNew,
      handleEditSection,
      handleDeleteContact: deleteContact,
      handleSaveContact,
      handleCancel,
    };
}
