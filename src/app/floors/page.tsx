
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, Timestamp, writeBatch, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Download, Search, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { exportToJson } from '@/lib/exporter';
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
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useDataStore } from '@/hooks/use-data-store';
import { useAuth } from '@/hooks/use-auth';
import { logActivity } from '@/lib/logger';

interface Floor {
  id: string;
  level: string;
  description?: string;
  buildingId: string;
  createdAt: any;
}

const floorSchema = z.object({
  level: z.string().min(1, { message: 'Το επίπεδο είναι υποχρεωτικό.' }),
  description: z.string().optional(),
  floorPlanUrl: z.string().url({ message: "Το URL της κάτοψης δεν είναι έγκυρο." }).or(z.literal('')),
  buildingId: z.string().min(1, { message: 'Το κτίριο είναι υποχρεωτικό.' }),
});

type FloorFormValues = z.infer<typeof floorSchema>;

export default function FloorsPage() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { isEditor } = useAuth();
  const { toast } = useToast();
  const { buildings, isLoading: isLoadingBuildings } = useDataStore();

  const form = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      level: '',
      description: '',
      floorPlanUrl: '',
      buildingId: '',
    },
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'floors'), (snapshot) => {
      const floorsData: Floor[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Floor));
      setFloors(floorsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching floors: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const onSubmitFloor = async (data: FloorFormValues) => {
    setIsSubmitting(true);
    try {
      const buildingDoc = await getDoc(doc(db, 'buildings', data.buildingId));
      if (!buildingDoc.exists()) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Το επιλεγμένο κτίριο δεν βρέθηκε.' });
        setIsSubmitting(false);
        return;
      }
      const buildingData = buildingDoc.data();
      const buildingOriginalId = buildingData.originalId;
      const projectId = buildingData.projectId;

      if (!buildingOriginalId || !projectId) {
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Το κτίριο δεν έχει σωστή δομή. Λείπει το originalId ή το projectId.' });
          setIsSubmitting(false);
          return;
      }
      
      const batch = writeBatch(db);

      const subCollectionFloorRef = doc(collection(db, 'projects', projectId, 'buildings', buildingOriginalId, 'floors'));
      const topLevelFloorRef = doc(collection(db, 'floors'));
      
      const finalData = {
        level: data.level,
        description: data.description || '',
        floorPlanUrl: data.floorPlanUrl?.trim() ? data.floorPlanUrl : undefined,
      };
    
      batch.set(subCollectionFloorRef, {
          ...finalData,
          topLevelId: topLevelFloorRef.id,
          createdAt: serverTimestamp(),
      });
      
      batch.set(topLevelFloorRef, {
          ...finalData,
          buildingId: data.buildingId,
          originalId: subCollectionFloorRef.id,
          createdAt: serverTimestamp(),
      });

      await batch.commit();

      toast({
          title: 'Επιτυχία',
          description: 'Ο όροφος προστέθηκε με επιτυχία.',
      });
      await logActivity('CREATE_FLOOR', {
        entityId: topLevelFloorRef.id,
        entityType: 'floor',
        details: { ...finalData, buildingId: data.buildingId },
        projectId: projectId
      });

      handleDialogOpenChange(false);
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

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return format(timestamp.toDate(), 'dd/MM/yyyy');
    }
    return 'Άγνωστη ημερομηνία';
  };

  const handleRowClick = (floorId: string) => {
    router.push(`/floors/${floorId}`);
  };

  const filteredFloors = useMemo(() => {
    if (!floors) return [];
    return floors.filter(floor => {
      const query = searchQuery.toLowerCase();
      return (
        floor.level.toLowerCase().includes(query) ||
        (floor.description && floor.description.toLowerCase().includes(query)) ||
        floor.buildingId.toLowerCase().includes(query)
      );
    });
  }, [floors, searchQuery]);

  const handleExport = () => {
    const dataToExport = filteredFloors.map(f => ({
      ...f,
      createdAt: formatDate(f.createdAt),
    }));
    exportToJson(dataToExport, 'floors');
  };

  return (
    <div className="flex flex-col gap-8">
       <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Όροφοι
        </h1>
        <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" disabled={isLoading || filteredFloors.length === 0}>
                <Download className="mr-2"/>
                Εξαγωγή σε JSON
            </Button>
            {isEditor && (
                <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
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
                        Επιλέξτε το κτίριο και συμπληρώστε τις πληροφορίες για να προσθέσετε έναν νέο όροφο.
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitFloor)} className="grid gap-4 py-4">
                        <FormField
                        control={form.control}
                        name="buildingId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Κτίριο</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Επιλέξτε κτίριο..." />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {isLoadingBuildings ? (
                                    <div className="flex items-center justify-center p-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                ) : (
                                    buildings.map(building => (
                                    <SelectItem key={building.id} value={building.id}>{building.address}</SelectItem>
                                    ))
                                )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
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
                        <FormField
                        control={form.control}
                        name="floorPlanUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>URL Κάτοψης (Προαιρετικό)</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com/plan.pdf" {...field} />
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
            )}
        </div>
      </div>
       <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Αναζήτηση σε επίπεδο, περιγραφή, ID κτιρίου..."
              className="pl-10 w-full md:w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Λίστα Όλων των Ορόφων ({filteredFloors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredFloors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Επίπεδο</TableHead>
                  <TableHead>Περιγραφή</TableHead>
                  <TableHead>Αναγνωριστικό Κτιρίου</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFloors.map((floor) => (
                  <TableRow key={floor.id} onClick={() => handleRowClick(floor.id)} className="cursor-pointer">
                    <TableCell className="font-medium">{floor.level}</TableCell>
                    <TableCell className="text-muted-foreground">{floor.description || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{floor.buildingId}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(floor.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-center text-muted-foreground py-8">
                {searchQuery ? 'Δεν βρέθηκαν όροφοι που να ταιριάζουν με την αναζήτηση.' : 'Δεν βρέθηκαν όροφοι.'}
             </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
