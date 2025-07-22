
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
  writeBatch,
  updateDoc,
  deleteDoc,
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, PlusCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import Image from 'next/image';


// Schema for the building form
const buildingSchema = z.object({
  id: z.string().optional(), // Hidden field to know if we are editing
  address: z.string().min(1, { message: 'Η διεύθυνση είναι υποχρεωτική.' }),
  type: z.string().min(1, { message: 'Ο τύπος είναι υποχρεωτικός.' }),
  description: z.string().optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')),
});

type BuildingFormValues = z.infer<typeof buildingSchema>;

interface Project {
  id: string;
  title: string;
  companyId: string;
  location?: string;
  description?: string;
  deadline: Timestamp;
  status: string;
}

interface Building {
  id: string; // This will be the ID from the subcollection
  address: string;
  type: string;
  photoUrl?: string;
  createdAt: any;
  topLevelId: string; // This will be the ID from the top-level collection
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      id: undefined,
      address: '',
      type: '',
      description: '',
      photoUrl: '',
    },
  });

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setEditingBuildingId(null);
    }
  };


  // Fetch project details
  useEffect(() => {
    if (!projectId) return;
    const docRef = doc(db, 'projects', projectId);
    const getProjectData = async () => {
      setIsLoadingProject(true);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() } as Project);
      } else {
        toast({
          variant: 'destructive',
          title: 'Σφάλμα',
          description: 'Το έργο δεν βρέθηκε.',
        });
        router.push('/projects');
      }
      setIsLoadingProject(false);
    };
    getProjectData();
  }, [projectId, router, toast]);

  // Listen for buildings in the subcollection
  useEffect(() => {
    if (!projectId) return;
    const buildingsColRef = collection(db, 'projects', projectId, 'buildings');
    const unsubscribe = onSnapshot(
      buildingsColRef,
      (snapshot) => {
        const buildingsData: Building[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                topLevelId: data.topLevelId,
                ...data,
            } as Building
        });
        setBuildings(buildingsData);
        setIsLoadingBuildings(false);
      },
      (error) => {
        console.error('Error fetching buildings: ', error);
        toast({
          variant: 'destructive',
          title: 'Σφάλμα',
          description: 'Δεν ήταν δυνατή η φόρτωση των κτιρίων.',
        });
        setIsLoadingBuildings(false);
      }
    );

    return () => unsubscribe();
  }, [projectId, toast]);

  const onSubmitBuilding = async (data: BuildingFormValues) => {
    setIsSubmitting(true);
    const finalData = {
        address: data.address,
        type: data.type,
        description: data.description || '',
        photoUrl: data.photoUrl?.trim() || undefined,
    }

    try {
        if (editingBuildingId) {
            // --- UPDATE LOGIC ---
            const buildingToUpdate = buildings.find(b => b.id === editingBuildingId);
            if (!buildingToUpdate) throw new Error("Building not found for update");
            
            const batch = writeBatch(db);
            const topLevelRef = doc(db, 'buildings', buildingToUpdate.topLevelId);
            const subCollectionRef = doc(db, 'projects', projectId, 'buildings', buildingToUpdate.id);

            batch.update(topLevelRef, finalData);
            batch.update(subCollectionRef, finalData);
            await batch.commit();

            toast({ title: 'Επιτυχία', description: 'Το κτίριο ενημερώθηκε.' });

        } else {
            // --- CREATE LOGIC ---
            const batch = writeBatch(db);
            const topLevelBuildingRef = doc(collection(db, 'buildings'));
            const subCollectionBuildingRef = doc(collection(db, 'projects', projectId, 'buildings'));
            
            batch.set(topLevelBuildingRef, {
                ...finalData,
                projectId: projectId,
                originalId: subCollectionBuildingRef.id,
                createdAt: serverTimestamp(),
            });
            batch.set(subCollectionBuildingRef, {
                ...finalData,
                topLevelId: topLevelBuildingRef.id,
                createdAt: serverTimestamp(),
            });
            await batch.commit();

            toast({ title: 'Επιτυχία', description: 'Το κτίριο προστέθηκε.' });
        }
        handleDialogOpenChange(false);
    } catch (error) {
        console.error('Error submitting building: ', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η υποβολή.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteBuilding = async (buildingId: string) => {
    const buildingToDelete = buildings.find(b => b.id === buildingId);
    if (!buildingToDelete) {
        toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν βρέθηκε το κτίριο προς διαγραφή." });
        return;
    }
    try {
        const batch = writeBatch(db);
        const topLevelRef = doc(db, 'buildings', buildingToDelete.topLevelId);
        const subCollectionRef = doc(db, 'projects', projectId, 'buildings', buildingToDelete.id);

        batch.delete(topLevelRef);
        batch.delete(subCollectionRef);
        
        await batch.commit();
        toast({ title: "Επιτυχία", description: "Το κτίριο διαγράφηκε." });
    } catch (error) {
        console.error("Error deleting building:", error);
        toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν ήταν δυνατή η διαγραφή του κτιρίου." });
    }
  };

  const handleEditBuilding = (building: Building) => {
    const topLevelId = building.topLevelId;
    const docRef = doc(db, 'buildings', topLevelId);
    getDoc(docRef).then(docSnap => {
        if(docSnap.exists()){
            const data = docSnap.data();
            form.reset({
                id: building.id,
                address: data.address,
                type: data.type,
                description: data.description,
                photoUrl: data.photoUrl,
            });
            setEditingBuildingId(building.id);
            setIsDialogOpen(true);
        }
    })
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return '-';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };

  const handleBuildingRowClick = (building: Building) => {
    router.push(`/buildings/${building.topLevelId}`);
  };


  if (isLoadingProject) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return null; // or a not-found component
  }

  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="sm" className="w-fit" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Επιστροφή στα Έργα
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>
            {project.location} | Προθεσμία: {formatDate(project.deadline)} | Κατάσταση: {project.status}
          </CardDescription>
        </CardHeader>
        {project.description && (
            <CardContent>
                <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
        )}
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Κτίρια του Έργου
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Νέο Κτίριο
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBuildingId ? 'Επεξεργασία' : 'Προσθήκη Νέου'} Κτιρίου</DialogTitle>
              <DialogDescription>
                Συμπληρώστε τις πληροφορίες για το κτίριο του έργου.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitBuilding)} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Διεύθυνση Κτιρίου</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. Πατησίων 100, Αθήνα" {...field} />
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
                      <FormLabel>Τύπος Κτιρίου</FormLabel>
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
                <DialogFooter>
                   <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                      Ακύρωση
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingBuildingId ? 'Αποθήκευση Αλλαγών' : 'Προσθήκη Κτιρίου'}
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
          {isLoadingBuildings ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : buildings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Φωτο</TableHead>
                  <TableHead>Διεύθυνση</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buildings.map((building) => (
                  <TableRow key={building.id} className="group">
                    <TableCell>
                      <div 
                        onClick={() => handleBuildingRowClick(building)} 
                        className="cursor-pointer"
                      >
                         {building.photoUrl ? (
                            <Image
                            src={building.photoUrl}
                            alt={building.address}
                            width={40}
                            height={40}
                            className="rounded-md object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">N/A</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell 
                      className="font-medium cursor-pointer" 
                      onClick={() => handleBuildingRowClick(building)}
                    >
                      {building.address}
                    </TableCell>
                    <TableCell 
                      className="text-muted-foreground cursor-pointer"
                      onClick={() => handleBuildingRowClick(building)}
                    >
                      {building.type}
                    </TableCell>
                    <TableCell 
                      onClick={() => handleBuildingRowClick(building)}
                      className="cursor-pointer"
                    >
                      {formatDate(building.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditBuilding(building)}>
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
                                            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το κτίριο "{building.address}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteBuilding(building.id)} className="bg-destructive hover:bg-destructive/90">
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
            <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν κτίρια για αυτό το έργο.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
