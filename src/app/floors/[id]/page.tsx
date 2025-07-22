
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '@/lib/firebase';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, PlusCircle, Loader2, UploadCloud, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const FloorPlanViewer = dynamic(
  () => import('@/components/floor-plan-viewer').then(mod => mod.FloorPlanViewer),
  {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-muted-foreground" /></div>
  }
);


const unitSchema = z.object({
  identifier: z.string().min(1, { message: 'Ο κωδικός είναι υποχρεωτικός.' }),
  name: z.string().min(1, { message: 'Το όνομα είναι υποχρεωτικό.' }),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος']),
  polygonPoints: z.string().optional(), // Storing as JSON string from textarea
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface Floor {
  id: string;
  level: string;
  description?: string;
  buildingId: string;
  originalId: string; // The ID in the subcollection
  createdAt: Timestamp;
  floorPlanUrl?: string;
}

interface Unit extends Omit<UnitFormValues, 'polygonPoints'> {
  id: string;
  createdAt: any;
  polygonPoints?: { x: number; y: number }[];
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
}

export default function FloorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const floorId = params.id as string;

  const [floor, setFloor] = useState<Floor | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoadingFloor, setIsLoadingFloor] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');


  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      identifier: '',
      name: '',
      type: '',
      status: 'Διαθέσιμο',
      polygonPoints: '',
    },
  });

  // Fetch floor details from top-level collection
  useEffect(() => {
    if (!floorId) return;
    const fetchFloorData = async () => {
      const docRef = doc(db, 'floors', floorId);
      setIsLoadingFloor(true);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const floorData = { id: docSnap.id, ...docSnap.data() } as Floor;
        setFloor(floorData);
        setFloorPlanUrl(floorData.floorPlanUrl || null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Σφάλμα',
          description: 'Ο όροφος δεν βρέθηκε.',
        });
        router.push('/buildings'); // Redirect if floor not found
      }
      setIsLoadingFloor(false);
    };
    fetchFloorData();
  }, [floorId, router, toast]);

  // Listen for units in the subcollection
  useEffect(() => {
    if (!floor || !floor.buildingId || !floor.originalId) return;
    
    const findUnits = async () => {
        try {
            const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
            if (!buildingDoc.exists() || !buildingDoc.data()?.projectId || !buildingDoc.data()?.originalId) {
                setIsLoadingUnits(false);
                toast({
                    variant: 'default',
                    title: 'Ενημέρωση',
                    description: 'Αυτό το κτίριο δεν ανήκει σε έργο. Τα ακίνητα δεν είναι διαθέσιμα.',
                });
                return;
            }

            const projectId = buildingDoc.data().projectId;
            const originalBuildingId = buildingDoc.data().originalId;

            const unitsColRef = collection(db, 'projects', projectId, 'buildings', originalBuildingId, 'floors', floor.originalId, 'units');
            
            const unsubscribe = onSnapshot(
              unitsColRef,
              (snapshot) => {
                const unitsData: Unit[] = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                } as Unit));
                setUnits(unitsData);
                setIsLoadingUnits(false);
              },
              (error) => {
                console.error('Error fetching units: ', error);
                toast({
                  variant: 'destructive',
                  title: 'Σφάλμα',
                  description: 'Δεν ήταν δυνατή η φόρτωση των ακινήτων.',
                });
                setIsLoadingUnits(false);
              }
            );
            return unsubscribe;
        } catch (error) {
            console.error("Error setting up unit listener:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η παρακολούθηση των ακινήτων.' });
            setIsLoadingUnits(false);
        }
    }
    
    let unsubscribePromise = findUnits();

    return () => {
        unsubscribePromise.then(unsubscribe => {
            if (unsubscribe) {
                unsubscribe();
            }
        });
    };
  }, [floor, toast]);
  
  const onSubmitUnit = async (data: UnitFormValues) => {
     if (!floor || !floor.buildingId || !floor.originalId) return;

     setIsSubmitting(true);
     
     let parsedPolygonPoints: {x: number, y: number}[] | undefined;
     if (data.polygonPoints) {
       try {
         const pointsArray = JSON.parse(data.polygonPoints);
         if (Array.isArray(pointsArray) && pointsArray.every(p => Array.isArray(p) && p.length === 2 && typeof p[0] === 'number' && typeof p[1] === 'number')) {
           parsedPolygonPoints = pointsArray.map(p => ({ x: p[0], y: p[1]}));
         } else {
            throw new Error('Invalid format');
         }
       } catch (e) {
         toast({
           variant: 'destructive',
           title: 'Σφάλμα στις συντεταγμένες',
           description: 'Οι συντεταγμένες πολυγώνου δεν είναι έγκυρο JSON. π.χ. [[10,10], [100,10]]'
         });
         setIsSubmitting(false);
         return;
       }
     }

     const unitData = {
       identifier: data.identifier,
       name: data.name,
       type: data.type,
       status: data.status,
       ...(parsedPolygonPoints && { polygonPoints: parsedPolygonPoints }),
     };

     try {
       const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
       if (!buildingDoc.exists() || !buildingDoc.data()?.projectId || !buildingDoc.data()?.originalId) {
           throw new Error("Building or project ID not found for unit creation");
       }
       const projectId = buildingDoc.data().projectId;
       const originalBuildingId = buildingDoc.data().originalId;
       
       const unitSubRef = doc(collection(db, 'projects', projectId, 'buildings', originalBuildingId, 'floors', floor.originalId, 'units'));

       await setDoc(unitSubRef, {
         ...unitData,
         createdAt: serverTimestamp(),
       });

       await setDoc(doc(db, 'units', unitSubRef.id), {
          ...unitData,
          originalId: unitSubRef.id,
          buildingId: floor.buildingId,
          floorId: floor.id,
          createdAt: serverTimestamp(),
       });
       

       toast({
         title: 'Επιτυχία',
         description: 'Το ακίνητο προστέθηκε με επιτυχία.',
       });
       form.reset();
       setIsDialogOpen(false);
     } catch (error) {
       console.error('Error adding unit: ', error);
       toast({
         variant: 'destructive',
         title: 'Σφάλμα',
         description: 'Δεν ήταν δυνατή η προσθήκη του ακινήτου.',
       });
     } finally {
       setIsSubmitting(false);
     }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!auth.currentUser) {
        toast({
            variant: 'destructive',
            title: 'Σφάλμα Αυθεντικοποίησης',
            description: 'Πρέπει να είστε συνδεδεμένοι για να ανεβάσετε αρχεία.',
        });
        return;
    }
    
    if (!selectedFile || !floor) return;

    setIsUploading(true);
    const filePath = `floor-plans/${floor.id}/${selectedFile.name}`;
    const fileRef = ref(storage, filePath);

    try {
      const metadata = {
        contentType: selectedFile.type,
      };
      await uploadBytes(fileRef, selectedFile, metadata);
      const url = await getDownloadURL(fileRef);
      console.log('File available at', url);

      const floorDocRef = doc(db, 'floors', floor.id);
      await updateDoc(floorDocRef, { floorPlanUrl: url });

      try {
        const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
        const { projectId, originalId: buildingOriginalId } = buildingDoc.data() || {};
        if (projectId && buildingOriginalId && floor.originalId) {
          const floorSubDocRef = doc(db, 'projects', projectId, 'buildings', buildingOriginalId, 'floors', floor.originalId);
          await updateDoc(floorSubDocRef, { floorPlanUrl: url }).catch(e => console.warn("Could not update subcollection floor plan URL, may not exist:", e));
        }
      } catch (subError) {
        console.warn("Could not find/update floor plan URL in subcollection:", subError);
      }

      setFloorPlanUrl(url);
      setSelectedFile(null);
      toast({
        title: 'Επιτυχία',
        description: 'Η κάτοψη ανέβηκε με επιτυχία.',
      });
    } catch (error) {
      console.error("Error uploading file: ", error);
      toast({
        variant: 'destructive',
        title: 'Σφάλμα Μεταφόρτωσης',
        description: 'Δεν ήταν δυνατή η μεταφόρτωση του αρχείου. Ελέγξτε τις ρυθμίσεις CORS και τους κανόνες ασφαλείας του Storage.',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRowClick = (unitId: string) => {
    const unitDoc = units.find(u => u.id === unitId);
    if(unitDoc){
      router.push(`/units/${unitDoc.id}`);
    }
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };

  const getStatusClass = (status: Unit['status'] | undefined) => {
      switch(status) {
          case 'Πωλημένο': return 'bg-red-500 hover:bg-red-600 text-white';
          case 'Κρατημένο': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
          case 'Διαθέσιμο': return 'bg-green-500 hover:bg-green-600 text-white';
          case 'Οικοπεδούχος': return 'bg-orange-500 hover:bg-orange-600 text-white';
          default: return 'bg-gray-500 hover:bg-gray-600 text-white';
      }
  }
  
  const uniqueUnitTypes = useMemo(() => {
    const types = new Set(units.map(u => u.type).filter(Boolean));
    return Array.from(types) as string[];
  }, [units]);

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const statusMatch = statusFilter === 'all' || unit.status === statusFilter;
      const typeMatch = typeFilter === 'all' || unit.type === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [units, statusFilter, typeFilter]);


  if (isLoadingFloor) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!floor) {
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
            <CardTitle>Όροφος: {floor.level}</CardTitle>
            <CardDescription>
                Περιγραφή: {floor.description || 'N/A'} | ID Κτιρίου: {floor.buildingId}
            </CardDescription>
            </CardHeader>
        </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>Κάτοψη Ορόφου & Ακίνητα</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              {isLoadingUnits ? (
                 <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-muted-foreground" /></div>
              ) : floorPlanUrl ? (
                <>
                    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                           <Filter className="h-5 w-5 text-muted-foreground"/>
                           <h3 className="text-md font-semibold">Φίλτρα</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                            <FormItem>
                                <FormLabel>Κατάσταση</FormLabel>
                                <Select onValueChange={setStatusFilter} value={statusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Επιλογή κατάστασης..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Όλα</SelectItem>
                                        <SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem>
                                        <SelectItem value="Κρατημένο">Κρατημένο</SelectItem>
                                        <SelectItem value="Πωλημένο">Πωλημένο</SelectItem>
                                        <SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                             <FormItem>
                                <FormLabel>Τύπος Ακινήτου</FormLabel>
                                <Select onValueChange={setTypeFilter} value={typeFilter} disabled={uniqueUnitTypes.length === 0}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Επιλογή τύπου..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Όλοι</SelectItem>
                                        {uniqueUnitTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        </div>
                    </div>
                    <FloorPlanViewer pdfUrl={floorPlanUrl} units={filteredUnits} onUnitClick={(unitId) => handleRowClick(unitId)} />
                </>
              ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Δεν έχει ανεβεί κάτοψη για αυτόν τον όροφο.</p>
              )}
               <div className="space-y-2 pt-4">
                   <FormLabel htmlFor="floor-plan-upload">Ανέβασμα νέας/ανανεωμένης κάτοψης (PDF)</FormLabel>
                   <div className="flex items-center gap-2">
                      <Input id="floor-plan-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="max-w-xs"/>
                      <Button onClick={handleFileUpload} disabled={!selectedFile || isUploading}>
                          {isUploading ? <Loader2 className="mr-2 animate-spin" /> : <UploadCloud className="mr-2" />}
                          Ανέβασμα
                      </Button>
                   </div>
                   {selectedFile && <p className="text-sm text-muted-foreground">Επιλεγμένο αρχείο: {selectedFile.name}</p>}
               </div>
          </CardContent>
      </Card>


      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Λίστα Ακινήτων του Ορόφου
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Νέο Ακίνητο
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Προσθήκη Νέου Ακινήτου</DialogTitle>
              <DialogDescription>
                Συμπληρώστε τις πληροφορίες για να προσθέσετε ένα νέο ακίνητο (unit) στον όροφο.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitUnit)} className="grid gap-4 py-4">
                 <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Κωδικός</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. A1, B2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Όνομα/Αναγνωριστικό Ακινήτου</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. Διαμέρισμα, Κατάστημα" {...field} />
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
                      <FormLabel>Τύπος (Προαιρετικό)</FormLabel>
                      <FormControl>
                        <Input placeholder="π.χ. Γκαρσονιέρα" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Κατάσταση</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Επιλέξτε κατάσταση" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem>
                          <SelectItem value="Κρατημένο">Κρατημένο</SelectItem>
                          <SelectItem value="Πωλημένο">Πωλημένο</SelectItem>
                          <SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="polygonPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Συντεταγμένες Πολυγώνου (JSON)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='π.χ. [[10,10], [100,10], [100,100], [10,100]]' {...field} />
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
                    Προσθήκη Ακινήτου
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoadingUnits ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : units.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Κωδικός</TableHead>
                  <TableHead>Όνομα/ID</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Κατάσταση</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id} onClick={() => handleRowClick(unit.id)} className="cursor-pointer">
                    <TableCell className="font-medium">{unit.identifier}</TableCell>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell className="text-muted-foreground">{unit.type || 'N/A'}</TableCell>
                    <TableCell>
                        <Badge 
                            variant="default"
                            className={getStatusClass(unit.status)}>
                            {unit.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{formatDate(unit.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν ακίνητα για αυτόν τον όροφο.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
