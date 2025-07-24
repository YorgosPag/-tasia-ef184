
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2 } from 'lucide-react';
import { ContactCard, InfoItem } from './ContactCard';
import type { Contact } from '../hooks/useContacts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ContactDetailsProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

export const ContactDetails = ({ contact, onEdit, onDelete }: ContactDetailsProps) => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.logoUrl} alt={contact.name} />
            <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{contact.name}</h2>
            <p className="text-muted-foreground">{contact.job?.role || 'N/A'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(contact)}>
            <Edit className="mr-2 h-4 w-4" />
            Επεξεργασία
          </Button>
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Διαγραφή
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                      <AlertDialogDescription>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά η επαφή "{contact.name}".</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(contact.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>
      
      <ContactCard title="Επαγγελματικά Στοιχεία / Στοιχεία Οντότητας" contact={contact} onEdit={() => onEdit(contact)} section="professional">
        <InfoItem label="Επωνυμία / Όνομα" value={contact.name} />
        <InfoItem label="Ρόλος" value={contact.job?.role} />
        <InfoItem label="Ειδικότητα" value={contact.job?.specialty} />
        <InfoItem label="Τύπος Οντότητας" value={contact.entityType} />
        <InfoItem label="ΑΦΜ" value={contact.contactInfo?.afm} />
      </ContactCard>

      <ContactCard title="Στοιχεία Επικοινωνίας" contact={contact} onEdit={() => onEdit(contact)} section="contactInfo">
        <InfoItem label="Email" value={contact.contactInfo?.email} />
        <InfoItem label="Κινητό" value={contact.contactInfo?.phone} />
        <InfoItem label="Σταθερό" value={contact.contactInfo?.landline} />
        <InfoItem label="Website" value={contact.website} />
        <InfoItem label="Διεύθυνση" value={contact.contactInfo?.address} />
      </ContactCard>
    </div>
  );
};
