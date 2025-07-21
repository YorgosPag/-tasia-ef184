
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

// Schema for the building form
const buildingSchema = z.object({
  address: z.string().min(1, { message: 'Η διεύθυνση είναι υποχρεωτική.' }),
  type: z.string().min(1, { message: 'Ο τύπος είναι υποχρεωτικός.' }),
});

type BuildingFormValues = z.infer<typeof buildingSchema>;

interface Project {
  id: string;
  title: string;
  companyId: string;
  deadline: Timestamp;
  status: string;
}

interface Building {
  id: string; // This will be the ID from the subcollection
  address: string;
  type: string;
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
  const { toast } = useToast();

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      address: '',
      type: '',
    },
  });

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
                topLevelId: data.topLevelId, // Assuming topLevelId is stored
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
    try {
      const topLevelBuildingRef = doc(collection(db, 'buildings'));
      const subCollectionBuildingRef = doc(collection(db, 'projects', projectId, 'buildings'));

      // Set the top-level building document
      await setDoc(topLevelBuildingRef, {
        ...data,
        projectId: projectId,
        originalId: subCollectionBuildingRef.id,
        createdAt: serverTimestamp(),
      });
      
      // Set the sub-collection building document
      await setDoc(subCollectionBuildingRef, {
        ...data,
        topLevelId: topLevelBuildingRef.id, // Link to top-level doc
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Επιτυχία',
        description: 'Το κτίριο προστέθηκε με επιτυχία.',
      });
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding building: ', error);
      toast({
        variant: 'destructive',
        title: 'Σφάλμα',
        description: 'Δεν ήταν δυνατή η προσθήκη του κτιρίου.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
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
            Αναγνωριστικό Εταιρείας: {project.companyId} | Προθεσμία: {formatDate(project.deadline)} | Κατάσταση: {project.status}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Κτίρια του Έργου
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Νέο Κτίριο
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Προσθήκη Νέου Κτιρίου</DialogTitle>
              <DialogDescription>
                Συμπληρώστε τις πληροφορίες για να προσθέσετε ένα νέο κτίριο στο έργο.
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
                <DialogFooter>
                   <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isSubmitting}>
                      Ακύρωση
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Προσθήκη Κτιρίου
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
                  <TableHead>Διεύθυνση</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buildings.map((building) => (
                  <TableRow key={building.id} onClick={() => handleBuildingRowClick(building)} className="cursor-pointer">
                    <TableCell className="font-medium">{building.address}</TableCell>
                    <TableCell className="text-muted-foreground">{building.type}</TableCell>
                    <TableCell>{formatDate(building.createdAt)}</TableCell>
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
