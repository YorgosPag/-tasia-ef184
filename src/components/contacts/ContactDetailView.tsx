
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Edit, Mail, Phone, Link as LinkIcon, Building, Briefcase, Info, Home, User, Cake, MapPin } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Contact } from '@/shared/hooks/use-contacts';

interface ContactDetailViewProps {
  contact: Contact | null;
}

const DetailSection = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ElementType }) => (
  <div className="border-t pt-4 mt-4">
    <h3 className="flex items-center text-lg font-semibold mb-3">
      {React.createElement(icon, { className: 'mr-2 h-5 w-5 text-primary' })}
      {title}
    </h3>
    <div className="space-y-3 pl-7">{children}</div>
  </div>
);

const DetailRow = ({ label, value, href, type }: { label: string; value?: string | null; href?: string, type?: string }) => {
  const displayValue = value || '-';

  const content = href && value ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{value}</a>
  ) : (
    <span className={!value ? 'text-muted-foreground' : ''}>{displayValue}</span>
  );

  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 flex items-center gap-2">
        {content}
        {type && <Badge variant="outline" className="text-xs">{type}</Badge>}
        </dd>
    </div>
  );
};


export function ContactDetailView({ contact }: ContactDetailViewProps) {
  if (!contact) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground">Επιλέξτε μια επαφή από τη λίστα</p>
          <p className="text-sm text-muted-foreground">για να δείτε τις λεπτομέρειες.</p>
        </div>
      </div>
    );
  }
  
  const getBadgeVariant = (type?: Contact['entityType']) => {
      switch(type) {
          case 'Νομικό Πρόσωπο': return 'default';
          case 'Δημ. Υπηρεσία': return 'secondary';
          default: return 'outline';
      }
  }

  const formatDate = (date: any) => {
    if (!date) return null;
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, 'dd/MM/yyyy');
    } catch {
        return null;
    }
  }
  
  const fullAddress = [
    contact.address?.street,
    contact.address?.number,
    contact.address?.city,
    contact.address?.postalCode
  ].filter(Boolean).join(' ');

  return (
    <Card className="h-full sticky top-20">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.photoUrl || undefined} alt={contact.name} />
            <AvatarFallback>{contact.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{contact.name}</CardTitle>
            <CardDescription className="flex flex-col mt-1">
              <span>{contact.entityType || '-'}</span>
              <span className="text-xs">{contact.job?.role || '-'}</span>
            </CardDescription>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
            <Link href={`/contacts/${contact.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Επεξεργασία
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Personal Info */}
        {contact.entityType === 'Φυσικό Πρόσωπο' && (
          <DetailSection title="Προσωπικά Στοιχεία" icon={User}>
            <DetailRow label="Όνομα" value={contact.firstName} />
            <DetailRow label="Επώνυμο" value={contact.lastName} />
            <DetailRow label="Πατρώνυμο" value={contact.fatherName} />
            <DetailRow label="Μητρώνυμο" value={contact.motherName} />
            <DetailRow label="Ημ/νία Γέννησης" value={formatDate(contact.birthDate)} />
            <DetailRow label="Τόπος Γέννησης" value={contact.birthPlace} />
          </DetailSection>
        )}

        {/* ID & Tax Info */}
        <DetailSection title="Ταυτότητα & ΑΦΜ" icon={Info}>
            {contact.entityType === 'Φυσικό Πρόσωπο' ? (
                 <>
                    <DetailRow label="Τύπος" value={contact.identity?.type} />
                    <DetailRow label="Αριθμός" value={contact.identity?.number} />
                    <DetailRow label="Ημ/νία Έκδοσης" value={formatDate(contact.identity?.issueDate)} />
                    <DetailRow label="Εκδ. Αρχή" value={contact.identity?.issuingAuthority} />
                 </>
            ) : null}
            <DetailRow label="ΑΦΜ" value={contact.afm} />
            <DetailRow label="ΔΟΥ" value={contact.doy} />
        </DetailSection>

        {/* Contact Info */}
        <DetailSection title="Στοιχεία Επικοινωνίας" icon={Phone}>
            {(contact.emails && contact.emails.length > 0) 
              ? contact.emails.map((email, i) => <DetailRow key={i} label="Email" value={email.value} href={`mailto:${email.value}`} type={email.type}/>)
              : <DetailRow label="Email" value={null} />
            }
            {(contact.phones && contact.phones.length > 0)
              ? contact.phones.map((phone, i) => <DetailRow key={i} label="Τηλέφωνο" value={phone.value} href={`tel:${phone.value}`} type={`${phone.type} ${phone.indicators?.join(', ')}`.trim()} />)
              : <DetailRow label="Τηλέφωνο" value={null} />
            }
        </DetailSection>
        
        {/* Socials & Websites */}
        <DetailSection title="Κοινωνικά Δίκτυα & Websites" icon={LinkIcon}>
            {(contact.socials && contact.socials.length > 0)
              ? contact.socials.map((social, i) => <DetailRow key={i} label={social.type} value={social.url} href={social.url} />)
              : <DetailRow label="Website" value={null} />
            }
        </DetailSection>

        {/* Address */}
        <DetailSection title="Διεύθυνση" icon={MapPin}>
            <p className="text-sm text-muted-foreground">
                {fullAddress || '-'}
            </p>
        </DetailSection>

        {/* Job Info */}
        {contact.entityType !== 'Δημ. Υπηρεσία' && (
            <DetailSection title="Επαγγελματικά Στοιχεία" icon={Briefcase}>
                <DetailRow label="Ρόλος" value={contact.job?.role} />
                <DetailRow label="Ειδικότητα" value={contact.job?.specialty} />
            </DetailSection>
        )}

        {/* Notes */}
        <DetailSection title="Σημειώσεις" icon={Info}>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.notes || '-'}</p>
        </DetailSection>
      </CardContent>
    </Card>
  );
}
