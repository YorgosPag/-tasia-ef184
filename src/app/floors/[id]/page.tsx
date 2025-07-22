
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
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
import { ArrowLeft, PlusCircle, Loader2, Upload, FileText, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FloorPlanViewer } from '@/components/floor-plan-viewer';

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
  originalId: string;
  floorId: string;
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
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();

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

  // Effect to populate form when editingUnit changes
  useEffect(() => {
    if (editingUnit) {
      form.reset({
        identifier: editingUnit.identifier,
        name: editingUnit.name,
        type: editingUnit.type || '',
        status: editingUnit.status,
        polygonPoints: editingUnit.polygonPoints ? JSON.stringify(editingUnit.polygonPoints, null, 2) : '',
      });
    } else {
      form.reset({
        identifier: '',
        name: '',
        type: '',
        status: 'Διαθέσιμο',
        polygonPoints: form.getValues('polygonPoints') || '', // Keep polygon points if drawn for new unit
      });
    }
  }, [editingUnit, form]);


  // Fetch floor details from top-level collection
  useEffect(() => {
    if (!floorId) return;
    const docRef = doc(db, 'floors', floorId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const floorData = { id: docSnap.id, ...docSnap.data() } as Floor;
            setFloor(floorData);
        } else {
            toast({
                variant: 'destructive',
                title: 'Σφάλμα',
                description: 'Ο όροφος δεν βρέθηκε.',
            });
            router.push('/buildings');
        }
        setIsLoadingFloor(false);
    }, (error) => {
        console.error("Error fetching floor:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch floor details.'});
        setIsLoadingFloor(false);
    });

    return () => unsubscribe();
  }, [floorId, router, toast]);

  // Listen for units in the top-level collection that belong to this floor
  useEffect(() => {
    if (!floorId) return;
    
    setIsLoadingUnits(true);
    const q = query(collection(db, 'units'), where('floorId', '==', floorId));

    const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            const unitsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Unit));
            setUnits(unitsData);
            setIsLoadingUnits(false);
        },
        (error) => {
            console.error('Error fetching units in real-time: ', error);
            toast({
                variant: 'destructive',
                title: 'Σφάλμα',
                description: 'Δεν ήταν δυνατή η φόρτωση των ακινήτων σε πραγματικό χρόνο.',
            });
            setIsLoadingUnits(false);
        }
    );

    return () => unsubscribe();
  }, [floorId, toast]);
  
  const getUnitDataForSave = (data: UnitFormValues) => {
    let parsedPolygonPoints: {x: number, y: number}[] | undefined;
     if (data.polygonPoints && data.polygonPoints.trim() !== '') {
       try {
         const pointsArray = JSON.parse(data.polygonPoints);
         if (Array.isArray(pointsArray) && pointsArray.every(p => typeof p.x === 'number' && typeof p.y === 'number')) {
            parsedPolygonPoints = pointsArray;
         } else {
            throw new Error('Invalid points format. Expected an array of {x, y} objects.');
         }
       } catch (e) {
         toast({
           variant: 'destructive',
           title: 'Σφάλμα στις συντεταγμένες',
           description: 'Οι συντεταγμένες πολυγώνου δεν είναι έγκυρο JSON. π.χ. [{"x":10,"y":10}, ...]'
         });
         return null;
       }
     }
     return {
       identifier: data.identifier,
       name: data.name,
       type: data.type,
       status: data.status,
       ...(parsedPolygonPoints && { polygonPoints: parsedPolygonPoints }),
     };
  }

  const handleCreateUnit = async (data: UnitFormValues) => {
    if (!floor || !floor.buildingId || !floor.originalId) return;

     const unitData = getUnitDataForSave(data);
     if (!unitData) {
       setIsSubmitting(false);
       return;
     }

     try {
       const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
       if (!buildingDoc.exists()) {
           throw new Error("Parent building not found");
       }
       const buildingData = buildingDoc.data();
       
       const topLevelUnitRef = doc(collection(db, 'units'));
       let subCollectionUnitRef;
       
       // Dual write only if the building is part of a project
       if (buildingData.projectId && buildingData.originalId) {
            subCollectionUnitRef = doc(collection(db, 'projects', buildingData.projectId, 'buildings', buildingData.originalId, 'floors', floor.originalId, 'units'));
            await setDoc(subCollectionUnitRef, { ...unitData, createdAt: serverTimestamp() });
       }
       
       await setDoc(topLevelUnitRef, {
          ...unitData,
          originalId: subCollectionUnitRef ? subCollectionUnitRef.id : topLevelUnitRef.id,
          buildingId: floor.buildingId,
          floorId: floor.id,
          createdAt: serverTimestamp(),
       });
       
       toast({ title: 'Επιτυχία', description: 'Το ακίνητο προστέθηκε με επιτυχία.' });
     } catch(error) {
       console.error('Error adding unit: ', error);
       toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η προσθήκη του ακινήτου.' });
     }
  }

  const handleUpdateUnit = async (data: UnitFormValues) => {
    if (!editingUnit || !floor) return;

    const unitDataToSave = getUnitDataForSave(data);
    if (!unitDataToSave) {
       setIsSubmitting(false);
       return;
    }

    try {
        const buildingDoc = await getDoc(doc(db, 'buildings', floor.buildingId));
        if (!buildingDoc.exists()) {
            throw new Error("Parent building not found for unit update");
        }
        const buildingData = buildingDoc.data();
        
        // Update top-level document first
        const unitTopRef = doc(db, 'units', editingUnit.id);
        await updateDoc(unitTopRef, unitDataToSave);
        
        // Update sub-collection document only if it exists (part of a project)
        if (buildingData.projectId && buildingData.originalId && editingUnit.originalId) {
            const unitSubRef = doc(db, 'projects', buildingData.projectId, 'buildings', buildingData.originalId, 'floors', floor.originalId, 'units', editingUnit.originalId);
            // Check if sub-doc exists before updating to prevent errors
            const subDocSnap = await getDoc(unitSubRef);
            if(subDocSnap.exists()) {
                await updateDoc(unitSubRef, unitDataToSave);
            }
        }

        toast({ title: 'Επιτυχία', description: 'Το ακίνητο ενημερώθηκε.' });
    } catch(error) {
        console.error('Error updating unit: ', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η ενημέρωση του ακινήτου.' });
    }
  }

  const onSubmitUnit = async (data: UnitFormValues) => {
     setIsSubmitting(true);
     if (editingUnit) {
        await handleUpdateUnit(data);
     } else {
        await handleCreateUnit(data);
     }
     setIsSubmitting(false);
     handleDialogOpenChange(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        toast({ variant: 'destructive', title: 'Λάθος τύπος αρχείου', description: 'Παρακαλώ επιλέξτε ένα αρχείο PDF.' });
        setSelectedFile(null);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    if (!floorId) return;
    if (!auth.currentUser) return;
  
    setIsUploading(true);
    const storageRef = ref(storage, `floor_plans/${floorId}/${selectedFile.name}`);
  
    try {
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      const floorDocRef = doc(db, 'floors', floorId);
      await updateDoc(floorDocRef, { floorPlanUrl: downloadURL });
      toast({ title: 'Επιτυχία', description: 'Η κάτοψη ανέβηκε με επιτυχία.' });
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ variant: 'destructive', title: 'Σφάλμα Ανεβάσματος', description: `Δεν ήταν δυνατή η μεταφόρτωση του αρχείου: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleUnitSelectForEdit = (unitId: string) => {
    // We need to find the full unit data, which is in the `units` state.
    // The units in the floor plan viewer might be a subset.
    const unitToEdit = units.find(u => u.id === unitId);
    if(unitToEdit){
      setEditingUnit(unitToEdit);
      setIsDialogOpen(true);
    } else {
      console.warn(`Unit with ID ${unitId} not found in the main units list.`);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκαν οι πλήρεις πληροφορίες του ακινήτου.' });
    }
  };
  
  const handlePolygonDrawn = (points: {x: number, y: number}[]) => {
      const pointsJson = JSON.stringify(points, null, 2);
      form.setValue('polygonPoints', pointsJson);
      setEditingUnit(null); // Ensure we are in "create" mode
      setIsDialogOpen(true);
  }

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
  
  const handleDialogOpenChange = (open: boolean) => {
      setIsDialogOpen(open);
      if(!open) {
          form.reset({
              identifier: '',
              name: '',
              type: '',
              status: 'Διαθέσιμο',
              polygonPoints: '',
          });
          setEditingUnit(null);
      }
  }

  if (isLoadingFloor) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }
  if (!floor) return null;

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
          <CardHeader><CardTitle>Κάτοψη Ορόφου</CardTitle></CardHeader>
          <CardContent className="space-y-4">
              {floor.floorPlanUrl ? (
                  <FloorPlanViewer 
                    pdfUrl={floor.floorPlanUrl} 
                    units={units} 
                    onUnitClick={handleUnitSelectForEdit}
                    onPolygonDrawn={handlePolygonDrawn}
                  />
              ) : (
                  <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">Δεν έχει ανέβει κάτοψη για αυτόν τον όροφο.</p>
                  </div>
              )}
               <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <Input id="pdf-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="max-w-xs" />
                  <Button onClick={handleFileUpload} disabled={!selectedFile || isUploading}>
                      {isUploading ? <Loader2 className="mr-2 animate-spin" /> : <Upload className="mr-2" />}
                      {isUploading ? 'Ανέβασμα...' : 'Ανέβασμα Κάτοψης'}
                  </Button>
               </div>
               {selectedFile && <p className="text-sm text-muted-foreground flex items-center gap-2"><FileText size={16} />Επιλεγμένο αρχείο: {selectedFile.name}</p>}
          </CardContent>
      </Card>


      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Λίστα Ακινήτων του Ορόφου</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUnit(null)}><PlusCircle className="mr-2" />Νέο Ακίνητο</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingUnit ? 'Επεξεργασία Ακινήτου' : 'Προσθήκη Νέου Ακινήτου'}</DialogTitle>
              <DialogDescription>
                {editingUnit ? 'Ενημερώστε τις πληροφορίες του ακινήτου.' : 'Συμπληρώστε τις πληροφορίες για να προσθέσετε ένα νέο ακίνητο (unit) στον όροφο.'}
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
                      <FormControl><Input placeholder="π.χ. A1, B2" {...field} /></FormControl>
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
                      <FormControl><Input placeholder="π.χ. Διαμέρισμα, Κατάστημα" {...field} /></FormControl>
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
                      <FormControl><Input placeholder="π.χ. Γκαρσονιέρα" {...field} /></FormControl>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε κατάσταση" /></SelectTrigger></FormControl>
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
                        <Textarea placeholder='Σχεδιάστε στην κάτοψη ή επικολλήστε εδώ: [{"x": 10, "y": 10}, ...]' {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                   <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingUnit ? 'Αποθήκευση Αλλαγών' : 'Προσθήκη Ακινήτου'}
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
            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : units.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Κωδικός</TableHead>
                  <TableHead>Όνομα/ID</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Κατάσταση</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => (
                  <TableRow key={unit.id} className="group">
                    <TableCell className="font-medium">{unit.identifier}</TableCell>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell className="text-muted-foreground">{unit.type || 'N/A'}</TableCell>
                    <TableCell>
                        <Badge variant="default" className={getStatusClass(unit.status)}>{unit.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(unit.createdAt)}</TableCell>
                    <TableCell className="text-right">
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleUnitSelectForEdit(unit.id)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Επεξεργασία</span>
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => router.push(`/units/${unit.id}`)}>Προβολή</Button>
                       </div>
                    </TableCell>
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
