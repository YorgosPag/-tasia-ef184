
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Contact } from '../hooks/useContacts';

interface ContactListProps {
  contacts: Contact[];
  selectedContactId?: string | null;
  onSelectContact: (contact: Contact) => void;
}

export const ContactList = ({ contacts, selectedContactId, onSelectContact }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.job?.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.entityType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Αναζήτηση επαφής..."
          className="pl-10"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1 -mr-4 pr-4">
        <ul className="space-y-1">
          {filteredContacts.map(contact => (
            <li key={contact.id}>
              <button
                onClick={() => onSelectContact(contact)}
                className={cn(
                  "w-full text-left p-2 rounded-md flex items-center gap-3 transition-colors",
                  selectedContactId === contact.id ? "bg-accent" : "hover:bg-accent/50"
                )}
              >
                <Avatar className="h-9 w-9">
                    <AvatarImage src={contact.photoUrl} alt={contact.name}/>
                    <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                    <p className="font-semibold text-sm truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {contact.job?.role || '...'} • {contact.entityType || '...'}
                    </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};
