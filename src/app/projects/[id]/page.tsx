
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
  orderBy,
  query,
  getDocs,
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
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, PlusCircle, Loader2, Edit, Trash2, Copy, CalendarIcon, GitMerge } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import Image from 'next/image';
import { logActivity } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { Company, useDataStore } from '@/hooks/use-data-store';


// Schema for the building form
const buildingSchema = z.object({
  id: z.string().optional(), // Hidden field to know if we are editing
  address: z.string().min(1, { message: 'Η διεύθυνση είναι υποχρεωτική.' }),
  type: z.string().min(1, { message: 'Ο τύπος είναι υποχρεωτικός.' }),
  description: z.string().optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')),
  floorsCount: z.coerce.number().int().positive().optional(),
  constructionYear: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
  tags: z.string().optional(),
});

type BuildingFormValues = z.infer<typeof buildingSchema>;

// Schema for the phase form
const phaseSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό.'),
    description: z.string().optional(),
    status: z.enum(['Εκκρεμεί', 'Σε εξέλιξη', 'Ολοκληρώθηκε', 'Καθυστερεί']),
    assignedTo: z.string().optional(),
    notes: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    deadline: z.date().optional(),
    documents: z.string().optional(), // URLs separated by comma
});

type PhaseFormValues = z.infer<typeof phaseSchema>;


interface Project {
  id: string;
  title: string;
  companyId: string;
  location?: string;
  description?: string;
  deadline: Timestamp;
  status: string;
  photoUrl?: string;
  tags?: string[];
}

interface Building {
  id: string; // This will be the ID from the subcollection
  address: string;
  type: string;
  photoUrl?: string;
  createdAt: any;
  topLevelId: string; // This will be the ID from the top-level collection
}

interface Phase extends Omit<PhaseFormValues, 'startDate' | 'endDate' | 'deadline' | 'documents' > {
  id: string;
  createdAt: Timestamp;
  startDate?: Timestamp;
  endDate?: Timestamp;
  deadline?: Timestamp;
  documents?: string[];
  assignedTo?: string; // Storing company ID now
}

interface PhaseWithSubphases extends Phase {
    subphases: Phase[];
}


export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [phases, setPhases] = useState<PhaseWithSubphases[]>([]);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);
  const [isLoadingPhases, setIsLoadingPhases] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhaseDialogOpen, setIsPhaseDialogOpen] = useState(false);
  const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null);
  const [editingPhase, setEditingPhase] = useState<Phase | { parentId: string } | null>(null);

  const { toast } = useToast();
  const { companies, isLoading: isLoadingCompanies } = useDataStore();

  const buildingForm = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      id: undefined, address: '', type: '', description: '', photoUrl: '',
      floorsCount: undefined, constructionYear: undefined, tags: '',
    },
  });

  const phaseForm = useForm<PhaseFormValues>({
    resolver: zodResolver(phaseSchema),
    defaultValues: {
        id: undefined, name: '', status: 'Εκκρεμεί', assignedTo: '', notes: '',
        startDate: undefined, endDate: undefined, deadline: undefined,
        documents: '', description: '',
    }
  });


  // --- DIALOG HANDLERS ---
  const handleBuildingDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      buildingForm.reset();
      setEditingBuildingId(null);
    }
  };

  const handlePhaseDialogOpenChange = (open: boolean) => {
    setIsPhaseDialogOpen(open);
    if(!open) {
        phaseForm.reset();
        setEditingPhase(null);
    }
  };


  // --- DATA FETCHING ---
  useEffect(() => {
    if (!projectId) return;
    const docRef = doc(db, 'projects', projectId);
    const unsubscribe = onSnapshot(docRef,
      (docSnap) => {
        setIsLoadingProject(true);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Το έργο δεν βρέθηκε.' });
          router.push('/projects');
        }
        setIsLoadingProject(false);
      },
      (error) => {
        console.error("Error fetching project:", error);
        setIsLoadingProject(false);
      }
    );
    return () => unsubscribe();
  }, [projectId, router, toast]);

  useEffect(() => {
    if (!projectId) return;
    const subcollectionRef = collection(db, 'projects', projectId, 'buildings');
    const unsubscribe = onSnapshot(subcollectionRef,
      (snapshot) => {
        setBuildings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Building)));
        setIsLoadingBuildings(false);
      },
      (error) => {
        console.error('Error fetching buildings: ', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των κτιρίων.' });
        setIsLoadingBuildings(false);
      }
    );
    return () => unsubscribe();
  }, [projectId, toast]);

    useEffect(() => {
        if (!projectId) return;
        const phasesQuery = query(collection(db, 'projects', projectId, 'phases'), orderBy('createdAt', 'asc'));
        
        const unsubscribe = onSnapshot(phasesQuery, async (phasesSnapshot) => {
            const phasesDataPromises = phasesSnapshot.docs.map(async (phaseDoc) => {
                const phase = { id: phaseDoc.id, ...phaseDoc.data() } as Phase;
                
                const subphasesQuery = query(collection(db, 'projects', projectId, 'phases', phase.id, 'subphases'), orderBy('createdAt', 'asc'));
                const subphasesSnapshot = await getDocs(subphasesQuery);
                const subphases = subphasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Phase));

                return { ...phase, subphases };
            });

            const phasesWithSubphases = await Promise.all(phasesDataPromises);
            setPhases(phasesWithSubphases);
            setIsLoadingPhases(false);
        },
        (error) => {
            console.error("Error fetching phases:", error);
            setIsLoadingPhases(false);
        });

        return () => unsubscribe();
    }, [projectId]);


  // --- SUBMISSION LOGIC ---
  const onSubmitBuilding = async (data: BuildingFormValues) => {
    setIsSubmitting(true);
    const finalData = {
        address: data.address, type: data.type, description: data.description || '',
        photoUrl: data.photoUrl?.trim() || undefined, floorsCount: data.floorsCount || undefined,
        constructionYear: data.constructionYear || undefined,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    }

    try {
        if (editingBuildingId) {
            const buildingToUpdate = buildings.find(b => b.id === editingBuildingId);
            if (!buildingToUpdate) throw new Error("Building not found for update");
            const batch = writeBatch(db);
            batch.update(doc(db, 'buildings', buildingToUpdate.topLevelId), finalData);
            batch.update(doc(db, 'projects', projectId, 'buildings', buildingToUpdate.id), finalData);
            await batch.commit();
            toast({ title: 'Επιτυχία', description: 'Το κτίριο ενημερώθηκε.' });
        } else {
            const batch = writeBatch(db);
            const topLevelRef = doc(collection(db, 'buildings'));
            const subCollectionRef = doc(collection(db, 'projects', projectId, 'buildings'));
            batch.set(topLevelRef, { ...finalData, projectId, originalId: subCollectionRef.id, createdAt: serverTimestamp() });
            batch.set(subCollectionRef, { ...finalData, topLevelId: topLevelRef.id, createdAt: serverTimestamp() });
            await batch.commit();
            toast({ title: 'Επιτυχία', description: 'Το κτίριο προστέθηκε.' });
        }
        handleBuildingDialogOpenChange(false);
    } catch (error) {
        console.error('Error submitting building: ', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η υποβολή.' });
    } finally {
        setIsSubmitting(false);
    }
  };

    const onSubmitPhase = async (data: PhaseFormValues) => {
        if (!projectId) return;
        setIsSubmitting(true);

        const finalData = {
            name: data.name, description: data.description || '', status: data.status,
            assignedTo: data.assignedTo || undefined, // Store Company ID
            notes: data.notes || '', startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
            endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
            deadline: data.deadline ? Timestamp.fromDate(data.deadline) : null,
            documents: data.documents ? data.documents.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
        
        try {
            const isSubphase = editingPhase && 'parentId' in editingPhase;
            const isEditing = editingPhase && 'id' in editingPhase;

            if (isEditing) {
                const parentId = (editingPhase as any).parentId;
                const phaseId = (editingPhase as Phase).id;
                const docRef = parentId
                    ? doc(db, 'projects', projectId, 'phases', parentId, 'subphases', phaseId)
                    : doc(db, 'projects', projectId, 'phases', phaseId);
                await updateDoc(docRef, finalData);
                toast({ title: 'Επιτυχία', description: 'Η εγγραφή ενημερώθηκε.' });
                await logActivity(isSubphase ? 'UPDATE_SUBPHASE' : 'UPDATE_PHASE', {
                    entityId: phaseId,
                    entityType: isSubphase ? 'subphase' : 'phase',
                    changes: finalData,
                });

            } else {
                 const parentId = isSubphase ? (editingPhase as { parentId: string }).parentId : null;
                 const collectionPath = parentId
                    ? collection(db, 'projects', projectId, 'phases', parentId, 'subphases')
                    : collection(db, 'projects', projectId, 'phases');
                const newDocRef = await addDoc(collectionPath, { ...finalData, createdAt: serverTimestamp() });
                toast({ title: 'Επιτυχία', description: `Η ${isSubphase ? 'υποφάση' : 'φάση'} προστέθηκε.` });
                await logActivity(isSubphase ? 'CREATE_SUBPHASE' : 'CREATE_PHASE', {
                    entityId: newDocRef.id,
                    entityType: isSubphase ? 'subphase' : 'phase',
                    details: finalData,
                });
            }
            handlePhaseDialogOpenChange(false);
        } catch (error) {
            console.error("Error submitting phase/subphase:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η υποβολή απέτυχε.' });
        } finally {
            setIsSubmitting(false);
        }
    }


  // --- DELETE & DUPLICATE LOGIC ---
   const handleDeleteBuilding = async (buildingId: string) => {
    const buildingToDelete = buildings.find(b => b.id === buildingId);
    if (!buildingToDelete) return;
    try {
        const batch = writeBatch(db);
        batch.delete(doc(db, 'buildings', buildingToDelete.topLevelId));
        batch.delete(doc(db, 'projects', projectId, 'buildings', buildingToDelete.id));
        await batch.commit();
        toast({ title: "Επιτυχία", description: "Το κτίριο διαγράφηκε." });
    } catch (error) {
        console.error("Error deleting building:", error);
        toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν ήταν δυνατή η διαγραφή του κτιρίου." });
    }
  };
  
  const handleDeletePhase = async (phase: Phase, parentId?: string) => {
    if (!projectId) return;
    try {
      const docPath = parentId
        ? doc(db, 'projects', projectId, 'phases', parentId, 'subphases', phase.id)
        : doc(db, 'projects', projectId, 'phases', phase.id);
      await deleteDoc(docPath);
      toast({ title: 'Επιτυχία', description: 'Η εγγραφή διαγράφηκε.' });
      await logActivity(parentId ? 'DELETE_SUBPHASE' : 'DELETE_PHASE', {
        entityId: phase.id,
        entityType: parentId ? 'subphase' : 'phase',
        details: { name: phase.name, parentId: parentId },
      });
    } catch (error) {
      console.error("Error deleting phase/subphase:", error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η διαγραφή απέτυχε.' });
    }
  }


  // --- FORM PREP & UI HANDLERS ---
  const handleEditBuilding = (building: Building) => {
    const docRef = doc(db, 'buildings', building.topLevelId);
    getDoc(docRef).then(docSnap => {
        if(docSnap.exists()){
            const data = docSnap.data();
            buildingForm.reset({
                id: building.id, address: data.address, type: data.type,
                description: data.description || '', photoUrl: data.photoUrl || '',
                floorsCount: data.floorsCount || undefined, constructionYear: data.constructionYear || undefined,
                tags: (data.tags || []).join(', '),
            });
            setEditingBuildingId(building.id);
            setIsDialogOpen(true);
        }
    })
  };

    const handleEditPhase = (phase: Phase, parentId?: string) => {
        setEditingPhase(parentId ? { ...phase, parentId } : phase);
        phaseForm.reset({
            ...phase,
            assignedTo: phase.assignedTo,
            documents: phase.documents?.join(', '),
            startDate: phase.startDate?.toDate(),
            endDate: phase.endDate?.toDate(),
            deadline: phase.deadline?.toDate(),
        });
        setIsPhaseDialogOpen(true);
    }
    
    const handleAddSubphase = (parentId: string) => {
        setEditingPhase({ parentId });
        phaseForm.reset({ status: 'Εκκρεμεί' });
        setIsPhaseDialogOpen(true);
    };


  const formatDate = (timestamp?: Timestamp | Date) => {
    if (!timestamp) return '-';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return format(date, 'dd/MM/yyyy');
  };
  
  const getStatusVariant = (status: Phase['status']) => {
    switch (status) {
      case 'Ολοκληρώθηκε': return 'default';
      case 'Σε εξέλιξη': return 'secondary';
      case 'Καθυστερεί': return 'destructive';
      default: return 'outline';
    }
  }

  const getCompanyName = (companyId?: string) => {
    if (!companyId) return '-';
    return companies.find(c => c.id === companyId)?.name || 'Άγνωστη εταιρεία';
  }


  if (isLoadingProject || !project) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="sm" className="w-fit" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Επιστροφή στα Έργα</Button>

      {/* Project Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.location} | Προθεσμία: {formatDate(project.deadline)} | Κατάσταση: {project.status}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
            {project.photoUrl && (
                <div className="md:w-1/3"><Image src={project.photoUrl} alt={`Photo of ${project.title}`} width={400} height={300} className="rounded-lg object-cover aspect-[4/3]" loading="lazy"/></div>
            )}
            <div className="flex-1 space-y-4">
                {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
                {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">{project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
                )}
            </div>
        </CardContent>
      </Card>
      
      {/* Phases Card */}
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Φάσεις Κατασκευής</CardTitle>
                <Dialog open={isPhaseDialogOpen} onOpenChange={handlePhaseDialogOpenChange}>
                    <DialogTrigger asChild>
                        <Button size="sm"><PlusCircle className="mr-2"/>Νέα Φάση</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editingPhase ? 'Επεξεργασία' : 'Νέα'} {editingPhase && 'parentId' in editingPhase ? 'Υποφάση' : 'Φάση'}</DialogTitle>
                        </DialogHeader>
                        <Form {...phaseForm}>
                            <form onSubmit={phaseForm.handleSubmit(onSubmitPhase)} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-4">
                                <FormField control={phaseForm.control} name="name" render={({field}) => (<FormItem><FormLabel>Όνομα</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                                <FormField control={phaseForm.control} name="description" render={({field}) => (<FormItem><FormLabel>Περιγραφή</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>)}/>
                                <FormField control={phaseForm.control} name="status" render={({field}) => (<FormItem><FormLabel>Κατάσταση</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Εκκρεμεί">Εκκρεμεί</SelectItem><SelectItem value="Σε εξέλιξη">Σε εξέλιξη</SelectItem><SelectItem value="Ολοκληρώθηκε">Ολοκληρώθηκε</SelectItem><SelectItem value="Καθυστερεί">Καθυστερεί</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                                <FormField
                                    control={phaseForm.control}
                                    name="assignedTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ανάθεση σε Εταιρεία/Συνεργείο</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Επιλέξτε..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value=""><em>Καμία</em></SelectItem>
                                                    {isLoadingCompanies ? <Loader2 className="animate-spin" /> : companies.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={phaseForm.control} name="documents" render={({field}) => (<FormItem><FormLabel>Έγγραφα (URL με κόμμα)</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                                <FormField control={phaseForm.control} name="notes" render={({field}) => (<FormItem><FormLabel>Σημειώσεις</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>)}/>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField control={phaseForm.control} name="startDate" render={({ field }) => (<FormItem><FormLabel>Έναρξη</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, 'P', {locale: el}) : <span>Επιλογή</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                                    <FormField control={phaseForm.control} name="endDate" render={({ field }) => (<FormItem><FormLabel>Λήξη</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, 'P', {locale: el}) : <span>Επιλογή</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                                    <FormField control={phaseForm.control} name="deadline" render={({ field }) => (<FormItem><FormLabel>Προθεσμία</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, 'P', {locale: el}) : <span>Επιλογή</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Αποθήκευση</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </CardHeader>
        <CardContent>
            {isLoadingPhases ? (<div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>)
            : phases.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow><TableHead>Φάση / Υποφάση</TableHead><TableHead>Κατάσταση</TableHead><TableHead>Υπεύθυνος</TableHead><TableHead>Έναρξη</TableHead><TableHead>Λήξη</TableHead><TableHead>Προθεσμία</TableHead><TableHead className="text-right">Ενέργειες</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                        {phases.map(phase => (
                            <>
                            <TableRow key={phase.id} className="group bg-muted/20">
                                <TableCell className="font-bold">{phase.name}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(phase.status)}>{phase.status}</Badge></TableCell>
                                <TableCell>{getCompanyName(phase.assignedTo)}</TableCell>
                                <TableCell>{formatDate(phase.startDate)}</TableCell>
                                <TableCell>{formatDate(phase.endDate)}</TableCell>
                                <TableCell>{formatDate(phase.deadline)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" title="Προσθήκη Υποφάσης" onClick={() => handleAddSubphase(phase.id)}><GitMerge className="h-4 w-4" /><span className="sr-only">Προσθήκη Υποφάσης</span></Button>
                                        <Button variant="ghost" size="icon" title="Επεξεργασία Φάσης" onClick={() => handleEditPhase(phase)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία Φάσης</span></Button>
                                        <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Φάσης" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή Φάσης</span></Button></AlertDialogTrigger>
                                            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά τη φάση "{phase.name}" και όλες τις υποφάσεις της.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDeletePhase(phase)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {phase.subphases.map(subphase => (
                                <TableRow key={subphase.id} className="group">
                                    <TableCell className="pl-8 text-muted-foreground"><span className="mr-2">└</span> {subphase.name}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(subphase.status)}>{subphase.status}</Badge></TableCell>
                                    <TableCell>{getCompanyName(subphase.assignedTo)}</TableCell>
                                    <TableCell>{formatDate(subphase.startDate)}</TableCell>
                                    <TableCell>{formatDate(subphase.endDate)}</TableCell>
                                    <TableCell>{formatDate(subphase.deadline)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" title="Επεξεργασία Υποφάσης" onClick={() => handleEditPhase(subphase, phase.id)}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία Υποφάσης</span></Button>
                                            <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή Υποφάσης" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή Υποφάσης</span></Button></AlertDialogTrigger>
                                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει οριστικά την υποφάση "{subphase.name}".</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDeletePhase(subphase, phase.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </>
                        ))}
                    </TableBody>
                </Table>
            ) : (<p className="text-center text-muted-foreground py-8">Δεν υπάρχουν καταχωρημένες φάσεις για αυτό το έργο.</p>)}
        </CardContent>
      </Card>
      
      {/* Buildings Card */}
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Κτίρια του Έργου</CardTitle>
                <Dialog open={isDialogOpen} onOpenChange={handleBuildingDialogOpenChange}>
                <DialogTrigger asChild><Button size="sm"><PlusCircle className="mr-2" />Νέο Κτίριο</Button></DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader><DialogTitle>{editingBuildingId ? 'Επεξεργασία' : 'Προσθήκη Νέου'} Κτιρίου</DialogTitle><DialogDescription>Συμπληρώστε τις πληροφορίες για το κτίριο του έργου.</DialogDescription></DialogHeader>
                    <Form {...buildingForm}>
                        <form onSubmit={buildingForm.handleSubmit(onSubmitBuilding)} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-4">
                            <FormField control={buildingForm.control} name="address" render={({ field }) => (<FormItem><FormLabel>Διεύθυνση</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <FormField control={buildingForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={buildingForm.control} name="floorsCount" render={({ field }) => (<FormItem><FormLabel>Αρ. Ορόφων</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}/></FormControl><FormMessage/></FormItem>)}/>
                                <FormField control={buildingForm.control} name="constructionYear" render={({ field }) => (<FormItem><FormLabel>Έτος Κατασκευής</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}/></FormControl><FormMessage/></FormItem>)}/>
                            </div>
                            <FormField control={buildingForm.control} name="photoUrl" render={({ field }) => (<FormItem><FormLabel>URL Φωτογραφίας</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <FormField control={buildingForm.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags (με κόμμα)</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <FormField control={buildingForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Περιγραφή</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>)}/>
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}{editingBuildingId ? 'Αποθήκευση' : 'Προσθήκη'}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
                </Dialog>
            </div>
        </CardHeader>
        <CardContent>
          {isLoadingBuildings ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>)
          : buildings.length > 0 ? (
            <Table>
              <TableHeader><TableRow><TableHead className="w-[60px]">Φωτο</TableHead><TableHead>Διεύθυνση</TableHead><TableHead>Τύπος</TableHead><TableHead>Ημ/νία Δημ.</TableHead><TableHead className="text-right">Ενέργειες</TableHead></TableRow></TableHeader>
              <TableBody>
                {buildings.map((building) => (
                  <TableRow key={building.id} className="group" onClick={() => router.push(`/buildings/${building.topLevelId}`)}>
                    <TableCell><div className="cursor-pointer">{building.photoUrl ? (<Image src={building.photoUrl} alt={building.address} width={40} height={40} className="rounded-md object-cover"/>) : (<div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">N/A</div>)}</div></TableCell>
                    <TableCell className="font-medium cursor-pointer">{building.address}</TableCell>
                    <TableCell className="text-muted-foreground cursor-pointer">{building.type}</TableCell>
                    <TableCell className="cursor-pointer">{formatDate(building.createdAt)}</TableCell>
                    <TableCell className="text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                            <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={(e) => { e.stopPropagation(); handleEditBuilding(building); }}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία</span></Button>
                            <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή</span></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το κτίριο "{building.address}".</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteBuilding(building.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (<p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν κτίρια για αυτό το έργο.</p>)}
        </CardContent>
      </Card>
    </div>
  );
}
