
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, PlusCircle, Loader2, Home, BedDouble, Bath, Compass, Tag, Euro, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const attachmentSchema = z.object({
  id: z.string().optional(), // Used to know if we are editing
  type: z.enum(['parking', 'storage'], {
    required_error: 'Ο τύπος είναι υποχρεωτικός.'
  }),
  details: z.string().optional(),
  area: z.string().transform(v => v.trim()).refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Το εμβαδόν πρέπει να είναι αριθμός." }).optional(),
  price: z.string().transform(v => v.trim()).refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Η τιμή πρέπει να είναι αριθμός." }).optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')).optional(),
});

type AttachmentFormValues = z.infer<typeof attachmentSchema>;

interface Unit {
  id: string;
  identifier: string;
  name: string;
  type?: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
  buildingId: string;
  floorId: string;
  originalId: string; // The ID in the subcollection
  createdAt: Timestamp;
  area?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  orientation?: string;
  amenities?: string[];
}

interface Attachment {
  id: string;
  type: 'parking' | 'storage';
  details?: string;
  unitId: string;
  createdAt: any;
  area?: number;
  price?: number;
  photoUrl?: string;
}

export default function UnitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params.id as string;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoadingUnit, setIsLoadingUnit] = useState(true);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AttachmentFormValues>({
    resolver: zodResolver(attachmentSchema),
    defaultValues: {
      id: undefined,
      type: 'parking',
      details: '',
      area: '',
      price: '',
      photoUrl: '',
    },
  });

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset({
        id: undefined,
        type: 'parking',
        details: '',
        area: '',
        price: '',
        photoUrl: '',
      });
    }
  };


  // Fetch unit details from top-level collection
  useEffect(() => {
    if (!unitId) return;
    const docRef = doc(db, 'units', unitId);
    const getUnitData = async () => {
      setIsLoadingUnit(true);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const unitData = { id: docSnap.id, ...docSnap.data() } as Unit;
        setUnit(unitData);
      } else {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Το ακίνητο δεν βρέθηκε.' });
        router.push('/units');
      }
      setIsLoadingUnit(false);
    };
    getUnitData();
  }, [unitId, router, toast]);

  // Listen for attachments that belong to this unit
  useEffect(() => {
    if (!unitId) return;

    const attachmentsQuery = query(collection(db, 'attachments'), where('unitId', '==', unitId));
    
    const unsubscribe = onSnapshot(attachmentsQuery, (snapshot) => {
        const data: Attachment[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Attachment));
        setAttachments(data);
        setIsLoadingAttachments(false);
    }, (error) => {
        console.error('Error fetching attachments: ', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των παρακολουθημάτων.' });
        setIsLoadingAttachments(false);
    });

    return () => unsubscribe();
  }, [unitId, toast]);
  
  const onSubmitAttachment = async (data: AttachmentFormValues) => {
     if (!unitId) return;
     
     setIsSubmitting(true);
     
     const finalData = {
         type: data.type,
         details: data.details,
         area: data.area ? parseFloat(data.area) : undefined,
         price: data.price ? parseFloat(data.price) : undefined,
         photoUrl: data.photoUrl?.trim() || undefined,
         unitId: unitId,
     };

     try {
       if (data.id) { // This is an update
          const attachmentRef = doc(db, 'attachments', data.id);
          await updateDoc(attachmentRef, finalData);
          toast({ title: 'Επιτυχία', description: 'Το παρακολούθημα ενημερώθηκε.' });
       } else { // This is a new document
          await addDoc(collection(db, 'attachments'), {
              ...finalData,
              createdAt: serverTimestamp(),
          });
          toast({ title: 'Επιτυχία', description: 'Το παρακολούθημα προστέθηκε.' });
       }
       handleDialogOpenChange(false);
     } catch (error) {
       console.error('Error submitting attachment: ', error);
       toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η υποβολή.' });
     } finally {
       setIsSubmitting(false);
     }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
        await deleteDoc(doc(db, 'attachments', attachmentId));
        toast({ title: 'Επιτυχία', description: 'Το παρακολούθημα διαγράφηκε.' });
    } catch (error) {
        console.error('Error deleting attachment: ', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η διαγραφή.' });
    }
  };

  const handleEditAttachment = (attachment: Attachment) => {
      form.reset({
          id: attachment.id,
          type: attachment.type,
          details: attachment.details || '',
          area: attachment.area?.toString() || '',
          price: attachment.price?.toString() || '',
          photoUrl: attachment.photoUrl || '',
      });
      setIsDialogOpen(true);
  };


  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'Άγνωστο';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };
  
  const getAttachmentTypeLabel = (type: string) => {
    return type === 'parking' ? 'Θέση Στάθμευσης' : 'Αποθήκη';
  };

  const getStatusClass = (status: Unit['status'] | undefined) => {
      switch(status) {
          case 'Πωλημένο': return 'bg-red-500 hover:bg-red-600 text-white';
          case 'Κρατημένο': return 'bg-blue-500 hover:bg-blue-600 text-white';
          case 'Διαθέσιμο': return 'bg-green-500 hover:bg-green-600 text-white';
          case 'Οικοπεδούχος': return 'bg-orange-500 hover:bg-orange-600 text-white';
          default: return 'bg-gray-500 hover:bg-gray-600 text-white';
      }
  }

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'N/A';
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(price);
  }

  const UnitStat = ({ icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined}) => {
    if (value === undefined || value === null || value === '') return null;
    const IconComponent = icon;
    return (
        <div className="flex items-center gap-2 text-sm">
            <IconComponent className="h-5 w-5 text-muted-foreground" />
            <div>
                <p className="font-semibold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
  };

  if (isLoadingUnit) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  if (!unit) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="sm" className="w-fit" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Επιστροφή</Button>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Ακίνητο: {unit.name} ({unit.identifier})</CardTitle>
                    <CardDescription>Τύπος: {unit.type || 'N/A'} | ID Ορόφου: {unit.floorId}</CardDescription>
                </div>
                <Badge variant="default" className={getStatusClass(unit.status)}>
                    {unit.status}
                </Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-4 gap-x-2 border-t pt-4">
                <UnitStat icon={Home} label="Εμβαδόν" value={unit.area ? `${unit.area} τ.μ.` : undefined} />
                <UnitStat icon={Euro} label="Τιμή" value={formatPrice(unit.price)} />
                <UnitStat icon={BedDouble} label="Υπνοδωμάτια" value={unit.bedrooms} />
                <UnitStat icon={Bath} label="Μπάνια" value={unit.bathrooms} />
                <UnitStat icon={Compass} label="Προσανατολισμός" value={unit.orientation} />
            </div>
            {unit.amenities && unit.amenities.length > 0 && (
                <div className="mt-4 border-t pt-4">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Παροχές
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {unit.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary">{amenity}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Παρακολουθήματα Ακινήτου</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2" />Νέο Παρακολούθημα</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{form.getValues('id') ? 'Επεξεργασία' : 'Προσθήκη'} Παρακολουθήματος</DialogTitle>
              <DialogDescription>Συμπληρώστε τις πληροφορίες.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitAttachment)} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Τύπος</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε τύπο" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="parking">Θέση Στάθμευσης</SelectItem>
                          <SelectItem value="storage">Αποθήκη</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Λεπτομέρειες (Προαιρετικό)</FormLabel>
                      <FormControl><Input placeholder="π.χ. Υπόγειο, Νο. 5" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Εμβαδόν (τ.μ.)</FormLabel>
                        <FormControl><Input type="number" placeholder="π.χ. 12.5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Τιμή (€)</FormLabel>
                        <FormControl><Input type="number" placeholder="π.χ. 15000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Φωτογραφίας</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/storage.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                   <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                   <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{form.getValues('id') ? 'Αποθήκευση' : 'Προσθήκη'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Λίστα Παρακολουθημάτων</CardTitle></CardHeader>
        <CardContent>
          {isLoadingAttachments ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : attachments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Φωτογραφία</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Λεπτομέρειες</TableHead>
                  <TableHead>Εμβαδόν</TableHead>
                  <TableHead>Τιμή</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attachments.map((att) => (
                  <TableRow key={att.id} className="group">
                     <TableCell>
                      {att.photoUrl ? (
                        <Image
                          src={att.photoUrl}
                          alt={att.details || 'Attachment'}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{getAttachmentTypeLabel(att.type)}</TableCell>
                    <TableCell className="text-muted-foreground">{att.details || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{att.area ? `${att.area} τ.μ.` : 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{formatPrice(att.price)}</TableCell>
                    <TableCell className="text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditAttachment(att)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Επεξεργασία</span>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Διαγραφή</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το παρακολούθημα.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteAttachment(att.id)} className="bg-destructive hover:bg-destructive/90">
                                            Διαγραφή
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν παρακολουθήματα για αυτό το ακίνητο.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
