'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Loader2, Link as LinkIcon, Download, Search } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import Link from 'next/link';
import { exportToJson } from '@/shared/lib/exporter';
import { useAuth } from '@/shared/hooks/use-auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { Badge } from '@/shared/components/ui/badge';
import { useContacts, type Contact } from '@/shared/hooks/use-contacts';
import { contactSchema, ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { ContactForm } from './ContactForm';
import { Form } from '@/shared/components/ui/form';

export default function ContactsPage() {
  const { isEditor } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { contacts, isLoading } = useContacts();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      entityType: 'Φυσικό Πρόσωπο',
      photoUrl: '',
      identity: { type: 'Ταυτότητα', number: '', issuingAuthority: '' },
      contactInfo: { email: '', phone: '', landline: ''},
      socials: { website: '', linkedin: '', facebook: ''},
      address: { street: '', number: '', city: '', postalCode: ''},
      job: { role: '', specialty: ''},
      notes: ''
    },
  });
  
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen, form]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contacts'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Επιτυχία",
        description: "Η επαφή προστέθηκε με επιτυχία.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding contact: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η προσθήκη της επαφής.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter(contact => {
      const query = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(query) ||
        (contact.entityType && contact.entityType.toLowerCase().includes(query)) ||
        (contact.contactInfo?.email && contact.contactInfo.email.toLowerCase().includes(query)) ||
        (contact.contactInfo?.phone && contact.contactInfo.phone.toLowerCase().includes(query)) ||
        (contact.afm && contact.afm.toLowerCase().includes(query))
      );
    });
  }, [contacts, searchQuery]);

  const handleExport = () => {
    exportToJson(filteredContacts, 'contacts');
  };

  const getBadgeVariant = (type?: Contact['entityType']) => {
      switch(type) {
          case 'Νομικό Πρόσωπο': return 'default';
          case 'Δημ. Υπηρεσία': return 'secondary';
          default: return 'outline';
      }
  }

  return (
    <div className="flex flex-col gap-8">
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                    <PlusCircle className="mr-2" />
                    Νέα Επαφή
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                    <DialogTitle>Δημιουργία Νέας Επαφής</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="max-h-[80vh] overflow-y-auto pr-6">
                        <ContactForm form={form} />
                        <DialogFooter className="mt-4 sticky bottom-0 bg-background py-4">
                          <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                          <Button type="submit" disabled={isSubmitting || isLoading}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Δημιουργία</Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
                </Dialog>
            )}
        </div>
      </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Αναζήτηση σε όνομα, τύπο, ΑΦΜ, email..." className="pl-10 w-full md:w-1/3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
       </div>
      <Card>
        <CardHeader>
          <CardTitle>Λίστα Επαφών ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : filteredContacts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Όνομα</TableHead><TableHead>Τύπος</TableHead><TableHead>Email</TableHead><TableHead>Τηλέφωνο</TableHead><TableHead>ΑΦΜ</TableHead><TableHead>Website</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Avatar title={contact.name}><AvatarImage src={contact.photoUrl || undefined} alt={contact.name} /><AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        {contact.name}
                      </TableCell>
                      <TableCell><Badge variant={getBadgeVariant(contact.entityType)}>{contact.entityType}</Badge></TableCell>
                      <TableCell>{contact.contactInfo?.email ? (<a href={`mailto:${contact.contactInfo.email}`} className="text-primary hover:underline">{contact.contactInfo.email}</a>) : (<span className="text-muted-foreground">N/A</span>)}</TableCell>
                      <TableCell className="text-muted-foreground">{contact.contactInfo?.phone || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">{contact.afm || 'N/A'}</TableCell>
                      <TableCell>{contact.socials?.website ? (<Link href={contact.socials.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><LinkIcon size={14}/>Επίσκεψη</Link>) : (<span className="text-muted-foreground">N/A</span>)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : ( <p className="text-center text-muted-foreground py-8">{searchQuery ? 'Δεν βρέθηκαν επαφές.' : 'Δεν υπάρχουν καταχωρημένες επαφές.'}</p>)}
        </CardContent>
      </Card>
    </div>
  );
}
