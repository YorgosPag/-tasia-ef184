
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, addDoc, serverTimestamp, Timestamp, writeBatch, doc } from 'firebase/firestore';
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
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useDataStore } from '@/hooks/use-data-store';


const buildingSchema = z.object({
  address: z.string().min(1, { message: 'Η διεύθυνση είναι υποχρεωτική.' }),
  type: z.string().min(1, { message: 'Ο τύπος είναι υποχρεωτικός.' }),
  description: z.string().optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')),
  projectId: z.string().optional(),
});

type BuildingFormValues = z.infer<typeof buildingSchema>;

interface Building extends BuildingFormValues {
  id: string;
  createdAt: any;
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { projects, isLoading: isLoadingProjects } = useDataStore();

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      address: '',
      type: '',
      description: '',
      photoUrl: '',
      projectId: '',
    },
  });
  
  // Effect to reset form when dialog is closed
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset();
    }
  }, [isDialogOpen, form]);

  useEffect(() => {
    // This will listen to a top-level 'buildings' collection
    const unsubscribe = onSnapshot(collection(db, 'buildings'), (snapshot) => {
      const buildingsData: Building[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Building));
      setBuildings(buildingsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching buildings: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η φόρτωση των κτιρίων.",
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const onSubmit = async (data: BuildingFormValues) => {
    setIsSubmitting(true);
    try {
        const batch = writeBatch(db);
        const topLevelBuildingRef = doc(collection(db, 'buildings'));

        const buildingData = {
            address: data.address,
            type: data.type,
            description: data.description || '',
            photoUrl: data.photoUrl?.trim() || undefined,
            projectId: data.projectId || undefined,
            createdAt: serverTimestamp(),
        };

        if (data.projectId) {
            const subCollectionBuildingRef = doc(collection(db, 'projects', data.projectId, 'buildings'));
            
            // Set in top-level collection with reference to subcollection
            batch.set(topLevelBuildingRef, {
                ...buildingData,
                originalId: subCollectionBuildingRef.id,
            });
            // Set in subcollection with reference to top-level collection
            batch.set(subCollectionBuildingRef, {
                address: data.address,
                type: data.type,
                description: data.description,
                photoUrl: data.photoUrl,
                createdAt: serverTimestamp(),
                topLevelId: topLevelBuildingRef.id,
            });
        } else {
             // If no project is selected, just add to the top-level collection
            batch.set(topLevelBuildingRef, {
                ...buildingData,
                originalId: topLevelBuildingRef.id, // Point to self if no parent
            });
        }

        await batch.commit();

      toast({
        title: "Επιτυχία",
        description: "Το κτίριο προστέθηκε με επιτυχία.",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding building: ", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η προσθήκη του κτιρίου.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

   const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    // Ensure timestamp is a Firebase Timestamp object before converting
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'dd/MM/yyyy');
    }
    // Fallback for objects that might already be Date
    if (timestamp instanceof Date) {
        return format(timestamp, 'dd/MM/yyyy');
    }
    return 'Άγνωστη ημερομηνία';
  };

  const handleRowClick = (buildingId: string) => {
    router.push(`/buildings/${buildingId}`);
  };

  const getProjectTitle = (projectId: string | undefined) => {
    if (!projectId) return 'N/A';
    return projects.find(p => p.id === projectId)?.title || projectId;
  };


  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Κτίρια
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Νέο Κτίριο
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Δημιουργία Νέου Κτιρίου</DialogTitle>
              <DialogDescription>
                Συμπληρώστε τις παρακάτω πληροφορίες για να δημιουργήσετε ένα νέο κτίριο.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Διεύθυνση</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. Αριστοτέλους 1, Αθήνα" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Τύπος</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. Πολυκατοικία" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Φωτογραφίας (Προαιρετικό)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/photo.jpg" {...field} />
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
                        <Textarea placeholder="Σημειώσεις για το κτίριο..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Αντιστοίχιση σε Έργο (Προαιρετικό)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Επιλέξτε έργο..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="">
                                    <em>Κανένα</em>
                                </SelectItem>
                                {isLoadingProjects ? (
                                    <div className="flex items-center justify-center p-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                ) : (
                                    projects.map(project => (
                                        <SelectItem key={project.id} value={project.id}>{project.title}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
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
                    Δημιουργία
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Κτιρίων</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : buildings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Διεύθυνση</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Έργο</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buildings.map((building) => (
                  <TableRow key={building.id} onClick={() => handleRowClick(building.id)} className="cursor-pointer">
                    <TableCell className="font-medium">{building.address}</TableCell>
                    <TableCell className="text-muted-foreground">{building.type}</TableCell>
                    <TableCell className="text-muted-foreground">{getProjectTitle(building.projectId)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(building.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν κτίρια.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    