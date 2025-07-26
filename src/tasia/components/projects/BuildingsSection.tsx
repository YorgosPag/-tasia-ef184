
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  doc,
  collection,
  onSnapshot,
  writeBatch,
  getDoc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
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
} from "@/shared/components/ui/alert-dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { format } from 'date-fns';
import Image from 'next/image';
import { logActivity } from '@/shared/lib/logger';
import { BuildingFormDialog, buildingSchema, BuildingFormValues } from './BuildingFormDialog';
import type { Project } from '@/tasia/app/projects/[id]/page';
import { useAuth } from '@/shared/hooks/use-auth';

// Re-declaring Building type locally as it's not exported from the page
interface Building {
    id: string;
    address: string;
    type: string;
    description?: string;
    photoUrl?: string;
    createdAt?: any;
    topLevelId: string;
}


interface BuildingsSectionProps {
    project: Project;
}

export function BuildingsSection({ project }: BuildingsSectionProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { isEditor } = useAuth();

    const [buildings, setBuildings] = useState<Building[]>([]);
    const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);

    const form = useForm<BuildingFormValues>({
        resolver: zodResolver(buildingSchema),
        defaultValues: {
            id: undefined, address: '', type: '', description: '', photoUrl: '',
            floorsCount: undefined, constructionYear: undefined, tags: '', identifier: '',
        },
    });

    useEffect(() => {
        if (!project.id) return;
        const subcollectionRef = collection(db, 'projects', project.id, 'buildings');
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
    }, [project.id, toast]);


    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
          form.reset();
          setEditingBuilding(null);
        }
    };

    const handleEditBuilding = async (building: Building) => {
        const docRef = doc(db, 'buildings', building.topLevelId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            const data = docSnap.data();
            form.reset({
                id: building.id, address: data.address, type: data.type,
                description: data.description || '', photoUrl: data.photoUrl || '',
                floorsCount: data.floorsCount || undefined, constructionYear: data.constructionYear || undefined,
                tags: (data.tags || []).join(', '),
                identifier: data.identifier || '',
            });
            setEditingBuilding(building);
            setIsDialogOpen(true);
        } else {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Could not find building details.' });
        }
      };

    const handleDeleteBuilding = async (buildingId: string) => {
        const buildingToDelete = buildings.find(b => b.id === buildingId);
        if (!buildingToDelete) return;
        try {
            const batch = writeBatch(db);
            batch.delete(doc(db, 'buildings', buildingToDelete.topLevelId));
            batch.delete(doc(db, 'projects', project.id, 'buildings', buildingToDelete.id));
            await batch.commit();
            toast({ title: "Επιτυχία", description: "Το κτίριο διαγράφηκε." });
            await logActivity('DELETE_BUILDING', {
                entityId: buildingToDelete.topLevelId,
                entityType: 'building',
                details: { address: buildingToDelete.address },
                projectId: project.id,
            });
        } catch (error) {
            console.error("Error deleting building:", error);
            toast({ variant: "destructive", title: "Σφάλμα", description: "Δεν ήταν δυνατή η διαγραφή του κτιρίου." });
        }
    };

    const onSubmitBuilding = async (data: BuildingFormValues) => {
        setIsSubmitting(true);
        const finalData = {
            address: data.address, type: data.type, description: data.description || '',
            photoUrl: data.photoUrl?.trim() || undefined, floorsCount: data.floorsCount || undefined,
            constructionYear: data.constructionYear || undefined,
            tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            identifier: data.identifier,
        }
    
        try {
            if (editingBuilding) {
                const batch = writeBatch(db);
                batch.update(doc(db, 'buildings', editingBuilding.topLevelId), finalData);
                batch.update(doc(db, 'projects', project.id, 'buildings', editingBuilding.id), {
                  address: finalData.address,
                  type: finalData.type,
                  description: finalData.description,
                  photoUrl: finalData.photoUrl,
                });
                await batch.commit();
                toast({ title: 'Επιτυχία', description: 'Το κτίριο ενημερώθηκε.' });
                await logActivity('UPDATE_BUILDING', {
                    entityId: editingBuilding.topLevelId,
                    entityType: 'building',
                    changes: finalData,
                    projectId: project.id,
                });
            } else {
                const batch = writeBatch(db);
                const topLevelRef = doc(collection(db, 'buildings'));
                const subCollectionRef = doc(collection(db, 'projects', project.id, 'buildings'));
                batch.set(topLevelRef, { ...finalData, projectId: project.id, originalId: subCollectionRef.id, createdAt: serverTimestamp() });
                batch.set(subCollectionRef, { 
                  address: finalData.address,
                  type: finalData.type,
                  description: finalData.description,
                  photoUrl: finalData.photoUrl,
                  topLevelId: topLevelRef.id, 
                  createdAt: serverTimestamp() 
                });
                await batch.commit();
                toast({ title: 'Επιτυχία', description: 'Το κτίριο προστέθηκε.' });
                await logActivity('CREATE_BUILDING', {
                    entityId: topLevelRef.id,
                    entityType: 'building',
                    details: finalData,
                    projectId: project.id,
                });
            }
            handleDialogOpenChange(false);
        } catch (error) {
            console.error('Error submitting building: ', error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η υποβολή.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const formatDate = (timestamp?: any) => {
        if (!timestamp) return '-';
        return format(timestamp.toDate(), 'dd/MM/yyyy');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Κτίρια του Έργου</CardTitle>
                    {isEditor && <Button size="sm" onClick={() => { setEditingBuilding(null); form.reset(); setIsDialogOpen(true); }}><PlusCircle className="mr-2" />Νέο Κτίριο</Button>}
                </div>
            </CardHeader>
            <CardContent>
            {isLoadingBuildings ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>)
            : buildings.length > 0 ? (
                <div className="w-full overflow-x-auto">
                    <Table>
                    <TableHeader><TableRow><TableHead className="w-[60px]">Φωτο</TableHead><TableHead>Διεύθυνση</TableHead><TableHead>Τύπος</TableHead><TableHead>Ημ/νία Δημ.</TableHead><TableHead className="text-right">Ενέργειες</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {buildings.map((building) => (
                        <TableRow key={building.id} className="group">
                            <TableCell><div className="cursor-pointer" onClick={() => router.push(`/buildings/${building.topLevelId}`)}>{building.photoUrl ? (<Image src={building.photoUrl} alt={building.address} width={40} height={40} className="rounded-md object-cover"/>) : (<div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">N/A</div>)}</div></TableCell>
                            <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/buildings/${building.topLevelId}`)}>{building.address}</TableCell>
                            <TableCell className="text-muted-foreground cursor-pointer" onClick={() => router.push(`/buildings/${building.topLevelId}`)}>{building.type}</TableCell>
                            <TableCell className="cursor-pointer" onClick={() => router.push(`/buildings/${building.topLevelId}`)}>{formatDate(building.createdAt)}</TableCell>
                            <TableCell className="text-right">
                                {isEditor && <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={(e) => { e.stopPropagation(); handleEditBuilding(building); }}><Edit className="h-4 w-4"/><span className="sr-only">Επεξεργασία</span></Button>
                                    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Διαγραφή" className="text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4"/><span className="sr-only">Διαγραφή</span></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το κτίριο "{building.address}" και όλοι οι όροφοι και τα ακίνητα που περιέχει.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteBuilding(building.id)} className="bg-destructive hover:bg-destructive/90">Διαγραφή</AlertDialogAction></AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
            ) : (<p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν κτίρια για αυτό το έργο.</p>)}
            </CardContent>
            {isEditor && <BuildingFormDialog
                open={isDialogOpen}
                onOpenChange={handleDialogOpenChange}
                form={form}
                onSubmit={form.handleSubmit(onSubmitBuilding)}
                isSubmitting={isSubmitting}
                editingBuilding={editingBuilding}
            />}
        </Card>
    )
}
