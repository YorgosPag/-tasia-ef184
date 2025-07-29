
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  onSnapshot,
  writeBatch,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { format } from 'date-fns';
import { logActivity } from '@/shared/lib/logger';
import { useAuth } from '@/shared/hooks/use-auth';
import type { Building } from '@/app/buildings/[id]/page';
import { NewFloorDialog, floorSchema, type FloorFormValues } from './NewFloorDialog';

interface Floor {
  id: string;
  level: string;
  description?: string;
  createdAt: any;
}

interface FloorsListProps {
  building: Building;
}

export function FloorsList({ building }: FloorsListProps) {
  const router = useRouter();
  const { isEditor } = useAuth();
  const { toast } = useToast();

  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema),
    defaultValues: { level: '', description: '', floorPlanUrl: '' },
  });

  useEffect(() => {
    if (!building.id) return;
    
    setIsLoadingFloors(true);
    const q = query(collection(db, 'floors'), where('buildingId', '==', building.id), orderBy('level', 'asc'));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const floorsData: Floor[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Floor));
        setFloors(floorsData);
        setIsLoadingFloors(false);
      },
      (error) => {
        console.error('Error fetching floors: ', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η φόρτωση των ορόφων.' });
        setIsLoadingFloors(false);
      }
    );

    return () => unsubscribe();
  }, [building.id, toast]);

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) form.reset();
  };

  const onSubmitFloor = async (data: FloorFormValues) => {
    if (!building.projectId || !building.originalId) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε το γονικό κτίριο.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const batch = writeBatch(db);
      const subCollectionFloorRef = doc(collection(db, 'projects', building.projectId, 'buildings', building.originalId, 'floors'));
      const topLevelFloorRef = doc(collection(db, 'floors'));
      
      const finalData = {
        level: data.level,
        description: data.description || '',
        floorPlanUrl: data.floorPlanUrl?.trim() ? data.floorPlanUrl : undefined,
      };

      batch.set(subCollectionFloorRef, { ...finalData, topLevelId: topLevelFloorRef.id, createdAt: serverTimestamp() });
      batch.set(topLevelFloorRef, { ...finalData, buildingId: building.id, originalId: subCollectionFloorRef.id, createdAt: serverTimestamp() });
      await batch.commit();
      toast({ title: 'Επιτυχία', description: 'Ο όροφος προστέθηκε.' });
      await logActivity('CREATE_FLOOR', {
        entityId: topLevelFloorRef.id,
        entityType: 'floor',
        details: finalData,
        projectId: building.projectId,
      });
      handleDialogOpenChange(false);
    } catch (error) {
      console.error('Error adding floor: ', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η προσθήκη του ορόφου.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (floorId: string) => {
    router.push(`/floors/${floorId}`);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Όροφοι του Κτιρίου</CardTitle>
          {isEditor && (
            <Button size="sm" onClick={() => handleDialogOpenChange(true)}>
                <PlusCircle className="mr-2" />Νέος Όροφος
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingFloors ? (
          <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : floors.length > 0 ? (
          <Table>
            <TableHeader><TableRow><TableHead>Επίπεδο</TableHead><TableHead>Περιγραφή</TableHead><TableHead>Ημ/νία Δημιουργίας</TableHead></TableRow></TableHeader>
            <TableBody>
              {floors.map((floor) => (
                <TableRow key={floor.id} onClick={() => handleRowClick(floor.id)} className="cursor-pointer">
                  <TableCell className="font-medium">{floor.level}</TableCell>
                  <TableCell className="text-muted-foreground">{floor.description || 'N/A'}</TableCell>
                  <TableCell>{formatDate(floor.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν όροφοι για αυτό το κτίριο.</p>
        )}
      </CardContent>
      <NewFloorDialog
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        form={form}
        onSubmit={form.handleSubmit(onSubmitFloor)}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
