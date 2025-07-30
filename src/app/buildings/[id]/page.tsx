
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { buildingSchema, BuildingFormValues } from '@/components/projects/BuildingFormDialog';
import { BuildingDetailsForm } from '@/components/buildings/BuildingDetailsForm';
import { BuildingFloorsList } from '@/components/buildings/BuildingFloorsList';
import { logActivity } from '@/lib/logger';
import { useAuth } from '@/hooks/use-auth';

export interface Building {
  id: string;
  address: string;
  type: string;
  projectId: string;
  originalId: string;
  topLevelId: string;
  createdAt: any;
  description?: string;
  photoUrl?: string;
  constructionYear?: number;
}

export default function BuildingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isEditor } = useAuth();
  const buildingId = params.id as string;

  const [building, setBuilding] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: { address: '', type: '', description: '', photoUrl: '', constructionYear: undefined, identifier: '' },
  });

  useEffect(() => {
    if (!buildingId) return;

    const docRef = doc(db, 'buildings', buildingId);
    const unsubscribe = onSnapshot(docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Building;
          setBuilding(data);
          form.reset({
            address: data.address,
            type: data.type,
            constructionYear: data.constructionYear,
            description: data.description || '',
            photoUrl: data.photoUrl || '',
            identifier: (data as any).identifier || '',
          });
          setIsLoading(false);
        } else {
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε το κτίριο.' });
          router.push('/projects');
        }
      },
      (error) => {
        console.error("Error fetching building:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [buildingId, router, toast, form]);

  const onSubmit = async (data: BuildingFormValues) => {
    if (!building) return;
    setIsSubmitting(true);
    const { id, tags, ...updateData } = data;
    try {
        await updateDoc(doc(db, 'buildings', building.id), updateData);
        toast({ title: 'Επιτυχία', description: 'Οι αλλαγές στο κτίριο αποθηκεύτηκαν.' });
        await logActivity('UPDATE_BUILDING', {
            entityId: building.id,
            entityType: 'building',
            changes: updateData,
            projectId: building.projectId,
        });
        form.reset(data); // Sync form state
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η αποθήκευση απέτυχε: ${error.message}` });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  if (!building) {
    return <p className="text-center">Δεν βρέθηκε κτίριο.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Επιστροφή</Button>
        {isEditor && (
            <Button type="submit" form="building-details-form" disabled={isSubmitting || !form.formState.isDirty}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Αποθήκευση
            </Button>
        )}
      </div>
      <Form {...form}>
        <form id="building-details-form" onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <BuildingDetailsForm form={form} building={building} />
          </Card>
        </form>
      </Form>
      <BuildingFloorsList building={building} />
    </div>
  );
}
