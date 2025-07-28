# Κώδικας Λειτουργικότητας Επαφών

Αυτό το αρχείο περιέχει τον πηγαίο κώδικα για όλα τα αρχεία που σχετίζονται με τη δημιουργία, προβολή και επεξεργασία των Επαφών στην εφαρμογή.

---

## 1. Κύρια Σελίδα Επαφών (Λίστα & Προβολή)

### `src/components/contacts/page.tsx`

```tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
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

function ContactList({ contacts, onSelectContact, selectedContactId }: { contacts: Contact[], onSelectContact: (id: string) => void, selectedContactId: string | null }) {
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
            onClick={() => onSelectContact(contact.id)}
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
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

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
  
  useEffect(() => {
    // If there's no selection or the selected contact is no longer in the list,
    // select the first one from the filtered list.
    const currentSelection = filteredContacts.find(c => c.id === selectedContactId);
    if (!currentSelection && filteredContacts.length > 0) {
      setSelectedContactId(filteredContacts[0].id);
    } else if (filteredContacts.length === 0) {
        setSelectedContactId(null);
    }
  }, [filteredContacts, selectedContactId]);
  
  const selectedContact = useMemo(() => {
      if (!selectedContactId || !contacts) return null;
      return contacts.find(c => c.id === selectedContactId) || null;
  }, [contacts, selectedContactId]);


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
                <ContactList contacts={filteredContacts} onSelectContact={setSelectedContactId} selectedContactId={selectedContactId} />
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
```

---

## 2. Προβολή Λεπτομερειών Επαφής

### `src/components/contacts/ContactDetailView.tsx`

```tsx
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
    <div className="grid grid-cols-3 gap-2 text-sm items-center">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
            {children || content}
        </div>
        {type && <Badge variant="outline" className="text-xs whitespace-nowrap">{type}</Badge>}
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
                <DetailRow key={i} label="Email" type={email.type}>
                     <div className="flex items-center gap-2">
                        <a href={`mailto:${email.value}`} className="text-primary hover:underline">{email.value}</a>
                        <a href={`mailto:${email.value}`} title={`Αποστολή σε ${email.value}`}>
                            <Send className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors"/>
                        </a>
                    </div>
                </DetailRow>
            ))}
            {contact.phones?.map((phone, i) => <DetailRow key={i} label="Τηλέφωνο" value={`${phone.countryCode || ''} ${phone.value}`} href={`tel:${phone.countryCode}${phone.value}`} type={`${phone.type} ${phone.indicators?.join(', ')}`.trim()} />)}
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
                 const fullAddress = [
                    address.street, address.number, address.toponym,
                    address.settlements, address.municipalLocalCommunities, address.municipalUnities,
                    address.municipality, address.regionalUnities, address.regions,
                    address.decentralizedAdministrations, address.largeGeographicUnits,
                    address.postalCode, address.country
                 ].filter(Boolean).join(', ');

                 const googleMapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;
                 
                 return (
                    <div key={i} className="p-3 rounded-md bg-muted/30 space-y-2">
                        <div className="flex justify-between items-center w-full">
                           <div>
                                <p className="font-semibold text-sm">{address.type || 'Διεύθυνση'}</p>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 text-sm gap-x-4 gap-y-1">
                          <DetailRow label="Οδός" value={`${address.street || ''} ${address.number || ''}`.trim()} />
                          <DetailRow label="Τοπωνύμιο" value={address.toponym} />
                          <DetailRow label="Τ.Κ." value={address.postalCode} />
                          <DetailRow label="Οικισμός" value={address.settlements} />
                          <DetailRow label="Δημοτική/Τοπική Κοινότητα" value={address.municipalLocalCommunities} />
                          <DetailRow label="Δημοτική Ενότητα" value={address.municipalUnities} />
                          <DetailRow label="Δήμος" value={address.municipality} />
                          <DetailRow label="Περιφερειακή Ενότητα" value={address.regionalUnities} />
                          <DetailRow label="Περιφέρεια" value={address.regions} />
                          <DetailRow label="Αποκεντρωμένη Διοίκηση" value={address.decentralizedAdministrations} />
                          <DetailRow label="Μεγάλη Γεωγραφική Ενότητα" value={address.largeGeographicUnits} />
                          <DetailRow label="Χώρα" value={address.country} />
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
```

---

## 3. Σελίδα Δημιουργίας Νέας Επαφής

### `src/app/contacts/new/page.tsx`

```tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, serverTimestamp, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { contactSchema, ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { logActivity } from '@/shared/lib/logger';
import { useAuth } from '@/shared/hooks/use-auth';

function deepClean(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepClean(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export default function NewContactPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            entityType: 'Φυσικό Πρόσωπο',
            photoUrl: '',
            identity: { type: 'Ταυτότητα', number: '', issuingAuthority: '' },
            emails: [],
            phones: [],
            socials: [],
            addresses: [],
            job: { role: '', specialty: ''},
            notes: ''
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        
        const dataToSave: { [key: string]: any } = { ...data };

        if (data.birthDate) dataToSave.birthDate = Timestamp.fromDate(new Date(data.birthDate));
        else dataToSave.birthDate = null;
        if (data.identity?.issueDate) dataToSave.identity.issueDate = Timestamp.fromDate(new Date(data.identity.issueDate));
        else if (dataToSave.identity) dataToSave.identity.issueDate = null;
        
        if (data.addresses) {
            dataToSave.addresses = data.addresses;
        }

        const cleanedData = deepClean(dataToSave);


        try {
            const docRef = await addDoc(collection(db, 'contacts'), {
                ...cleanedData,
                createdAt: serverTimestamp(),
                createdBy: user?.uid,
            });
            
            await logActivity('CREATE_CONTACT', { entityId: docRef.id, entityType: 'contact', name: data.name });

            if (fileToUpload) {
                toast({ title: "Η επαφή αποθηκεύτηκε", description: "Ανέβασμα φωτογραφίας..." });
                const filePath = `contact-images/${docRef.id}/${fileToUpload.name}`;
                const storageRef = ref(storage, filePath);
                await uploadBytes(storageRef, fileToUpload);
                const downloadURL = await getDownloadURL(storageRef);

                await updateDoc(docRef, { photoUrl: downloadURL });
                await logActivity('UPDATE_CONTACT', { entityId: docRef.id, entityType: 'contact', changes: { photoUrl: downloadURL } });
            }

            toast({ title: "Επιτυχία", description: `Η επαφή "${data.name}" δημιουργήθηκε.` });
            router.push('/contacts');

        } catch (error: any) {
            console.error("Error adding contact: ", error);
            toast({ variant: "destructive", title: "Σφάλμα", description: `Δεν ήταν δυνατή η δημιουργία της επαφής: ${error.message}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω στις Επαφές
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Αποθήκευση Επαφής
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Δημιουργία Νέας Επαφής</CardTitle>
                        <CardDescription>Συμπληρώστε τα παρακάτω πεδία για να δημιουργήσετε μια νέα επαφή.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ContactForm form={form} onFileSelect={setFileToUpload} />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
```

---

## 4. Σελίδα Επεξεργασίας Υπάρχουσας Επαφής

### `src/app/contacts/[id]/edit/page.tsx`

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/shared/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { Loader2, ArrowLeft, Save, ChevronsUpDown } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { contactSchema, ContactFormValues, ALL_ACCORDION_SECTIONS } from '@/shared/lib/validation/contactSchema';
import { logActivity } from '@/shared/lib/logger';
import { useAuth } from '@/shared/hooks/use-auth';

function deepClean(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null && !(obj[key] instanceof Date) && !(obj[key] instanceof Timestamp)) {
      deepClean(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
}


export default function EditContactPage() {
    const router = useRouter();
    const params = useParams();
    const contactId = params.id as string;
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [openSections, setOpenSections] = useState<string[]>(ALL_ACCORDION_SECTIONS);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {},
    });

    useEffect(() => {
        if (!contactId) return;

        const fetchContact = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'contacts', contactId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const formData: ContactFormValues = {
                        ...data,
                        id: docSnap.id,
                        birthDate: data.birthDate instanceof Timestamp ? data.birthDate.toDate() : null,
                        identity: {
                            ...data.identity,
                            issueDate: data.identity?.issueDate instanceof Timestamp ? data.identity.issueDate.toDate() : null,
                        },
                        addresses: data.addresses || [],
                    };
                    form.reset(formData);
                } else {
                    toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η επαφή δεν βρέθηκε.' });
                    router.push('/contacts');
                }
            } catch (error) {
                console.error("Error fetching contact:", error);
                toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Αποτυχία φόρτωσης δεδομένων.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchContact();
    }, [contactId, router, toast, form]);


    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        
        let newPhotoUrl = data.photoUrl;

        try {
             if (fileToUpload) {
                toast({ title: "Ενημέρωση επαφής", description: "Ανέβασμα νέας φωτογραφίας..." });
                const filePath = `contact-images/${contactId}/${fileToUpload.name}`;
                const storageRef = ref(storage, filePath);
                await uploadBytes(storageRef, fileToUpload);
                newPhotoUrl = await getDownloadURL(storageRef);
            }

            const dataToUpdate: { [key: string]: any } = { ...data, photoUrl: newPhotoUrl };
            
            if (data.birthDate) {
                dataToUpdate.birthDate = Timestamp.fromDate(new Date(data.birthDate));
            } else {
                dataToUpdate.birthDate = null;
            }

            if (data.identity?.issueDate) {
                dataToUpdate.identity.issueDate = Timestamp.fromDate(new Date(data.identity.issueDate));
            } else if (dataToUpdate.identity) {
                dataToUpdate.identity.issueDate = null;
            }
            
            if (data.addresses) {
                dataToUpdate.addresses = data.addresses;
            }

            const cleanedData = deepClean(dataToUpdate);
            delete cleanedData.id;

            const docRef = doc(db, 'contacts', contactId);
            await updateDoc(docRef, cleanedData);
            
            // After saving, reset the form with the new data to make it "not dirty"
            // and reflect the new photo URL.
            form.reset({ ...data, photoUrl: newPhotoUrl });
            setFileToUpload(null);

            await logActivity('UPDATE_CONTACT', {
                entityId: contactId,
                entityType: 'contact',
                name: data.name,
                changes: data,
            });
            toast({
                title: "Επιτυχία",
                description: `Οι αλλαγές στην επαφή "${data.name}" αποθηκεύτηκαν.`,
            });
        } catch (error: any) {
            console.error("Error updating contact: ", error);
            toast({
                variant: "destructive",
                title: "Σφάλμα",
                description: `Δεν ήταν δυνατή η ενημέρωση της επαφής: ${error.message}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const toggleAllSections = () => {
        if (openSections.length === ALL_ACCORDION_SECTIONS.length) {
            setOpenSections([]);
        } else {
            setOpenSections(ALL_ACCORDION_SECTIONS);
        }
    };

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω στις Επαφές
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Αποθήκευση Αλλαγών
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                       <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Επεξεργασία Επαφής</CardTitle>
                                <CardDescription>Ενημερώστε τα παρακάτω πεδία για να επεξεργαστείτε την επαφή.</CardDescription>
                            </div>
                             <Button variant="ghost" size="icon" onClick={toggleAllSections} type="button" title="Ανάπτυξη/Σύμπτυξη όλων">
                                <ChevronsUpDown className="h-5 w-5"/>
                            </Button>
                       </div>
                    </CardHeader>
                    <CardContent>
                         <ContactForm form={form} onFileSelect={setFileToUpload} openSections={openSections} onOpenChange={setOpenSections} />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
```

---

## 5. Components Φόρμας Επαφής

### `src/components/contacts/ContactForm.tsx`

```tsx
'use client';

import React from 'react';
import { Accordion } from '@/shared/components/ui/accordion';
import { BasicInfoSection } from './ContactForm/sections/BasicInfoSection';
import { IdentitySection } from './ContactForm/sections/IdentitySection';
import { ContactSection } from './ContactForm/sections/ContactSection';
import { AddressSection } from './ContactForm/sections/AddressSection';
import { JobSection } from './ContactForm/sections/JobSection';
import { NotesSection } from './ContactForm/sections/NotesSection';
import { type ContactFormProps } from './ContactForm/types';
import { SocialsSection } from './ContactForm/sections/SocialsSection';


export function ContactForm({ form, onFileSelect, openSections, onOpenChange }: ContactFormProps) {

  return (
    <Accordion type="multiple" value={openSections} onValueChange={onOpenChange} className="w-full">
      <BasicInfoSection form={form} onFileSelect={onFileSelect} />
      <IdentitySection form={form} />
      <ContactSection form={form} />
      <SocialsSection form={form} />
      <AddressSection form={form} />
      <JobSection form={form} />
      <NotesSection form={form} />
    </Accordion>
  );
}
```

### `src/components/contacts/ContactForm/sections/BasicInfoSection.tsx`

```tsx
'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon, User, Building2, Landmark } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Label } from '@/shared/components/ui/label';
import { ImageUploader } from '../../ImageUploader';
import { type ContactFormProps } from '../types';

export function BasicInfoSection({ form, onFileSelect }: ContactFormProps) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });
    const contactId = form.getValues('id'); 

    return (
        <AccordionItem value="personal">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                <span>Βασικά Στοιχεία</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
            <FormField
                control={form.control}
                name="entityType"
                render={({ field }) => (
                    <FormItem className="flex flex-col sm:flex-row sm:items-start sm:gap-4 space-y-2 sm:space-y-0 pt-2">
                    <FormLabel className="sm:w-40 sm:text-right sm:pt-2 shrink-0">Τύπος Οντότητας</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={(value) => {
                            field.onChange(value);
                            if (value === 'Φυσικό Πρόσωπο') {
                                const firstName = form.getValues('firstName') || '';
                                const lastName = form.getValues('lastName') || '';
                                form.setValue('name', `${firstName} ${lastName}`.trim());
                            } else {
                                form.setValue('name', '');
                            }
                        }}
                        defaultValue={field.value}
                        value={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1"
                        >
                        <FormItem>
                            <FormControl>
                            <RadioGroupItem value="Φυσικό Πρόσωπο" id="Φυσικό Πρόσωπο" className="sr-only" />
                            </FormControl>
                            <Label
                            htmlFor="Φυσικό Πρόσωπο"
                            className={cn(
                                'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                                field.value === 'Φυσικό Πρόσωπο' && 'border-primary'
                            )}
                            >
                            <User className="mb-3 h-6 w-6" />
                            Φυσικό Πρόσωπο
                            </Label>
                        </FormItem>
                        <FormItem>
                            <FormControl>
                                <RadioGroupItem value="Νομικό Πρόσωπο" id="Νομικό Πρόσωπο" className="sr-only" />
                            </FormControl>
                            <Label
                            htmlFor="Νομικό Πρόσωπο"
                            className={cn(
                                'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                                field.value === 'Νομικό Πρόσωπο' && 'border-primary'
                            )}
                            >
                            <Building2 className="mb-3 h-6 w-6" />
                            Νομικό Πρόσωπο
                            </Label>
                        </FormItem>
                        <FormItem>
                            <FormControl>
                                <RadioGroupItem value="Δημ. Υπηρεσία" id="Δημ. Υπηρεσία" className="sr-only" />
                            </FormControl>
                            <Label
                            htmlFor="Δημ. Υπηρεσία"
                            className={cn(
                                'flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer',
                                field.value === 'Δημ. Υπηρεσία' && 'border-primary'
                            )}
                            >
                            <Landmark className="mb-3 h-6 w-6" />
                            Δημ. Υπηρεσία
                            </Label>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    </FormItem>
                )}
                />

            {entityType && (
                <div className="space-y-4 border-t pt-4">
                {entityType !== 'Φυσικό Πρόσωπο' && (
                    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 space-y-2 sm:space-y-0">
                        <FormLabel className="sm:w-40 sm:text-right sm:pt-2.5 shrink-0">Επωνυμία</FormLabel>
                        <div className="flex-1 space-y-2">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormControl><Input {...field} placeholder="π.χ. DevConstruct AE" /></FormControl>
                                <FormDescription>Το πλήρες όνομα ή η εμπορική επωνυμία.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        </div>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 space-y-2 sm:space-y-0">
                    <FormLabel className="sm:w-40 sm:text-right sm:pt-2.5 shrink-0">{entityType === 'Φυσικό Πρόσωπο' ? 'Φωτογραφία' : 'Λογότυπο'}</FormLabel>
                    <div className="flex-1">
                        <ImageUploader 
                            entityType={entityType}
                            entityId={contactId}
                            initialImageUrl={form.getValues('photoUrl')}
                            onFileSelect={onFileSelect}
                        />
                    </div>
                </div>
                </div>
            )}

            {entityType === 'Φυσικό Πρόσωπο' && (
                <div className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Όνομα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Επώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="fatherName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Πατρώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="motherName" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Μητρώνυμο</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ημ/νία Γέννησης</FormLabel><div className="flex-1"><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} captionLayout="dropdown-buttons" fromYear={1930} toYear={new Date().getFullYear()} /></PopoverContent></Popover><FormMessage /></div></FormItem>)} />
                        <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Τόπος Γέννησης</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    </div>
                </div>
            )}
            </AccordionContent>
      </AccordionItem>
    );
}
```

### `src/components/contacts/ContactForm/sections/IdentitySection.tsx`

```tsx
'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { CalendarIcon, Info } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { type ContactFormProps } from '../types';

export function IdentitySection({ form }: ContactFormProps) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });

    return (
        <AccordionItem value="identity">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                <span>Στοιχεία Ταυτότητας &amp; ΑΦΜ</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entityType === 'Φυσικό Πρόσωπο' && (
                        <>
                            <FormField control={form.control} name="identity.type" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Τύπος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                            <FormField control={form.control} name="identity.number" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Αριθμός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                            <FormField control={form.control} name="identity.issueDate" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ημ/νία Έκδοσης</FormLabel><div className="flex-1"><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? (format(new Date(field.value), 'PPP')) : (<span>Επιλογή</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></div></FormItem>)} />
                            <FormField control={form.control} name="identity.issuingAuthority" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Εκδ. Αρχή</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                        </>
                    )}
                    <FormField control={form.control} name="afm" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">ΑΦΜ</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="doy" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">ΔΟΥ</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                </div>
            </AccordionContent>
      </AccordionItem>
    );
}
```

### `src/components/contacts/ContactForm/sections/ContactSection.tsx`

```tsx
'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Phone, PlusCircle, Trash2, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command';
import { type ContactFormProps } from '../types';
import { countryCodes } from '../utils/countryCodes';
import { PhoneIndicatorIcons, PHONE_INDICATORS } from '../utils/phoneIndicators';


export function ContactSection({ form }: ContactFormProps) {
    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: "emails" });
    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: "phones" });

    return (
        <AccordionItem value="contact">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <Phone className="h-5 w-5" />
                <span>Στοιχεία Επικοινωνίας</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 p-1 pt-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Emails</h3>
                        <Button type="button" variant="ghost" size="sm" onClick={() => appendEmail({ type: 'Προσωπικό', value: '' })}>
                            <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Email
                        </Button>
                    </div>
                    <div className="w-full space-y-2">
                        {emailFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 p-3 border rounded-md bg-muted/30 items-center">
                            <FormField control={form.control} name={`emails.${index}.type`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`emails.${index}.value`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl></FormItem>)} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Τηλέφωνα</h3>
                        <Button type="button" variant="ghost" size="sm" onClick={() => appendPhone({ type: 'Κινητό', countryCode: '+30', value: '', indicators: [] })}>
                            <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Τηλεφώνου
                        </Button>
                    </div>
                    <div className="w-full space-y-2">
                        {phoneFields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-3 p-3 border rounded-md bg-muted/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                <FormField control={form.control} name={`phones.${index}.type`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <div className="flex items-center gap-4">
                                    <FormLabel className="w-20 text-right">Αριθμός</FormLabel>
                                    <div className="flex-1 flex items-center gap-2">
                                        <FormField control={form.control} name={`phones.${index}.countryCode`} render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant="outline" role="combobox" className="w-[120px] justify-between">
                                                            {field.value ? countryCodes.find(c => c.code === field.value)?.flag : "Select"}
                                                            {field.value}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command><CommandInput placeholder="Search country..." /><CommandEmpty>No country found.</CommandEmpty>
                                                        <CommandList><CommandGroup>
                                                            {countryCodes.map((country) => (
                                                                <CommandItem key={country.code} value={country.name} onSelect={() => field.onChange(country.code)}>
                                                                    <Check className={cn("mr-2 h-4 w-4", country.code === field.value ? "opacity-100" : "opacity-0")}/>
                                                                    {country.flag} <span className="ml-2">{country.name} ({country.code})</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup></CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        )}/>
                                        <FormField control={form.control} name={`phones.${index}.value`} render={({ field }) => (<FormControl><Input {...field} type="tel" /></FormControl>)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                    </div>
                                    <FormMessage>{form.formState.errors.phones?.[index]?.value?.message}</FormMessage>
                                </div>
                            </div>
                            <FormField
                            control={form.control}
                            name={`phones.${index}.indicators`}
                            render={() => (
                                <FormItem>
                                    <div className="flex items-center space-x-4 pl-1 pt-2">
                                    {PHONE_INDICATORS.map((indicator) => {
                                        const Icon = PhoneIndicatorIcons[indicator];
                                        return (
                                            <FormField
                                                key={indicator}
                                                control={form.control}
                                                name={`phones.${index}.indicators`}
                                                render={({ field }) => (
                                                <FormItem className="flex items-center space-x-2">
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(indicator)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), indicator])
                                                            : field.onChange(
                                                                field.value?.filter((v) => v !== indicator)
                                                            );
                                                        }}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal text-sm flex items-center gap-1.5">
                                                        {Icon && <Icon className="h-4 w-4"/>}
                                                        {indicator}
                                                    </FormLabel>
                                                </FormItem>
                                                )}
                                            />
                                        );
                                    })}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        ))}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
```

### `src/components/contacts/ContactForm/sections/SocialsSection.tsx`

```tsx
'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Link as LinkIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { type ContactFormProps } from '../types';
import { SOCIAL_TYPES, socialIcons } from '../utils/socialIcons';


export function SocialsSection({ form }: ContactFormProps) {
    const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "socials" });

    return (
        <AccordionItem value="socials">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <LinkIcon className="h-5 w-5" />
                <span>Κοινωνικά Δίκτυα &amp; Websites</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Σύνδεσμοι</h3>
                        <Button type="button" variant="ghost" size="sm" onClick={() => appendSocial({ type: 'Website', label: 'Επαγγελματικό', url: '' })}>
                            <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Link
                        </Button>
                    </div>
                    <div className="w-full space-y-2">
                        {socialFields.map((field, index) => {
                            const selectedType = form.watch(`socials.${index}.type`);
                            const Icon = socialIcons[selectedType] || socialIcons.default;
                            return (
                                <div key={field.id} className="p-3 border rounded-md bg-muted/30 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`socials.${index}.type`}
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-4">
                                                    <FormLabel className="w-20 text-right">Τύπος</FormLabel>
                                                    <div className="flex-1">
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <div className="flex items-center gap-2">
                                                                        <Icon className="h-4 w-4" />
                                                                        <SelectValue/>
                                                                    </div>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {SOCIAL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField control={form.control} name={`socials.${index}.label`} render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-20 text-right">Ετικέτα</FormLabel><div className="flex-1"><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Επαγγελματικό">Επαγγελματικό</SelectItem><SelectItem value="Προσωπικό">Προσωπικό</SelectItem></SelectContent></Select></div><FormMessage /></FormItem>)} />
                                </div>
                                <div className="flex items-center gap-4">
                                        <FormLabel className="w-20 text-right">URL</FormLabel>
                                        <div className="flex-1 flex items-center gap-2">
                                            <FormField control={form.control} name={`socials.${index}.url`} render={({ field }) => (<FormControl><Input {...field} /></FormControl>)} />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                </div>
                                <FormMessage className="pl-24">{form.formState.errors.socials?.[index]?.url?.message}</FormMessage>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </AccordionContent>
      </AccordionItem>
    );
}
```

### `src/components/contacts/ContactForm/sections/AddressSection.tsx`

```tsx
'use client';

import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Map, PlusCircle, Trash2 } from 'lucide-react';
import { AddressAutocompleteInput } from '@/components/common/autocomplete/AddressAutocompleteInput';
import { addressFieldsMap, ADDRESS_TYPES, getFullAddress, handleAddressSelect } from '../utils/addressHelpers';
import { type ContactFormProps } from '../types';


export function AddressSection({ form }: ContactFormProps) {
    const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control: form.control, name: "addresses" });

    return (
        <AccordionItem value="addresses">
        <AccordionTrigger>
          <div className="flex items-center gap-2 text-primary">
            <Map className="h-5 w-5" />
            <span>Στοιχεία Διεύθυνσης</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 p-1">
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => appendAddress({ type: 'Κύρια', country: 'Ελλάδα' })}>
              <PlusCircle className="mr-2 h-4 w-4"/>Προσθήκη Διεύθυνσης
            </Button>
          </div>
          <div className="space-y-4">
            {addressFields.map((field, index) => {
              const fullAddress = getFullAddress(form, index);
              const googleMapsUrl = fullAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}` : null;

              return (
                <div key={field.id} className="p-4 border rounded-md bg-muted/30 space-y-4 relative">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeAddress(index)}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                  </Button>
                  <FormField control={form.control} name={`addresses.${index}.type`} render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-40 text-right">Τύπος Διεύθυνσης</FormLabel>
                      <div className="flex-1">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ADDRESS_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name={`addresses.${index}.street`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Οδός</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${index}.number`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Αριθμός</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${index}.toponym`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Τοπωνύμιο</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`addresses.${index}.postalCode`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Ταχ. Κώδικας</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                    {addressFieldsMap.map(f => (
                      <AddressAutocompleteInput
                        key={f.formKey}
                        form={form}
                        name={`addresses.${index}.${f.formKey}`}
                        label={f.label}
                        algoliaKey={f.algoliaKey}
                        onSelect={(hit: any) => handleAddressSelect(form, index, hit)}
                        indexName={process***REMOVED***.NEXT_PUBLIC_ALGOLIA_INDEX_NAME!}
                      />
                    ))}
                    <FormField control={form.control} name={`addresses.${index}.country`} render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-40 text-right">Χώρα</FormLabel>
                        <div className="flex-1">
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )} />
                  </div>
                  {googleMapsUrl && (
                    <div className="flex justify-end pt-2">
                      <Button asChild variant="outline" size="sm" type="button">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                          <Map className="mr-2 h-4 w-4" />
                          Προβολή στον Χάρτη
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
}
```

### `src/components/contacts/ContactForm/sections/JobSection.tsx`

```tsx
'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Briefcase } from 'lucide-react';
import { type ContactFormProps } from '../types';

export function JobSection({ form }: ContactFormProps) {
    const entityType = useWatch({ control: form.control, name: 'entityType' });

    if (entityType === 'Δημ. Υπηρεσία') {
        return null;
    }

    return (
        <AccordionItem value="job">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <Briefcase className="h-5 w-5" />
                <span>Επαγγελματικά Στοιχεία</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="job.role" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ρόλος</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.specialty" render={({ field }) => (<FormItem className="flex items-center gap-4"><FormLabel className="w-40 text-right">Ειδικότητα</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                    <FormField control={form.control} name="job.companyName" render={({ field }) => (<FormItem className="flex items-center gap-4 md:col-span-2"><FormLabel className="w-40 text-right">Επιχείρηση/Οργανισμός</FormLabel><div className="flex-1"><FormControl><Input {...field} /></FormControl><FormMessage /></div></FormItem>)} />
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
```

### `src/components/contacts/ContactForm/sections/NotesSection.tsx`

```tsx
'use client';

import React from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';
import { Info } from 'lucide-react';
import { type ContactFormProps } from '../types';

export function NotesSection({ form }: ContactFormProps) {
    return (
        <AccordionItem value="notes">
            <AccordionTrigger>
            <div className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                <span>Σημειώσεις</span>
            </div>
            </AccordionTrigger>
            <AccordionContent className="p-1 pt-4">
                <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Σημειώσεις</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder=""
                        className="resize-y"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </AccordionContent>
        </AccordionItem>
    );
}
```

---

## 6. Αρχεία Δεδομένων & Λογικής

### `src/shared/lib/validation/contactSchema.ts`

```ts
import { z } from 'zod';

export const ALL_ACCORDION_SECTIONS = ['personal', 'identity', 'contact', 'socials', 'addresses', 'job', 'notes'];

export const personalInfoSchema = z.object({
  id: z.string().optional(), // Keep ID for editing context
  name: z.string().min(1, 'Το όνομα/επωνυμία είναι υποχρεωτικό.'),
  entityType: z.enum(['Φυσικό Πρόσωπο', 'Νομικό Πρόσωπο', 'Δημ. Υπηρεσία']),
  
  // Personal Info fields - conditionally applied
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  birthDate: z.date().optional().nullable(),
  birthPlace: z.string().optional(),
  gender: z.enum(['Άνδρας', 'Γυναίκα', 'Άλλο']).optional(),
  nationality: z.string().optional(),
  photoUrl: z.string().url('Μη έγκυρο URL').or(z.literal('')).optional(),
});

export const identityTaxSchema = z.object({
  // ID & Tax Info
  identity: z.object({
    type: z.string().optional(),
    number: z.string().optional(),
    issueDate: z.date().optional().nullable(),
    issuingAuthority: z.string().optional(),
  }).optional(),
  afm: z.string()
    .optional()
    .refine(val => !val || /^\d{9}$/.test(val), {
        message: 'Το ΑΦΜ πρέπει να αποτελείται από ακριβώς 9 ψηφία.'
    }),
  doy: z.string().optional(),
});

export const contactInfoSchema = z.object({
    emails: z.array(z.object({
        type: z.string().default('Προσωπικό'),
        value: z.string().email({ message: 'Μη έγκυρη διεύθυνση email.' }).or(z.literal('')),
    })).optional(),
    phones: z.array(z.object({
        type: z.string().default('Κινητό'),
        countryCode: z.string().optional().default('+30'),
        value: z.string()
          .min(1, { message: 'Ο αριθμός είναι υποχρεωτικός.' })
          .refine(val => /^\d+$/.test(val), {
            message: 'Ο αριθμός τηλεφώνου πρέπει να περιέχει μόνο ψηφία.'
          }),
        indicators: z.array(z.enum(['Viber', 'WhatsApp', 'Telegram'])).optional(),
    })).optional(),
});


export const socialsSchema = z.object({
    socials: z.array(z.object({
        type: z.string().default('Website'),
        label: z.enum(['Επαγγελματικό', 'Προσωπικό']).default('Επαγγελματικό'),
        url: z.string().url({ message: 'Μη έγκυρο URL.' }).or(z.literal('')),
    })).optional(),
});

export const addressSchema = z.object({
    addresses: z.array(z.object({
        type: z.string().default('Κύρια'),
        street: z.string().optional(),
        number: z.string().optional(),
        toponym: z.string().optional(),
        postalCode: z.string().optional().refine(val => !val || /^\d{5}$/.test(val), {
            message: 'Ο Τ.Κ. πρέπει να αποτελείται από 5 ψηφία.'
        }),
        settlements: z.string().optional(),
        municipalLocalCommunities: z.string().optional(),
        municipalUnities: z.string().optional(),
        municipality: z.string().optional(),
        regionalUnities: z.string().optional(),
        regions: z.string().optional(),
        decentralizedAdministrations: z.string().optional(),
        largeGeographicUnits: z.string().optional(),
        country: z.string().optional().default('Ελλάδα'),
    })).optional(),
});

export const jobInfoSchema = z.object({
  job: z.object({
    role: z.string().optional(),
    specialty: z.string().optional(),
    title: z.string().optional(),
    companyName: z.string().optional(),
  }).optional(),
});

export const notesSchema = z.object({
  notes: z.string().optional(),
});

// Full combined schema
export const contactSchema = personalInfoSchema
  .merge(identityTaxSchema)
  .merge(contactInfoSchema)
  .merge(socialsSchema)
  .merge(addressSchema)
  .merge(jobInfoSchema)
  .merge(notesSchema);

export type ContactFormValues = z.infer<typeof contactSchema>;
```

### `src/shared/hooks/use-contacts.ts`

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { collection, onSnapshot, query as firestoreQuery } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { ContactFormValues } from '../lib/validation/contactSchema';

// Combine the form values with an ID and createdAt
export interface Contact extends ContactFormValues {
  id: string;
  createdAt: any;
}

async function fetchContacts(): Promise<Contact[]> {
  const contactsCollection = collection(db, 'contacts');
  const q = firestoreQuery(contactsCollection);
  
  return new Promise((resolve, reject) => {
    onSnapshot(q, (snapshot) => {
      const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      // Sort on the client side
      contacts.sort((a, b) => a.name.localeCompare(b.name));
      resolve(contacts);
    }, (error) => {
      console.error("Failed to fetch contacts:", error);
      reject(error);
    });
  });
}

export function useContacts() {
    const { data: contacts = [], isLoading, isError } = useQuery<Contact[]>({
      queryKey: ['contacts'],
      queryFn: fetchContacts,
      // Keep data fresh for 5 minutes, refetch in background
      staleTime: 1000 * 60 * 5, 
      refetchOnWindowFocus: true,
    });
    
    return { contacts, isLoading, isError };
}
```

### `src/hooks/useCustomLists.ts`

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  writeBatch,
  doc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  getDocs,
  where,
  limit,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';
import { useAuth } from '@/shared/hooks/use-auth';
import { logActivity } from '@/shared/lib/logger';

// --- Interfaces ---

export interface ListItem {
  id: string;
  value: string;
  code?: string;
  createdAt: any;
}

export interface CustomList {
  id: string;
  title: string;
  key: string; // The new immutable key
  description?: string;
  hasCode?: boolean;
  isProtected?: boolean;
  createdAt: any;
  items: ListItem[];
}

export type CreateListData = Omit<CustomList, 'id' | 'createdAt' | 'items'>;

const listKeyToContactFieldMap: Record<string, string> = {
    'roles': 'job.role',
    'specialties': 'job.specialty',
    'doy': 'doy',
    // Add other mappings here as needed, using the `key` of the list
}

// --- Custom Hook ---

export function useCustomLists() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lists, setLists] = useState<CustomList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const listsQuery = query(collection(db, 'tsia-custom-lists'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(listsQuery, async (snapshot) => {
      try {
        const listsData = await Promise.all(
          snapshot.docs.map(async (listDoc) => {
            const list = { id: listDoc.id, ...listDoc.data() } as CustomList;
            const itemsQuery = query(collection(listDoc.ref, 'tsia-items'), orderBy('createdAt', 'asc'));
            const itemsSnapshot = await getDocs(itemsQuery);
            list.items = itemsSnapshot.docs.map(itemDoc => ({ id: itemDoc.id, ...itemDoc.data() } as ListItem));
            return list;
          })
        );
        setLists(listsData);
      } catch (error) {
         console.error("Error processing custom lists snapshot:", error);
         toast({ variant: 'destructive', title: 'Σφάλμα Επεξεργασίας', description: 'Failed to process list data.' });
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error fetching custom lists:", error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Failed to load lists.' });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const createList = useCallback(async (listData: CreateListData): Promise<boolean> => {
      if(!user) return false;
      setIsSubmitting(true);
      try {
          const listRef = doc(collection(db, 'tsia-custom-lists'));
          await setDoc(listRef, { ...listData, createdAt: serverTimestamp() });
          toast({ title: 'Επιτυχία', description: 'Η λίστα δημιουργήθηκε.' });
          await logActivity('CREATE_LIST', { entityId: listRef.id, entityType: 'custom-list', name: listData.title });
          return true;
      } catch (error) {
          console.error('Error creating list:', error);
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η δημιουργία της λίστας απέτυχε.' });
          return false;
      } finally {
          setIsSubmitting(false);
      }
  }, [toast, user]);

  const updateList = useCallback(async (listId: string, data: Partial<CreateListData>): Promise<boolean> => {
      if(!user) return false;
      try {
        await updateDoc(doc(db, 'tsia-custom-lists', listId), data);
        toast({ title: 'Επιτυχία', description: 'Η λίστα ενημερώθηκε.' });
        return true;
      } catch (error) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση απέτυχε.' });
        return false;
      }
  }, [toast, user]);

  const deleteList = useCallback(async (listId: string, listTitle: string): Promise<boolean> => {
    if(!user) return false;
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε τη λίστα "${listTitle}" και όλα τα περιεχόμενά της;`)) {
        return false;
    }
    try {
        const batch = writeBatch(db);
        const listRef = doc(db, 'tsia-custom-lists', listId);
        
        const itemsQuery = query(collection(listRef, 'tsia-items'));
        const itemsSnapshot = await getDocs(itemsQuery);
        
        itemsSnapshot.docs.forEach(itemDoc => {
            batch.delete(itemDoc.ref);
        });

        batch.delete(listRef);

        await batch.commit();
        
        toast({ title: 'Επιτυχία', description: 'Η λίστα και όλα τα στοιχεία της διαγράφηκαν.' });
        await logActivity('DELETE_LIST', { entityId: listId, entityType: 'custom-list', name: listTitle });
        return true;
    } catch (error) {
        console.error('Error deleting list:', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
        return false;
    }
  }, [toast, user]);

  const addItem = useCallback(async (listId: string, rawValue: string, hasCode?: boolean): Promise<boolean> => {
    if (!user) return false;
    setIsSubmitting(true);
  
    try {
      const list = lists.find(l => l.id === listId);
      if (!list) throw new Error("List not found.");
  
      const itemsCollectionRef = collection(db, 'tsia-custom-lists', listId, 'tsia-items');
      const existingItems = list.items;
  
      let itemsToAdd: { value: string; code?: string }[] = [];
  
      if (hasCode) {
        const lines = rawValue.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        itemsToAdd = lines.map(line => {
          const firstSpaceIndex = line.indexOf(' ');
          if (firstSpaceIndex === -1) {
            return { code: line, value: line }; 
          }
          return {
            code: line.substring(0, firstSpaceIndex).trim(),
            value: line.substring(firstSpaceIndex + 1).trim(),
          };
        }).filter(item => {
          return item.code && !existingItems.some(ex => ex.code?.toLowerCase() === item.code?.toLowerCase());
        });
      } else {
        const values = rawValue.split(/[;\n\r\t]+/).map(v => v.trim()).filter(Boolean);
        itemsToAdd = values
          .filter(value => {
            return !existingItems.some(ex => ex.value.toLowerCase() === value.toLowerCase());
          })
          .map(value => ({ value }));
      }
  
      if (itemsToAdd.length === 0) {
        toast({ variant: 'default', title: 'Δεν προστέθηκαν νέα στοιχεία', description: 'Όλα τα στοιχεία που εισάγατε υπάρχουν ήδη.' });
        return true;
      }
  
      const batch = writeBatch(db);
      itemsToAdd.forEach(item => {
        const newItemRef = doc(itemsCollectionRef);
        batch.set(newItemRef, { ...item, createdAt: serverTimestamp() });
      });
  
      await batch.commit();
      toast({ title: 'Επιτυχία', description: `${itemsToAdd.length} στοιχεία προστέθηκαν.` });
      return true;
  
    } catch (error) {
      console.error('Error adding item(s):', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η προσθήκη απέτυχε.' });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [lists, toast, user]);

  const updateItem = useCallback(async (listId: string, itemId: string, data: { value: string; code?: string }): Promise<boolean> => {
     if(!user) return false;
     try {
         await updateDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId), data);
         return true;
     } catch (error) {
         toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η ενημέρωση του στοιχείου απέτυχε.' });
         return false;
     }
  }, [toast, user]);

  const deleteItem = useCallback(async (listId: string, listKey: string, itemId: string, itemValue: string): Promise<boolean> => {
     if(!user) return false;
     
     const contactField = listKeyToContactFieldMap[listKey];
     if (contactField) {
        const q = query(collection(db, 'contacts'), where(contactField, '==', itemValue), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const contactInUse = snapshot.docs[0].data();
            toast({
                variant: 'destructive',
                title: "Αδυναμία Διαγραφής",
                description: `Το στοιχείο "${itemValue}" χρησιμοποιείται από την επαφή: ${contactInUse.name}.`
            });
            return false;
        }
     }

     try {
        await deleteDoc(doc(db, 'tsia-custom-lists', listId, 'tsia-items', itemId));
        toast({ title: 'Επιτυχία', description: `Το στοιχείο "${itemValue}" διαγράφηκε.` });
        return true;
     } catch (error) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή του στοιχείου απέτυχε.' });
        return false;
     }
  }, [toast, user]);
  

  return { lists, isLoading, isSubmitting, createList, updateList, deleteList, addItem, updateItem, deleteItem };
}
```
