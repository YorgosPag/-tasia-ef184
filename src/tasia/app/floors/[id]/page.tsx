'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BuildingDetailsForm } from '@/tasia/components/buildings/BuildingDetailsForm';
import { FloorsList } from '@/tasia/components/buildings/FloorsList';

const buildingFormSchema = z.object({
  address: z.string().min(1, 'Η διεύθυνση είναι υποχρεωτική.'),
  type: z.string().min(1, 'Ο τύπος είναι υποχρεωτικός.'),
  description: z.string().optional(),
  constructionYear: z.number().optional(),
  photoUrl: z.string().url().or(z.literal('')).optional(),
});

export type BuildingFormValues = z.infer<typeof buildingFormSchema>;

export interface Building {
  id: string;
  address: string;
  type: string;
  description?: string;
  constructionYear?: number;
  photoUrl?: string;
  projectId: string;
  originalId: string;
  createdAt: string;
}

export default function BuildingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const buildingId = params.id as string;

  const [building, setBuilding] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingFormSchema),
  });

  useEffect(() => {
    if (!buildingId) return;

    const docRef = doc(db, 'buildings', buildingId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = {
            id: docSnap.id,
            ...docSnap.data(),
            createdAt: (docSnap.data().createdAt as Timestamp).toDate().toLocaleDateString('el-GR')
        } as Building;
        setBuilding(data);
        form.reset({
            address: data.address,
            type: data.type,
            description: data.description || '',
            constructionYear: data.constructionYear,
            photoUrl: data.photoUrl || ''
        });
      } else {
        console.error("No such document!");
        router.push('/projects');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [buildingId, router, form]);


  const onSubmit = (data: BuildingFormValues) => {
    console.log(data);
    // TODO: Implement update logic
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  if (!building) {
    return <div>Building not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="w-fit" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Επιστροφή στο Έργο
            </Button>
            <Button type="submit" form="building-details-form" disabled={!form.formState.isDirty}>
                Αποθήκευση Αλλαγών
            </Button>
      </div>

      <Form {...form}>
        <form id="building-details-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <BuildingDetailsForm form={form} building={building} />
            </Card>
        </form>
      </Form>
      
      <FloorsList building={building} />

    </div>
  );
}