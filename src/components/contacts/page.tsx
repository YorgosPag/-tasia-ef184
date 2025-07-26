'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Input } from '@/shared/components/ui/input';
import { PlusCircle, Loader2, Download, Search, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { exportToJson } from '@/shared/lib/exporter';
import { useAuth } from '@/shared/hooks/use-auth';
import { Badge } from '@/shared/components/ui/badge';
import { useContacts, type Contact } from '@/shared/hooks/use-contacts';
import { ContactDetailView } from './ContactDetailView';

function ContactList({ contacts, onSelectContact, selectedContactId }: { contacts: Contact[], onSelectContact: (contact: Contact) => void, selectedContactId: string | null }) {
  const router = useRouter();

  const getBadgeVariant = (type?: Contact['entityType']) => {
      switch(type) {
          case 'Νομικό Πρόσωπο': return 'default';
          case 'Δημ. Υπηρεσία': return 'secondary';
          default: return 'outline';
      }
  }

  return (
    <Table>
      <TableHeader>
          <TableRow>
              <TableHead>Όνομα</TableHead>
              <TableHead>Τύπος</TableHead>
          </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow 
            key={contact.id} 
            onClick={() => onSelectContact(contact)}
            className={`cursor-pointer ${selectedContactId === contact.id ? 'bg-muted hover:bg-muted' : ''}`}
          >
            <TableCell className="font-medium flex items-center gap-2">
              <Avatar className="h-8 w-8"><AvatarImage src={contact.photoUrl || undefined} alt={contact.name} /><AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
              {contact.name}
            </TableCell>
            <TableCell><Badge variant={getBadgeVariant(contact.entityType)}>{contact.entityType}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function ContactsPage() {
  const { isEditor } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { contacts, isLoading } = useContacts();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(contact => {
      const query = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(query) ||
        (contact.entityType && contact.entityType.toLowerCase().includes(query)) ||
        (contact.afm && contact.afm.toLowerCase().includes(query))
      );
    });
  }, [contacts, searchQuery]);
  
  // Select the first contact by default if the list is not empty
  // and no contact is currently selected.
  // This avoids an empty detail view on initial load.
  if(!selectedContact && filteredContacts.length > 0) {
      setSelectedContact(filteredContacts[0]);
  }
  
  if (selectedContact && !filteredContacts.find(c => c.id === selectedContact.id)) {
      setSelectedContact(filteredContacts[0] || null);
  }

  const handleExport = () => {
    exportToJson(filteredContacts, 'contacts');
  };

  return (
    <div className="flex flex-col gap-8 h-full">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Επαφές
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" disabled={isLoading || filteredContacts.length === 0}>
                <Download className="mr-2"/>
                Εξαγωγή σε JSON
            </Button>
            {isEditor && (
                <Button onClick={() => router.push('/contacts/new')}>
                    <PlusCircle className="mr-2" />
                    Νέα Επαφή
                </Button>
            )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
        <div className="md:col-span-1 lg:col-span-1">
           <Card className="h-full">
            <CardHeader>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input type="search" placeholder="Αναζήτηση επαφής..." className="pl-10 w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
            </CardHeader>
            <CardContent className="p-0">
            {isLoading ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : (
                <ContactList contacts={filteredContacts} onSelectContact={setSelectedContact} selectedContactId={selectedContact?.id || null} />
            )}
            </CardContent>
           </Card>
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <ContactDetailView contact={selectedContact} />
        </div>
      </div>
    </div>
  );
}
