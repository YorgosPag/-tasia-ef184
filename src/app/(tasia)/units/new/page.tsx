
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDataStore } from '@/shared/hooks/use-data-store';
import { useUnitLocationState } from '@/tasia/hooks/useUnitLocationState';
import { newUnitSchema, getUnitDataFromForm, MULTI_FLOOR_TYPES } from '@/tasia/lib/unit-helpers';
import type { NewUnitFormValues } from '@/tasia/lib/unit-helpers';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card';
import { UnitLocationSelector } from '@/tasia/components/units/new/UnitLocationSelector';
import { AreaInputs } from '@/tasia/components/units/new/AreaInputs';
import { Separator } from '@/shared/components/ui/separator';
import { AmenitiesChecklist } from '@/tasia/components/units/new/AmenitiesChecklist';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { db } from '@/shared/lib/firebase';
import { doc, writeBatch, serverTimestamp, collection, addDoc, getDoc } from 'firebase/firestore';
import { useToast } from '@/shared/hooks/use-toast';
import { logActivity } from '@/shared/lib/logger';


export default function NewUnitPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { companies, projects, buildings, addCompany, addProject } = useDataStore();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<NewUnitFormValues>({
        resolver: zodResolver(newUnitSchema),
        defaultValues: {
            status: 'Διαθέσιμο',
            floorIds: [],
            isPenthouse: false,
            amenities: [],
            levelSpan: 0,
        },
    });

    const selectedType = useWatch({ control: form.control, name: 'type' });
    const isMultiFloorAllowed = MULTI_FLOOR_TYPES.includes(selectedType || '');

    const locationState = useUnitLocationState({ companies, projects, buildings }, form);

    const handleQuickCreate = async (entity: 'company' | 'project' | 'building' | 'floor') => {
        // This is a simplified version. A real implementation would use a dialog.
        const name = prompt(`Enter new ${entity} name/identifier:`);
        if (!name) return;

        try {
            if (entity === 'company') {
                const newId = await addCompany({ name, contactInfo: { email: '', phone: '', address: '', afm: '' } });
                if(newId) locationState.setSelectedCompany(newId);
            } else if (entity === 'project') {
                const companyId = locationState.selectedCompany;
                if(!companyId) throw new Error("No company selected");
                const newId = await addProject({ title: name, companyId, location: 'TBD', status: 'Ενεργό', deadline: new Date() });
                if(newId) locationState.setSelectedProject(newId);
            } else {
                 // Creating buildings/floors requires more context (e.g., project/building ID)
                 // which we have in locationState.
                 alert(`Quick create for ${entity} to be implemented.`);
            }
            toast({title: 'Success', description: `${entity} created.`});
        } catch(e) {
            console.error(e);
            toast({variant: 'destructive', title: 'Error', description: `Could not create ${entity}.`});
        }
    };
    
    const onSubmit = async (data: NewUnitFormValues) => {
        setIsSubmitting(true);
        const { selectedCompany, selectedProject, selectedBuilding } = locationState;
        if (!selectedCompany || !selectedProject || !selectedBuilding || data.floorIds.length === 0) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Παρακαλώ επιλέξτε Εταιρεία, Έργο, Κτίριο και τουλάχιστον έναν όροφο.'});
            setIsSubmitting(false);
            return;
        }

        const unitData = {
            ...getUnitDataFromForm(data),
            companyId: selectedCompany,
            projectId: selectedProject,
            buildingId: selectedBuilding,
        };
        
        const batch = writeBatch(db);
        const topLevelUnitRef = doc(collection(db, 'units'));
        
        try {
            const buildingDoc = await getDoc(doc(db, 'buildings', selectedBuilding));
            const buildingData = buildingDoc.data();
            if (!buildingData || !buildingData.originalId) throw new Error("Building original ID not found.");
            
            const floorRefs = await Promise.all(data.floorIds.map(fid => getDoc(doc(db, 'floors', fid))));
            const originalFloorIds = floorRefs.map(f => f.data()?.originalId).filter(Boolean);
            if(originalFloorIds.length !== data.floorIds.length) throw new Error("Could not find original floor IDs for all selected floors.");

            // Add unit to the subcollection of the *first* selected floor
            const subCollectionUnitRef = doc(collection(db, 'projects', selectedProject, 'buildings', buildingData.originalId, 'floors', originalFloorIds[0], 'units'));
            
            batch.set(topLevelUnitRef, { ...unitData, originalId: subCollectionUnitRef.id, createdAt: serverTimestamp() });
            batch.set(subCollectionUnitRef, { ...unitData, topLevelId: topLevelUnitRef.id, createdAt: serverTimestamp() });

            await batch.commit();

            toast({ title: 'Επιτυχία!', description: `Το ακίνητο '${data.name}' δημιουργήθηκε.`});
            await logActivity('CREATE_UNIT', { entityId: topLevelUnitRef.id, entityType: 'unit', name: data.name, projectId: selectedProject });
            
            router.push(`/units/${topLevelUnitRef.id}`);

        } catch (error) {
            console.error("Failed to create new unit:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η δημιουργία απέτυχε. ${error instanceof Error ? error.message : ''}` });
        } finally {
            setIsSubmitting(false);
        }

    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                         <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Επιστροφή
                        </Button>
                        <h1 className="text-2xl font-bold">Δημιουργία Νέου Ακινήτου</h1>
                        <div/>
                    </div>
                    <Card>
                        <CardHeader><CardTitle>Τοποθεσία Ακινήτου</CardTitle><CardDescription>Επιλέξτε που ανήκει το νέο ακίνητο.</CardDescription></CardHeader>
                        <CardContent>
                           <UnitLocationSelector 
                             form={form} 
                             locationState={locationState}
                             isMultiFloorAllowed={isMultiFloorAllowed}
                             onQuickCreate={handleQuickCreate}
                           />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Ανάλυση Εμβαδού (τ.μ.)</CardTitle></CardHeader>
                        <CardContent><AreaInputs control={form.control} /></CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Παροχές</CardTitle></CardHeader>
                        <CardContent><AmenitiesChecklist control={form.control} /></CardContent>
                    </Card>

                    <CardFooter className="justify-end gap-2">
                        <Button variant="ghost" type="button" onClick={() => router.back()}>Ακύρωση</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 animate-spin"/>}
                            Δημιουργία Ακινήτου
                        </Button>
                    </CardFooter>
                </div>
            </form>
        </Form>
    );
}
