
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Contact } from '../hooks/useContacts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface InfoItemProps {
    label: string;
    value?: string | null;
}
const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium truncate">{value || '-'}</p>
  </div>
);


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
      
      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Επαγγελματικά Στοιχεία / Στοιχεία Οντότητας</CardTitle>
            <Button variant="ghost" size="icon"><Edit className="h-4 w-4 text-muted-foreground" /></Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <InfoItem label="Επωνυμία / Όνομα" value={contact.name} />
            <InfoItem label="Ρόλος" value={contact.job?.role} />
            <InfoItem label="Ειδικότητα" value={contact.job?.specialty} />
            <InfoItem label="Τύπος Οντότητας" value={contact.entityType} />
            <InfoItem label="ΑΦΜ" value={contact.contactInfo?.afm} />
            <InfoItem label="Website" value={contact.website} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Στοιχεία Επικοινωνίας</CardTitle>
            <Button variant="ghost" size="icon"><Edit className="h-4 w-4 text-muted-foreground" /></Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <InfoItem label="Email" value={contact.contactInfo?.email} />
            <InfoItem label="Κινητό" value={contact.contactInfo?.phone} />
            <InfoItem label="Σταθερό" value={contact.contactInfo?.landline} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Στοιχεία Διεύθυνσης</CardTitle>
            <div className="flex items-center">
              <Button variant="ghost" size="icon"><MapPin className="h-4 w-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon"><Edit className="h-4 w-4 text-muted-foreground" /></Button>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <InfoItem label="Οδός" value={contact.contactInfo?.address} />
            <InfoItem label="Περιοχή" value={contact.contactInfo?.region} />
            <InfoItem label="Πόλη" value={contact.contactInfo?.city} />
            <InfoItem label="Τ.Κ." value={contact.contactInfo?.postalCode} />
            <InfoItem label="Δήμος" value={contact.contactInfo?.municipality} />
        </CardContent>
      </Card>
      
      {contact.notes && (
           <Card>
                <CardHeader><CardTitle className="text-lg">Σημειώσεις</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
                </CardContent>
            </Card>
      )}

    </div>
  );
};
