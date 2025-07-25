
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp, writeBatch, doc, deleteDoc, query } from 'firebase/firestore';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
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
import { PlusCircle, Loader2, Download, Search, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataStore } from '@/hooks/use-data-store';
import { exportToJson } from '@/lib/exporter';
import { useAuth } from '@/hooks/use-auth';
import { logActivity } from '@/lib/logger';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/project-helpers';
import type { Building } from '@/hooks/use-data-store';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';


const buildingSchema = z.object({
  address: z.string().min(1, { message: 'Η διεύθυνση είναι υποχρεωτική.' }),
  type: z.string().min(1, { message: 'Ο τύπος είναι υποχρεωτικός.' }),
  description: z.string().optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')),
  projectId: z.string().min(1, { message: "Το έργο είναι υποχρεωτικό." }),
});

type BuildingFormValues = z.infer<typeof buildingSchema>;

async function fetchBuildings(): Promise<Building[]> {
    const q = query(collection(db, 'buildings'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Building));
}

export default function BuildingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { isEditor } = useAuth();
  const { projects, isLoading: isLoadingProjects } = useDataStore();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: buildings = [], isLoading } = useQuery({ 
      queryKey: ['buildings'], 
      queryFn: fetchBuildings 
  });

  const mutation = useMutation({
      mutationFn: async (buildingData: BuildingFormValues & { id?: string }) => {
          if (buildingData.id) {
            // Update logic would go here, more complex due to dual-write
          } else {
             const batch = writeBatch(db);
            const topLevelBuildingRef = doc(collection(db, 'buildings'));
            const subCollectionBuildingRef = doc(collection(db, 'projects', buildingData.projectId, 'buildings'));
            
            const dataToSave = {
                 address: buildingData.address,
                 type: buildingData.type,
                 description: buildingData.description,
                 photoUrl: buildingData.photoUrl,
            }

            batch.set(topLevelBuildingRef, { ...dataToSave, originalId: subCollectionBuildingRef.id, projectId: buildingData.projectId, createdAt: serverTimestamp() });
            batch.set(subCollectionBuildingRef, { ...dataToSave, topLevelId: topLevelBuildingRef.id, createdAt: serverTimestamp() });
            await batch.commit();
            return topLevelBuildingRef.id;
          }
      },
      onSuccess: (newId, variables) => {
          queryClient.invalidateQueries({ queryKey: ['buildings'] });
          handleDialogOpenChange(false);
          toast({ title: 'Επιτυχία', description: `Το κτίριο ${variables.id ? 'ενημερώθηκε' : 'προστέθηκε'}.` });
      },
      onError: (error: Error) => {
          toast({ variant: "destructive", title: "Σφάλμα", description: error.message });
      }
  })

  const deleteMutation = useMutation({
      mutationFn: async (building: Building) => {
        if (!building.originalId || !building.projectId) {
            throw new Error('Cannot delete building with missing data.');
        }
        const batch = writeBatch(db);
        batch.delete(doc(db, 'buildings', building.id));
        batch.delete(doc(db, 'projects', building.projectId, 'buildings', building.originalId));
        await batch.commit();
        return building;
      },
      onSuccess: (deletedBuilding) => {
          queryClient.invalidateQueries({ queryKey: ['buildings'] });
          toast({ title: 'Success', description: `Building ${deletedBuilding.address} has been deleted.` });
      },
      onError: (error: Error) => {
          toast({ variant: 'destructive', title: 'Error', description: error.message });
      }
  })

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: { address: '', type: '', description: '', photoUrl: '', projectId: '' },
  });
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setEditingBuilding(null);
    }
  };

  const onSubmit = (data: BuildingFormValues) => {
    mutation.mutate(editingBuilding ? { ...data, id: editingBuilding.id } : data);
  };
  
  const handleEditClick = (building: Building) => {
    setEditingBuilding(building);
    form.reset({
      address: building.address,
      type: building.type,
      description: (building as any).description || '',
      photoUrl: (building as any).photoUrl || '',
      projectId: building.projectId || '',
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (building: Building) => {
      deleteMutation.mutate(building);
  };

  const handleRowClick = (buildingId: string) => {
    router.push(`/buildings/${buildingId}`);
  };

  const getProjectTitle = useCallback((projectId: string | undefined) => {
    if (!projectId) return 'N/A';
    if (!projects) return 'Loading...'; 
    return projects.find(p => p.id === projectId)?.title || projectId;
  }, [projects]);
  
  const filteredBuildings = useMemo(() => {
    if (!buildings) return [];
    return buildings.filter(building => {
      const query = searchQuery.toLowerCase();
      const projectTitle = getProjectTitle(building.projectId).toLowerCase();
      return (
        building.address.toLowerCase().includes(query) ||
        building.type.toLowerCase().includes(query) ||
        ((building as any).description && (building as any).description.toLowerCase().includes(query)) ||
        projectTitle.includes(query)
      );
    });
  }, [buildings, searchQuery, getProjectTitle]);

  const handleExport = () => {
    const dataToExport = filteredBuildings.map(b => ({
      ...b,
      projectTitle: getProjectTitle(b.projectId),
      createdAt: formatDate((b as any).createdAt),
    }));
    exportToJson(dataToExport, 'buildings');
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Κτίρια
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" disabled={isLoading || filteredBuildings.length === 0}>
                <Download className="mr-2"/>
                Εξαγωγή σε JSON
            </Button>
            {isEditor && (
                <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                    <Button onClick={() => setEditingBuilding(null)}>
                    <PlusCircle className="mr-2" />
                    Νέο Κτίριο
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>{editingBuilding ? 'Επεξεργασία' : 'Δημιουργία Νέου'} Κτιρίου</DialogTitle>
                    <DialogDescription>
                        Συμπληρώστε τις παρακάτω πληροφορίες για το κτίριο.
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Διεύθυνση</FormLabel><FormControl><Input placeholder="π.χ. Αριστοτέλους 1, Αθήνα" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="type" render={({ field }) => ( <FormItem><FormLabel>Τύπος</FormLabel><FormControl><Input placeholder="π.χ. Πολυκατοικία" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="photoUrl" render={({ field }) => ( <FormItem><FormLabel>URL Φωτογραφίας (Προαιρετικό)</FormLabel><FormControl><Input placeholder="https://example.com/photo.jpg" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Περιγραφή (Προαιρετικό)</FormLabel><FormControl><Textarea placeholder="Σημειώσεις για το κτίριο..." {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="projectId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Αντιστοίχιση σε Έργο</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε έργο..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {isLoadingProjects ? ( <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div> ) : (
                                            projects.map(project => ( <SelectItem key={project.id} value={project.id}>{project.title}</SelectItem> ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline" disabled={mutation.isPending}>Ακύρωση</Button></DialogClose>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingBuilding ? 'Αποθήκευση' : 'Δημιουργία'}
                            </Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
                </Dialog>
            )}
        </div>
      </div>
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input type="search" placeholder="Αναζήτηση σε διεύθυνση, τύπο, έργο..." className="pl-10 w-full md:w-1/3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
       </div>

      <Card>
        <CardHeader><CardTitle>Λίστα Κτιρίων ({filteredBuildings.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? ( <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> ) : 
           filteredBuildings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Διεύθυνση</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Έργο</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                  {isEditor && <TableHead className="text-right">Ενέργειες</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuildings.map((building) => (
                  <TableRow key={building.id} className="group">
                    <TableCell className="font-medium cursor-pointer" onClick={() => handleRowClick(building.id)}>{building.address}</TableCell>
                    <TableCell className="text-muted-foreground cursor-pointer" onClick={() => handleRowClick(building.id)}>{building.type}</TableCell>
                    <TableCell className="text-muted-foreground cursor-pointer" onClick={() => handleRowClick(building.id)}>{getProjectTitle(building.projectId)}</TableCell>
                    <TableCell className="text-muted-foreground cursor-pointer" onClick={() => handleRowClick(building.id)}>{formatDate((building as any).createdAt)}</TableCell>
                    {isEditor && (
                        <TableCell className="text-right">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={(e) => { e.stopPropagation(); handleEditClick(building); }}><Edit className="h-4 w-4"/></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4"/></Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το κτίριο "{building.address}".</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteClick(building)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : ( <p className="text-center text-muted-foreground py-8"> {searchQuery ? 'Δεν βρέθηκαν κτίρια που να ταιριάζουν με την αναζήτηση.' : 'Δεν βρέθηκαν κτίρια.'} </p> )}
        </CardContent>
      </Card>
    </div>
  );
}
