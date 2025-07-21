
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
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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
import { ArrowLeft, PlusCircle, Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { FloorPlanViewer } from '@/components/floor-plan-viewer';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const unitSchema = z.object({
  identifier: z.string().min(1, { message: 'Ο κωδικός είναι υποχρεωτικός.' }),
  name: z.string().min(1, { message: 'Το όνομα είναι υποχρεωτικό.' }),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο']),
  polygonPoints: z.string().optional(), // Storing as JSON string from textarea
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface Floor {
  id: string;
  level: string;
  description?: string;
  buildingId: string;
  createdAt: Timestamp;
  floorPlanUrl?: string;
}

interface Unit extends Omit<UnitFormValues, 'polygonPoints'> {
  id: string;
  createdAt: any;
  polygonPoints?: { x: number; y: number }[];
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
        router.push('/floors');
      }
      setIsLoadingFloor(false);
    };
    fetchFloorData();
  }, [floorId, router, toast]);

  // Listen for units in the subcollection
  useEffect(() => {
    if (!floor || !floor.buildingId) return;
    const { buildingId, originalId } = floor as any; // originalId is the id in the subcollection
    const unitsColRef = collection(db, 'buildings', buildingId, 'floors', originalId, 'units');
    
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

    return () => unsubscribe();
  }, [floor, toast]);
  
  const onSubmitUnit = async (data: UnitFormValues) => {
     if (!floor || !floor.buildingId) return;
     const { buildingId, id: floorId, originalId } = floor as any;
     setIsSubmitting(true);
     
     let parsedPolygonPoints: {x: number, y: number}[] | undefined;
     if (data.polygonPoints) {
       try {
         const pointsArray = JSON.parse(data.polygonPoints);
         if (Array.isArray(pointsArray)) {
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
       // Add to subcollection
       const unitSubRef = await addDoc(collection(db, 'buildings', buildingId, 'floors', originalId, 'units'), {
         ...unitData,
         buildingId: buildingId,
         floorId: floorId, // Storing the top-level floor ID
         createdAt: serverTimestamp(),
       });

       // Also add to a top-level 'units' collection for the main /units page
       await addDoc(collection(db, 'units'), {
          ...unitData,
          originalId: unitSubRef.id,
          buildingId: buildingId,
          floorId: floorId,
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
    if (!selectedFile || !floor) return;

    setIsUploading(true);
    const filePath = `buildings/${floor.buildingId}/floors/${(floor as any).originalId}/floorPlan.pdf`;
    const fileRef = ref(storage, filePath);

    try {
      await uploadBytes(fileRef, selectedFile);
      const url = await getDownloadURL(fileRef);

      // Save URL to Firestore
      const floorDocRef = doc(db, 'floors', floor.id);
      await updateDoc(floorDocRef, { floorPlanUrl: url });

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
        title: 'Σφάλμα',
        description: 'Δεν ήταν δυνατή η μεταφόρτωση του αρχείου.',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRowClick = (unitId: string) => {
    router.push(`/units/${unitId}`);
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };

  const getStatusVariant = (status: Unit['status'] | undefined): 'default' | 'secondary' | 'outline' => {
      switch(status) {
          case 'Πωλημένο': return 'destructive';
          case 'Κρατημένο': return 'secondary';
          case 'Διαθέσιμο': return 'default';
          default: return 'outline';
      }
  }


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
                <FloorPlanViewer pdfUrl={floorPlanUrl} units={units} onUnitClick={(unitId) => handleRowClick(unitId)} />
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
                        <Badge variant={getStatusVariant(unit.status)} 
                                className={unit.status === 'Διαθέσιμο' ? 'bg-green-500 hover:bg-green-600' : 
                                           unit.status === 'Κρατημένο' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                           unit.status === 'Πωλημένο' ? 'bg-red-500 hover:bg-red-600' : ''}>
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
