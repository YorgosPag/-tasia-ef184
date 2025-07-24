
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Contact } from '../hooks/useContacts';

interface ContactCardProps {
  title: string;
  contact: Contact;
  onEdit: (section: 'professional' | 'contactInfo') => void;
  children: React.ReactNode;
  section: 'professional' | 'contactInfo';
}

export const ContactCard = ({ title, contact, onEdit, children, section }: ContactCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">{title}</CardTitle>
      <Button variant="ghost" size="icon" onClick={() => onEdit(section)}>
        <Edit className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {section === 'professional' && (
        <div className="flex items-center justify-center md:col-span-1">
          <Avatar className="h-24 w-24">
            <AvatarImage src={contact.logoUrl} alt={contact.name} />
            <AvatarFallback>{contact.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className={section === 'professional' ? 'md:col-span-2' : 'md:col-span-3'}>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
            {children}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const InfoItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="font-semibold text-muted-foreground">{label}</p>
    <p>{value || '-'}</p>
  </div>
);

