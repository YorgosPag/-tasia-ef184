
'use client';

import { UnitLocationSelector } from '@/tasia/components/units/new/UnitLocationSelector';
import { useUnitLocationState } from '@/shared/hooks/useUnitLocationState';
import { useDataStore } from '@/shared/hooks/use-data-store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newUnitSchema, MULTI_FLOOR_TYPES, getUnitDataFromForm } from '@/tasia/lib/unit-helpers';
import type { NewUnitFormValues } from '@/tasia/lib/unit-helpers';
import { AreaInputs } from '@/tasia/components/units/new/AreaInputs';
import { AmenitiesChecklist } from '@/tasia/components/units/new/AmenitiesChecklist';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, ArrowLeft, Save, Wand2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Separator } from '@/shared/components/ui/separator';
import { useAuth } from '@/shared/hooks/use-auth';
import { generateNextUnitIdentifier } from '@/tasia/lib/identifier-generator';
import { addDoc, collection, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { logActivity } from '@/shared/lib/logger';

export default function NewUnitPage() {
    const { companies, projects, buildings } = useDataStore();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingId, setIsGeneratingId] = useState(false);
    const { user } = useAuth();
    
    const form = useForm<NewUnitFormValues>({
        resolver: zodResolver(newUnitSchema),
        defaultValues: {
            floorIds: [],
            identifier: '',
            name: '',
            type: '',
            status: 'Διαθέσιμο',
            amenities: [],
            levelSpan: 0,
        },
    });

    const locationState = useUnitLocationState({ companies, projects, buildings }, form);

    const isMultiFloorAllowed = MULTI_FLOOR_TYPES.includes(form.watch('type'));
    const unitType = form.watch('type');
    const floorIds = form.watch('floorIds');

    const handleQuickCreate = (entity: string) => {
        toast({ title: 'Σημείωση', description: `Η δημιουργία νέου "${entity}" δεν υποστηρίζεται από αυτή τη φόρμα.`});
    }

    const handleGenerateId = async () => {
        if (!floorIds || floorIds.length === 0) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Παρακαλώ επιλέξτε τουλάχιστον έναν όροφο.' });
            return;
        }
        if (!unitType) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Παρακαλώ επιλέξτε τύπο ακινήτου.' });
            return;
        }

        setIsGeneratingId(true);
        try {
            const nextId = await generateNextUnitIdentifier(floorIds[0], unitType, floorIds.length);
            form.setValue('identifier', nextId, { shouldDirty: true });
            form.setValue('name', nextId, { shouldDirty: true });
            toast({ title: 'Επιτυχία', description: `Προτεινόμενος κωδικός: ${nextId}` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: error.message });
        } finally {
            setIsGeneratingId(false);
        }
    };
    
    const onSubmit = async (data: NewUnitFormValues) => {
        setIsSubmitting(true);
        
        const finalData = getUnitDataFromForm(data);
        const { selectedBuilding, selectedProject } = locationState;

        if (!selectedBuilding || !selectedProject || !user) {
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Λείπουν βασικές πληροφορίες (Κτίριο, Έργο, Χρήστης).' });
            setIsSubmitting(false);
            return;
        }

        const buildingInfo = buildings.find(b => b.id === selectedBuilding);
        if (!buildingInfo || !buildingInfo.originalId) {
             toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκαν οι πληροφορίες του κτιρίου.' });
             setIsSubmitting(false);
             return;
        }

        finalData.buildingId = selectedBuilding;
        finalData.projectId = selectedProject;
        finalData.companyId = projects.find(p => p.id === selectedProject)?.companyId;
        finalData.createdAt = serverTimestamp();
        
        try {
            const batch = writeBatch(db);
            const topLevelUnitRef = doc(collection(db, 'units'));

            // Sub-collection logic
            const floorInfo = await Promise.all(data.floorIds.map(async id => {
                const floorDoc = await getDoc(doc(db, 'floors', id));
                return floorDoc.data();
            }));

            if(floorInfo.length > 0 && floorInfo[0]?.originalId) {
                 const firstFloorOriginalId = floorInfo[0].originalId;
                 const subCollectionUnitRef = doc(collection(db, 'projects', selectedProject, 'buildings', buildingInfo.originalId, 'floors', firstFloorOriginalId, 'units'));
                 batch.set(subCollectionUnitRef, { ...finalData, topLevelId: topLevelUnitRef.id });
                 batch.set(topLevelUnitRef, { ...finalData, originalId: subCollectionUnitRef.id });
            } else {
                 batch.set(topLevelUnitRef, { ...finalData, originalId: topLevelUnitRef.id });
            }

            await batch.commit();

            await logActivity('CREATE_UNIT', {
                entityId: topLevelUnitRef.id,
                entityType: 'unit',
                name: finalData.name,
                projectId: selectedProject
            });
            toast({ title: "Επιτυχία", description: `Το ακίνητο "${finalData.name}" δημιουργήθηκε.` });
            router.push(`/units/${topLevelUnitRef.id}`);
        } catch (error: any) {
             console.error("Error creating unit:", error);
             toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η δημιουργία απέτυχε: ${error.message}`});
        } finally {
            setIsSubmitting(false);
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω στα Ακίνητα
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Αποθήκευση
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Δημιουργία Νέου Ακινήτου</CardTitle>
                        <CardDescription>Συμπληρώστε τα παρακάτω πεδία για να δημιουργήσετε ένα νέο ακίνητο.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UnitLocationSelector form={form} locationState={locationState} isMultiFloorAllowed={isMultiFloorAllowed} onQuickCreate={handleQuickCreate} />
                        
                        <Separator className="my-6"/>

                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="identifier" render={({ field }) => (<FormItem><FormLabel>Κωδικός Ακινήτου</FormLabel><div className="flex items-center gap-2"><FormControl><Input {...field} /></FormControl><Button type="button" variant="outline" size="icon" onClick={handleGenerateId} disabled={isGeneratingId}><Wand2 className="h-4 w-4"/></Button></div><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Αναγνωριστικό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        
                         <Separator className="my-6"/>

                         <div>
                            <h3 className="text-lg font-semibold mb-4">Ανάλυση Εμβαδού (τ.μ.)</h3>
                            <AreaInputs control={form.control} />
                        </div>
                        
                         <Separator className="my-6"/>

                         <div>
                            <h3 className="text-lg font-semibold mb-4">Παροχές</h3>
                            <AmenitiesChecklist control={form.control} />
                        </div>

                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
