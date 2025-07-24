
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  onSnapshot,
  writeBatch,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { logActivity } from '@/lib/logger';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { FloorsList } from '@/components/buildings/FloorsList';
import { BuildingDetailsForm } from '@/components/buildings/BuildingDetailsForm';

const buildingSchema = z.object({
  address: z.string().min(1, { message: 'Η διεύθυνση είναι υποχρεωτική.' }),
  type: z.string().min(1, { message: 'Ο τύπος είναι υποχρεωτικός.' }),
  description: z.string().optional(),
  photoUrl: z.string().url({ message: 'Το URL της φωτογραφίας δεν είναι έγκυρο.' }).or(z.literal('')),
  constructionYear: z.coerce.number().optional(),
});

export type BuildingFormValues = z.infer<typeof buildingSchema>;

export interface Building {
  id: string;
  address: string;
  type: string;
  description?: string;
  photoUrl?: string;
  projectId?: string;
  originalId?: string;
  constructionYear?: number;
  createdAt: any;
}

interface Floor {
  id: string;
  level: string;
  description?: string;
  createdAt: any;
}

export default function BuildingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const buildingId = params.id as string;
  const { isEditor } = useAuth();
  const { toast } = useToast();

  const [building, setBuilding] = useState<Building | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: { address: '', type: '', description: '', photoUrl: '', constructionYear: undefined },
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    if (!buildingId) return;

    const buildingDocRef = doc(db, 'buildings', buildingId);
    const unsubscribeBuilding = onSnapshot(buildingDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Building;
        setBuilding(data);
        form.reset({
          address: data.address,
          type: data.type,
          description: data.description || '',
          photoUrl: data.photoUrl || '',
          constructionYear: data.constructionYear,
        });
      } else {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Το κτίριο δεν βρέθηκε.' });
        router.push('/buildings');
      }
      setIsLoading(false);
    });

    return () => unsubscribeBuilding();
  }, [buildingId, router, toast, form]);

  const onSubmit = async (data: BuildingFormValues) => {
    if (!building) return;
    setIsSubmitting(true);
    
    const dataToUpdate = {
        ...data,
        constructionYear: data.constructionYear || null, // Use null to remove if empty
    };

    try {
        const batch = writeBatch(db);
        const topLevelRef = doc(db, 'buildings', building.id);
        const subRef = doc(db, 'projects', building.projectId!, 'buildings', building.originalId!);

        batch.update(topLevelRef, dataToUpdate);
        batch.update(subRef, {
            address: data.address,
            type: data.type,
            description: data.description,
            photoUrl: data.photoUrl,
        });

        await batch.commit();
        toast({ title: 'Επιτυχία', description: 'Οι αλλαγές στο κτίριο αποθηκεύτηκαν.' });
        form.reset(data); // Sync form state
        await logActivity('UPDATE_BUILDING', { entityId: building.id, entityType: 'building', changes: data });
    } catch (error) {
        console.error('Error updating building:', error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η αποθήκευση απέτυχε.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  if (!building) {
    return null;
  }
  
  const buildingWithFormattedDate = { ...building, createdAt: formatDate(building.createdAt) };

  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" className="w-fit" type="button" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Επιστροφή
            </Button>
            {isEditor && (
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Αποθήκευση
                </Button>
            )}
          </div>
          <Card className="mt-4">
             <BuildingDetailsForm form={form} building={buildingWithFormattedDate} />
          </Card>
        </form>
      </Form>
      
      <FloorsList building={building} />
    </div>
  );
}
