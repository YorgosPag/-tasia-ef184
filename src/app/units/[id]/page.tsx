
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
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
import { ArrowLeft, PlusCircle, Loader2, Home, BedDouble, Bath, Compass, Tag, Euro } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const attachmentSchema = z.object({
  type: z.enum(['parking', 'storage'], {
    required_error: 'Ο τύπος είναι υποχρεωτικός.'
  }),
  details: z.string().optional(),
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

interface Attachment extends AttachmentFormValues {
  id: string;
  unitId: string;
  createdAt: any;
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
      type: 'parking',
      details: '',
    },
  });

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
     try {
       await addDoc(collection(db, 'attachments'), {
         ...data,
         unitId: unitId,
         createdAt: serverTimestamp(),
       });

       toast({ title: 'Επιτυχία', description: 'Το παρακολούθημα προστέθηκε.' });
       form.reset();
       setIsDialogOpen(false);
     } catch (error) {
       console.error('Error adding attachment: ', error);
       toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η προσθήκη του παρακολουθήματος.' });
     } finally {
       setIsSubmitting(false);
     }
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2" />Νέο Παρακολούθημα</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Προσθήκη Νέου Παρακολουθήματος</DialogTitle>
              <DialogDescription>Συμπληρώστε τις πληροφορίες για να προσθέσετε ένα νέο παρακολούθημα.</DialogDescription>
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
                <DialogFooter>
                   <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                   <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Προσθήκη</Button>
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
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Λεπτομέρειες</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attachments.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell className="font-medium">{getAttachmentTypeLabel(att.type)}</TableCell>
                    <TableCell className="text-muted-foreground">{att.details || 'N/A'}</TableCell>
                    <TableCell>{formatDate(att.createdAt)}</TableCell>
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
