
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
  setDoc,
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
import { ArrowLeft, PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const floorSchema = z.object({
  level: z.string().min(1, { message: 'Το επίπεδο είναι υποχρεωτικό.' }),
  description: z.string().optional(),
});

type FloorFormValues = z.infer<typeof floorSchema>;

interface Building {
  id: string;
  address: string;
  type: string;
  projectId?: string;
  originalId?: string;
  createdAt: Timestamp;
}

interface Floor extends FloorFormValues {
  id: string;
  createdAt: any;
}

export default function BuildingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const buildingId = params.id as string;

  const [building, setBuilding] = useState<Building | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoadingBuilding, setIsLoadingBuilding] = useState(true);
  const [isLoadingFloors, setIsLoadingFloors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      level: '',
      description: '',
    },
  });

  // Fetch building details
  useEffect(() => {
    if (!buildingId) return;
    const docRef = doc(db, 'buildings', buildingId);
    const getBuildingData = async () => {
      setIsLoadingBuilding(true);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBuilding({ id: docSnap.id, ...docSnap.data() } as Building);
      } else {
        toast({
          variant: 'destructive',
          title: 'Σφάλμα',
          description: 'Το κτίριο δεν βρέθηκε.',
        });
        router.push('/buildings');
      }
      setIsLoadingBuilding(false);
    };
    getBuildingData();
  }, [buildingId, router, toast]);

  // Listen for floors in the subcollection
  useEffect(() => {
    if (!building || !building.projectId || !building.originalId) return;
    const floorsColRef = collection(db, 'projects', building.projectId, 'buildings', building.originalId, 'floors');
    const unsubscribe = onSnapshot(
      floorsColRef,
      (snapshot) => {
        const floorsData: Floor[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Floor));
        setFloors(floorsData);
        setIsLoadingFloors(false);
      },
      (error) => {
        console.error('Error fetching floors: ', error);
        toast({
          variant: 'destructive',
          title: 'Σφάλμα',
          description: 'Δεν ήταν δυνατή η φόρτωση των ορόφων.',
        });
        setIsLoadingFloors(false);
      }
    );

    return () => unsubscribe();
  }, [building, toast]);

  const onSubmitFloor = async (data: FloorFormValues) => {
    if (!building || !building.projectId || !building.originalId) {
        toast({variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε το γονικό κτίριο.'});
        return;
    }
    setIsSubmitting(true);
    try {
      // Add to subcollection
      const floorSubRef = doc(collection(db, 'projects', building.projectId, 'buildings', building.originalId, 'floors'));
      await setDoc(floorSubRef, {
        ...data,
        createdAt: serverTimestamp(),
      });
      
      // Also add to a top-level 'floors' collection
      await setDoc(doc(db, 'floors', floorSubRef.id), {
          ...data,
          buildingId: building.id,
          originalId: floorSubRef.id,
          createdAt: serverTimestamp(),
      });
      toast({
        title: 'Επιτυχία',
        description: 'Ο όροφος προστέθηκε με επιτυχία.',
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding floor: ', error);
      toast({
        variant: 'destructive',
        title: 'Σφάλμα',
        description: 'Δεν ήταν δυνατή η προσθήκη του ορόφου.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (floorId: string) => {
    router.push(`/floors/${floorId}`);
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };

  if (isLoadingBuilding) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!building) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="sm" className="w-fit" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Επιστροφή
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Κτίριο: {building.address}</CardTitle>
          <CardDescription>
            Τύπος: {building.type} | Ημερομηνία Δημιουργίας: {formatDate(building.createdAt)}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Όροφοι του Κτιρίου
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Νέος Όροφος
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Προσθήκη Νέου Ορόφου</DialogTitle>
              <DialogDescription>
                Συμπληρώστε τις πληροφορίες για να προσθέσετε έναν νέο όροφο στο κτίριο.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitFloor)} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Επίπεδο Ορόφου</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. 1, 0, -1, Ισόγειο" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Περιγραφή (Προαιρετικό)</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. Γραφεία εταιρείας" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                   <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                      Ακύρωση
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Προσθήκη Ορόφου
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Ορόφων</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingFloors ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : floors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Επίπεδο</TableHead>
                  <TableHead>Περιγραφή</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {floors.map((floor) => (
                  <TableRow key={floor.id} onClick={() => handleRowClick(floor.id)} className="cursor-pointer">
                    <TableCell className="font-medium">{floor.level}</TableCell>
                    <TableCell className="text-muted-foreground">{floor.description || 'N/A'}</TableCell>
                    <TableCell>{formatDate(floor.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν όροφοι για αυτό το κτίριο.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
