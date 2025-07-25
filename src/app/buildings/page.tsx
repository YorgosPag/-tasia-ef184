
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, addDoc, serverTimestamp, Timestamp, writeBatch, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  AlertDialogTrigger,
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
import { format } from 'date-fns';
import { useDataStore } from '@/hooks/use-data-store';
import { exportToJson } from '@/lib/exporter';
import { useAuth } from '@/hooks/use-auth';
import { logActivity } from '@/lib/logger';


const buildingSchema = z.object({
  address: z.string().min(1, { message: 'Η διεύθυνση είναι υποχρεωτική.' }),
  type: z.string().min(1, { message: 'Ο τύπος είναι υποχρεωτικός.' }),
  description: z.string().optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')),
  projectId: z.string().min(1, { message: "Το έργο είναι υποχρεωτικό." }),
});

type BuildingFormValues = z.infer<typeof buildingSchema>;

interface Building {
  id: string; // This is the top-level ID
  address: string;
  type: string;
  description?: string;
  photoUrl?: string;
  projectId?: string;
  originalId?: string; // This is the sub-collection ID
  createdAt: any;
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { isEditor } = useAuth();
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
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setEditingBuilding(null);
    }
  };

  useEffect(() => {
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
        const buildingData = {
            address: data.address,
            type: data.type,
            description: data.description || '',
            photoUrl: data.photoUrl?.trim() || undefined,
            projectId: data.projectId,
        };

        if (editingBuilding) {
            const batch = writeBatch(db);
            const topLevelBuildingRef = doc(db, 'buildings', editingBuilding.id);
            const subCollectionBuildingRef = doc(db, 'projects', editingBuilding.projectId!, 'buildings', editingBuilding.originalId!);
            
            batch.update(topLevelBuildingRef, buildingData);
            batch.update(subCollectionBuildingRef, {
                address: data.address,
                type: data.type,
                description: data.description,
                photoUrl: data.photoUrl,
            });
            
            await batch.commit();
            toast({ title: "Επιτυχία", description: "Το κτίριο ενημερώθηκε." });
        } else {
            const batch = writeBatch(db);
            const topLevelBuildingRef = doc(collection(db, 'buildings'));
            const subCollectionBuildingRef = doc(collection(db, 'projects', data.projectId, 'buildings'));
            
            batch.set(topLevelBuildingRef, { ...buildingData, originalId: subCollectionBuildingRef.id, createdAt: serverTimestamp() });
            batch.set(subCollectionBuildingRef, {
                address: data.address, type: data.type, description: data.description,
                photoUrl: data.photoUrl, createdAt: serverTimestamp(), topLevelId: topLevelBuildingRef.id,
            });
            await batch.commit();
            toast({ title: "Επιτυχία", description: "Το κτίριο προστέθηκε." });
        }
        handleDialogOpenChange(false);
    } catch (error) {
      console.error("Error submitting building: ", error);
      toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν ήταν δυνατή η υποβολή." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditClick = (building: Building) => {
    setEditingBuilding(building);
    form.reset({
      address: building.address,
      type: building.type,
      description: building.description || '',
      photoUrl: building.photoUrl || '',
      projectId: building.projectId || '',
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = async (building: Building) => {
    if (!building.originalId || !building.projectId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Cannot delete building with missing data.' });
      return;
    }
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'buildings', building.id));
      batch.delete(doc(db, 'projects', building.projectId, 'buildings', building.originalId));
      await batch.commit();
      toast({ title: 'Success', description: `Building ${building.address} has been deleted.` });
      await logActivity('DELETE_BUILDING', { entityId: building.id, entityType: 'building', name: building.address, projectId: building.projectId });
    } catch (err) {
      console.error("Error deleting building:", err);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete building.' });
    }
  };


   const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'dd/MM/yyyy');
    }
    if (timestamp instanceof Date) {
        return format(timestamp, 'dd/MM/yyyy');
    }
    return 'Άγνωστη ημερομηνία';
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
        (building.description && building.description.toLowerCase().includes(query)) ||
        projectTitle.includes(query)
      );
    });
  }, [buildings, searchQuery, getProjectTitle]);


  const handleExport = () => {
    const dataToExport = filteredBuildings.map(b => ({
      ...b,
      projectTitle: getProjectTitle(b.projectId),
      createdAt: formatDate(b.createdAt),
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
                                <FormLabel>Αντιστοίχιση σε Έργο</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Επιλέξτε έργο..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
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
          <Input
              type="search"
              placeholder="Αναζήτηση σε διεύθυνση, τύπο, έργο..."
              className="pl-10 w-full md:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Κτιρίων ({filteredBuildings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredBuildings.length > 0 ? (
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
                    <TableCell className="text-muted-foreground cursor-pointer" onClick={() => handleRowClick(building.id)}>{formatDate(building.createdAt)}</TableCell>
                    {isEditor && (
                        <TableCell className="text-right">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                                <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={(e) => { e.stopPropagation(); handleEditClick(building); }}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" title="Διαγραφή" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                                        <AlertDialogDescription>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το κτίριο "{building.address}".</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteClick(building)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'Δεν βρέθηκαν κτίρια που να ταιριάζουν με την αναζήτηση.' : 'Δεν βρέθηκαν κτίρια.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
