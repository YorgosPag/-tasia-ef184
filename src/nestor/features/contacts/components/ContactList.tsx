
'use client';

import { Contact } from '@/nestor/features/contacts/hooks/useContacts';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

interface ContactListProps {
  contacts: Contact[];
  selectedContactId?: string | null;
  onSelectContact: (contact: Contact) => void;
}

export function ContactList({
  contacts,
  selectedContactId,
  onSelectContact,
}: ContactListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 pr-4">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className={cn(
              'flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
              selectedContactId === contact.id && 'bg-muted'
            )}
          >
            <div className="flex w-full items-center gap-3">
                 <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.photoUrl} alt={contact.name} />
                  <AvatarFallback>{contact.name?.[0]}</AvatarFallback>
                </Avatar>
              <div className="flex-1">
                <div className="font-semibold">{contact.name}</div>
                 <div className="text-xs text-muted-foreground">
                    {contact.job?.role || contact.entityType}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
