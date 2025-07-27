
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Edit, Mail, Phone, Link as LinkIcon, Building, Briefcase, Info, Home, User, Cake, MapPin, Globe, Linkedin, Facebook, Instagram, Github, Youtube, Map, Send } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Contact } from '@/shared/hooks/use-contacts';

interface ContactDetailViewProps {
  contact: Contact | null;
}

const socialIcons: { [key: string]: React.ElementType } = {
    Website: Globe,
    LinkedIn: Linkedin,
    Facebook: Facebook,
    Instagram: Instagram,
    GitHub: Github,
    YouTube: Youtube,
    TikTok: Info, // Placeholder, no TikTok icon in lucide-react
    default: LinkIcon,
};

const DetailSection = ({ title, children, icon, alwaysShow = false }: { title: string; children: React.ReactNode; icon: React.ElementType; alwaysShow?: boolean }) => {
    const hasContent = React.Children.count(children) > 0 && (Array.isArray(children) ? children.filter(c => c).length > 0 : true);

    if (!hasContent && !alwaysShow) {
        return null;
    }

    return (
        <div className="border-t pt-4 mt-4">
            <h3 className="flex items-center text-lg font-semibold mb-3 text-primary">
                {React.createElement(icon, { className: 'mr-2 h-5 w-5' })}
                {title}
            </h3>
            <div className="space-y-3 pl-7">
                {hasContent ? children : <p className="text-sm text-muted-foreground italic">Δεν υπάρχουν καταχωρημένα στοιχεία.</p>}
            </div>
        </div>
    );
};

const DetailRow = ({ label, value, href, type, children }: { label: string; value?: string | null; href?: string, type?: string, children?: React.ReactNode }) => {
  if (!value && !children) return null; // Don't render empty rows

  const content = href && value ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{value}</a>
  ) : (
    <span>{value}</span>
  );

  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 flex items-center gap-2">
        {children || content}
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
  
  const hasPersonalInfo = contact.firstName || contact.lastName || contact.fatherName || contact.motherName || contact.birthDate || contact.birthPlace;
  const hasIdentityInfo = contact.identity?.type || contact.identity?.number || contact.identity?.issueDate || contact.identity?.issuingAuthority || contact.afm || contact.doy;
  const hasContactInfo = (contact.emails && contact.emails.length > 0) || (contact.phones && contact.phones.length > 0);
  const hasSocials = contact.socials && contact.socials.length > 0;
  const hasAddresses = contact.addresses && contact.addresses.length > 0;
  const hasJobInfo = contact.job?.role || contact.job?.specialty;
  const hasNotes = !!contact.notes;


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
        
        {contact.entityType === 'Φυσικό Πρόσωπο' && (
          <DetailSection title="Προσωπικά Στοιχεία" icon={User} alwaysShow>
            <DetailRow label="Όνομα" value={contact.firstName} />
            <DetailRow label="Επώνυμο" value={contact.lastName} />
            <DetailRow label="Πατρώνυμο" value={contact.fatherName} />
            <DetailRow label="Μητρώνυμο" value={contact.motherName} />
            <DetailRow label="Ημ/νία Γέννησης" value={formatDate(contact.birthDate)} />
            <DetailRow label="Τόπος Γέννησης" value={contact.birthPlace} />
          </DetailSection>
        )}

        <DetailSection title="Ταυτότητα &amp; ΑΦΜ" icon={Info} alwaysShow>
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

        <DetailSection title="Στοιχεία Επικοινωνίας" icon={Phone} alwaysShow>
            {contact.emails?.map((email, i) => (
                <DetailRow key={i} label="Email" value={email.value} type={email.type}>
                     <div className="flex items-center gap-2">
                        <a href={`mailto:${email.value}`} className="text-primary hover:underline">{email.value}</a>
                        <a href={`mailto:${email.value}`} title={`Αποστολή σε ${email.value}`}>
                            <Send className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors"/>
                        </a>
                    </div>
                </DetailRow>
            ))}
            {contact.phones?.map((phone, i) => <DetailRow key={i} label="Τηλέφωνο" value={phone.value} href={`tel:${phone.value}`} type={`${phone.type} ${phone.indicators?.join(', ')}`.trim()} />)}
        </DetailSection>
        
        <DetailSection title="Κοινωνικά Δίκτυα &amp; Websites" icon={LinkIcon} alwaysShow>
            {contact.socials?.map((social, i) => {
                const Icon = socialIcons[social.type] || socialIcons.default;
                return (
                    <div key={i} className="flex items-center text-sm gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground"/>
                        <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex-1 truncate">{social.url}</a>
                        <Badge variant="outline" className="text-xs">{social.type}</Badge>
                        <Badge variant={social.label === 'Επαγγελματικό' ? 'secondary' : 'outline'} className="text-xs">{social.label}</Badge>
                    </div>
                );
            })}
        </DetailSection>

        <DetailSection title="Διευθύνσεις" icon={Map} alwaysShow>
            {contact.addresses?.map((address, i) => {
                 const fullAddress = [address.street, address.number, address.city, address.postalCode, address.country].filter(Boolean).join(', ');
                 const googleMapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;
                 return (
                    <div key={i} className="p-3 rounded-md bg-muted/30">
                        <div className="flex justify-between items-center w-full">
                           <div>
                                <p className="font-semibold text-sm">{address.type || 'Διεύθυνση'}</p>
                                <p className="text-sm text-muted-foreground">{fullAddress}</p>
                           </div>
                           {googleMapsUrl && (
                            <Button asChild variant="outline" size="sm">
                                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                    <Map className="mr-2 h-4 w-4" />
                                    Χάρτης
                                </a>
                            </Button>
                           )}
                        </div>
                    </div>
                 )
            })}
        </DetailSection>

        {contact.entityType !== 'Δημ. Υπηρεσία' && (
            <DetailSection title="Επαγγελματικά Στοιχεία" icon={Briefcase} alwaysShow>
                <DetailRow label="Ρόλος" value={contact.job?.role} />
                <DetailRow label="Ειδικότητα" value={contact.job?.specialty} />
            </DetailSection>
        )}

        <DetailSection title="Σημειώσεις" icon={Info} alwaysShow>
            {contact.notes ? <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.notes}</p> : null}
        </DetailSection>
      </CardContent>
    </Card>
  );
}
