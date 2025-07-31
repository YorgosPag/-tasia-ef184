"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Contact } from "@/hooks/use-contacts";

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (id: string) => void;
  selectedContactId: string | null;
}

export function ContactList({
  contacts,
  onSelectContact,
  selectedContactId,
}: ContactListProps) {
  const router = useRouter();

  const getBadgeVariant = (type?: Contact["entityType"]) => {
    switch (type) {
      case "Νομικό Πρόσωπο":
        return "default";
      case "Δημ. Υπηρεσία":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Όνομα</TableHead>
          <TableHead>Τύπος</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => {
          const entityTypeTab =
            contact.entityType === "Φυσικό Πρόσωπο"
              ? "individual"
              : contact.entityType === "Νομικό Πρόσωπο"
                ? "legal"
                : "public";
          const photoUrl = contact.photoUrls?.[entityTypeTab];
          return (
            <TableRow
              key={contact.id}
              onClick={() => onSelectContact(contact.id)}
              className={`cursor-pointer ${
                selectedContactId === contact.id
                  ? "bg-muted hover:bg-muted"
                  : ""
              }`}
            >
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={photoUrl || undefined} alt={contact.name} />
                  <AvatarFallback>
                    {contact.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {contact.name}
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(contact.entityType)}>
                  {contact.entityType}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
