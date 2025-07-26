

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2, Link as LinkIcon, Download, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { exportToJson } from '@/lib/exporter';
import { useAuth } from '@/hooks/use-auth';
import { collection, onSnapshot, addDoc, serverTimestamp, query as firestoreQuery } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface Contact {
  id: string;
  name: string;
  type: 'Company' | 'Individual' | 'Lawyer' | 'Notary' | 'Supplier' | 'Public Service';
  logoUrl?: string;
  website?: string;
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
    afm?: string;
  };
  createdAt: any;
}

const contactSchema = z.object({
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  type: z.enum(['Company', 'Individual', 'Lawyer', 'Notary', 'Supplier', 'Public Service']),
  logoUrl: z.string().url({ message: "Το URL του λογότυπου δεν είναι έγκυρο." }).or(z.literal('')),
  website: z.string().url({ message: "Το URL του website δεν είναι έγκυρο." }).or(z.literal('')),
  contactInfo: z.object({
      email: z.string().email({ message: "Το email δεν είναι έγκυρο." }).or(z.literal('')),
      phone: z.string().optional(),
      address: z.string().optional(),
      afm: z.string().optional(),
  })
});

type ContactFormValues = z.infer<typeof contactSchema>;

async function fetchContacts(): Promise<Contact[]> {
  const contactsCollection = collection(db, 'contacts');
  // Removed orderBy to prevent index errors
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

export default function ContactsPage() {
  const { isEditor } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery({
      queryKey: ['contacts'],
      queryFn: fetchContacts
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      type: 'Individual',
      logoUrl: '',
      website: '',
      contactInfo: { email: '', phone: '', address: '', afm: '' }
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
        contact.type.toLowerCase().includes(query) ||
        (contact.contactInfo?.email && contact.contactInfo.email.toLowerCase().includes(query)) ||
        (contact.contactInfo?.phone && contact.contactInfo.phone.toLowerCase().includes(query)) ||
        (contact.contactInfo?.afm && contact.contactInfo.afm.toLowerCase().includes(query))
      );
    });
  }, [contacts, searchQuery]);

  const handleExport = () => {
    exportToJson(filteredContacts, 'contacts');
  };

  const getBadgeVariant = (type: Contact['type']) => {
      switch(type) {
          case 'Company': return 'default';
          case 'Lawyer': return 'secondary';
          case 'Notary': return 'secondary';
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Δημιουργία Νέας Επαφής</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Επωνυμία</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Individual">Φυσικό Πρόσωπο</SelectItem>
                                    <SelectItem value="Company">Εταιρεία</SelectItem>
                                    <SelectItem value="Lawyer">Δικηγόρος</SelectItem>
                                    <SelectItem value="Notary">Συμβολαιογράφος</SelectItem>
                                    <SelectItem value="Supplier">Προμηθευτής</SelectItem>
                                    <SelectItem value="Public Service">Δημόσια Υπηρεσία</SelectItem>
                                </SelectContent>
                            </Select><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="logoUrl" render={({ field }) => (<FormItem><FormLabel>URL Λογοτύπου</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="contactInfo.address" render={({ field }) => (<FormItem><FormLabel>Διεύθυνση</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="contactInfo.afm" render={({ field }) => (<FormItem><FormLabel>ΑΦΜ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (<FormItem><FormLabel>Τηλέφωνο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="contactInfo.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <DialogFooter>
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
                <TableHeader><TableRow><TableHead>Επαφή</TableHead><TableHead>Τύπος</TableHead><TableHead>Email</TableHead><TableHead>Τηλέφωνο</TableHead><TableHead>ΑΦΜ</TableHead><TableHead>Website</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Avatar title={contact.name}><AvatarImage src={contact.logoUrl || undefined} alt={contact.name} /><AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                        {contact.name}
                      </TableCell>
                      <TableCell><Badge variant={getBadgeVariant(contact.type)}>{contact.type}</Badge></TableCell>
                      <TableCell>{contact.contactInfo?.email ? (<a href={`mailto:${contact.contactInfo.email}`} className="text-primary hover:underline">{contact.contactInfo.email}</a>) : (<span className="text-muted-foreground">N/A</span>)}</TableCell>
                      <TableCell className="text-muted-foreground">{contact.contactInfo?.phone || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">{contact.contactInfo?.afm || 'N/A'}</TableCell>
                      <TableCell>{contact.website ? (<Link href={contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><LinkIcon size={14}/>Επίσκεψη</Link>) : (<span className="text-muted-foreground">N/A</span>)}</TableCell>
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
