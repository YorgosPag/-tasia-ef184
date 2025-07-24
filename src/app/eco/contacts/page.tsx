
'use client';

import { useState } from 'react';
import { ContactList } from '@/eco/features/contacts/components/ContactList';
import { ContactDetails } from '@/eco/features/contacts/components/ContactDetails';
import { ContactForm } from '@/eco/features/contacts/components/ContactForm';
import { useContacts } from '@/eco/features/contacts/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { Contact } from '@/eco/features/contacts/hooks/useContacts';

export default function ContactsPage() {
  const {
    contacts,
    isLoading,
    isSubmitting,
    addContact,
    updateContact,
    deleteContact,
  } = useContacts();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsFormOpen(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setSelectedContact(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
  };

  const handleSaveContact = async (data: any) => {
    if (editingContact) {
      await updateContact(editingContact.id, data);
    } else {
      await addContact(data);
    }
    handleCloseForm();
  };
  
  const handleDeleteContact = async (contactId: string) => {
      await deleteContact(contactId);
      setSelectedContact(null);
      setIsFormOpen(false);
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))]">
      {/* Left Column: Contact List */}
      <div className="w-full max-w-xs flex-shrink-0 border-r p-4">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h1 className="text-xl font-bold">Λίστα Επαφών</h1>
            <p className="text-sm text-muted-foreground">
              Διαχειριστείτε τις επαφές σας.
            </p>
          </div>
          <Button size="sm" onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Νέα
          </Button>
        </div>
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ): (
            <ContactList
                contacts={contacts}
                selectedContactId={selectedContact?.id}
                onSelectContact={handleSelectContact}
            />
        )}
      </div>

      {/* Right Column: Details or Form */}
      <div className="flex-1 overflow-y-auto p-6">
        {isFormOpen ? (
          <ContactForm
            isSubmitting={isSubmitting}
            onSubmit={handleSaveContact}
            onCancel={handleCloseForm}
            initialData={editingContact}
          />
        ) : selectedContact ? (
          <ContactDetails contact={selectedContact} onEdit={handleEdit} onDelete={handleDeleteContact} />
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <h2 className="text-lg font-medium text-muted-foreground">
                Επιλέξτε μια επαφή
              </h2>
              <p className="text-sm text-muted-foreground">
                Επιλέξτε μια επαφή από τη λίστα για να δείτε τις λεπτομέρειες.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
