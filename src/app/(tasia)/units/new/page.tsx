
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDataStore } from '@/shared/hooks/use-data-store';
import { useUnitLocationState } from '@/tasia/hooks/useUnitLocationState';
import { NewUnitFormValues, newUnitSchema, getUnitDataFromForm, MULTI_FLOOR_TYPES } from '@/tasia/lib/unit-helpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/tasia/hooks/use-toast';
import { logActivity } from '@/shared/lib/logger';
import { writeBatch, doc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';

import { UnitDetailsForm } from '@/tasia/components/units/UnitDetailsForm';
import { UnitLocationSelector } from '@/tasia/components/units/new/UnitLocationSelector';


export default function NewUnitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { companies, projects, buildings } = useDataStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewUnitFormValues>({
    resolver: zodResolver(newUnitSchema),
    defaultValues: {
      identifier: '',
      name: '',
      type: '',
      status: 'Διαθέσιμο',
      floorIds: [],
      netArea: '',
      grossArea: '',
      commonArea: '',
      semiOutdoorArea: '',
      architecturalProjectionsArea: '',
      balconiesArea: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      orientation: '',
      kitchenLayout: '',
      description: '',
      isPenthouse: false,
      amenities: [],
      levelSpan: 0,
    },
  });

  const locationState = useUnitLocationState({ companies, projects, buildings }, form);

  const selectedType = form.watch('type');
  const isMultiFloorAllowed = useMemo(() => MULTI_FLOOR_TYPES.includes(selectedType), [selectedType]);

  const handleQuickCreate = (entity: string) => {
      toast({ title: "Functionality not implemented", description: `Quick creating a new ${entity} is not yet available from this form.` });
  }

  const onSubmit = async (data: NewUnitFormValues) => {
    setIsSubmitting(true);
    
    const { selectedProject, selectedBuilding } = locationState;
    if (!selectedProject || !selectedBuilding) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Παρακαλώ επιλέξτε Έργο και Κτίριο.'});
        setIsSubmitting(false);
        return;
    }

    try {
        const unitData = getUnitDataFromForm(data);
        const batch = writeBatch(db);
        
        const topLevelUnitRef = doc(collection(db, 'units'));
        batch.set(topLevelUnitRef, {
            ...unitData,
            projectId: selectedProject,
            buildingId: selectedBuilding,
            createdAt: serverTimestamp(),
            originalId: topLevelUnitRef.id // Temporary self-reference for standalone creation
        });
        
        await batch.commit();

        toast({ title: "Επιτυχία", description: "Το νέο ακίνητο δημιουργήθηκε." });
        await logActivity('CREATE_UNIT', { entityId: topLevelUnitRef.id, entityType: 'unit', details: unitData });
        
        router.push(`/units/${topLevelUnitRef.id}`);

    } catch (error: any) {
        console.error("Error creating new unit:", error);
        toast({ variant: "destructive", title: "Σφάλμα", description: `Η δημιουργία απέτυχε: ${error.message}` });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <Button variant="outline" size="sm" className="w-fit" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Επιστροφή
            </Button>
            <div>
                 <h1 className="text-2xl font-bold">Δημιουργία Νέου Ακινήτου</h1>
                 <p className="text-sm text-muted-foreground">Συμπληρώστε τις παρακάτω πληροφορίες για να δημιουργήσετε ένα νέο ακίνητο.</p>
            </div>
        </div>
        <Button type="submit" form="new-unit-form" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Αποθήκευση Ακινήτου
        </Button>
      </div>

       <Form {...form}>
        <form id="new-unit-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Τοποθεσία Ακινήτου</CardTitle>
                    <CardDescription>Επιλέξτε την εταιρεία, το έργο, το κτίριο και τους ορόφους στους οποίους ανήκει το ακίνητο.</CardDescription>
                </CardHeader>
                <CardContent>
                    <UnitLocationSelector 
                        form={form} 
                        locationState={locationState} 
                        isMultiFloorAllowed={isMultiFloorAllowed}
                        onQuickCreate={handleQuickCreate}
                    />
                </CardContent>
            </Card>

            <UnitDetailsForm form={form} unit={{}} getStatusClass={() => ''} />
        </form>
      </Form>
    </div>
  );
}
