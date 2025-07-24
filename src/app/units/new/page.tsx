
'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { doc, getDoc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logActivity } from '@/lib/logger';
import { generateNextUnitIdentifier } from '@/lib/identifier-generator';
import { useDataStore } from '@/hooks/use-data-store';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ArrowLeft, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { newUnitSchema, getUnitDataFromForm, AMENITIES_LIST, ORIENTATIONS, KITCHEN_LAYOUTS, MULTI_FLOOR_TYPES } from '@/lib/unit-helpers';
import type { NewUnitFormValues } from '@/lib/unit-helpers';

import { UnitLocationSelector } from '@/components/units/new/UnitLocationSelector';
import { AmenitiesChecklist } from '@/components/units/new/AmenitiesChecklist';
import { AreaInputs } from '@/components/units/new/AreaInputs';
import { useUnitLocationState } from '@/hooks/useUnitLocationState';

export default function NewUnitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { companies, projects, buildings } = useDataStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);

  const form = useForm<NewUnitFormValues>({
    resolver: zodResolver(newUnitSchema),
    defaultValues: {
      floorIds: [], identifier: '', name: '', type: '', status: 'Διαθέσιμο',
      netArea: '', grossArea: '', commonArea: '', semiOutdoorArea: '', architecturalProjectionsArea: '', balconiesArea: '',
      price: '', bedrooms: '1', bathrooms: '', orientation: '', kitchenLayout: '',
      description: '', isPenthouse: false, amenities: [], levelSpan: 1,
    },
  });

  const selectedType = useWatch({ control: form.control, name: 'type' });
  const isMultiFloorAllowed = MULTI_FLOOR_TYPES.includes(selectedType);

  const locationState = useUnitLocationState({ companies, projects, buildings }, form, isMultiFloorAllowed);

  const handleGenerateId = async () => {
    if (!locationState.selectedFloorIds || locationState.selectedFloorIds.length === 0 || !selectedType) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Επιλέξτε τύπο και τουλάχιστον έναν όροφο πρώτα.' });
        return;
    }
    setIsGeneratingId(true);
    try {
        const nextId = await generateNextUnitIdentifier(locationState.selectedFloorIds[0], selectedType, form.getValues('levelSpan'));
        form.setValue('identifier', nextId);
        if (!form.getValues('name')) {
            form.setValue('name', `${selectedType} ${nextId}`);
        }
        toast({ title: 'Επιτυχία', description: `Ο νέος κωδικός είναι: ${nextId}` });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα Δημιουργίας Κωδικού', description: error.message });
    } finally {
        setIsGeneratingId(false);
    }
  };

  const onSubmit = async (data: NewUnitFormValues) => {
    setIsSubmitting(true);
    try {
        const floorDoc = await getDoc(doc(db, 'floors', data.floorIds[0]));
        if(!floorDoc.exists()) throw new Error("Selected floor does not exist.");
        const floorData = floorDoc.data();
        
        const buildingDoc = await getDoc(doc(db, 'buildings', floorData.buildingId));
        if(!buildingDoc.exists()) throw new Error("Parent building does not exist.");
        const buildingData = buildingDoc.data();
        
        const projectDoc = await getDoc(doc(db, 'projects', buildingData.projectId));
        if(!projectDoc.exists()) throw new Error("Parent project does not exist.");
        const projectData = projectDoc.data();
        
        const topLevelUnitRef = doc(collection(db, 'units'));
        
        const unitData = {
          ...getUnitDataFromForm(data),
          buildingId: floorData.buildingId,
          projectId: buildingData.projectId,
          companyId: projectData.companyId,
          createdAt: serverTimestamp(),
          originalId: topLevelUnitRef.id,
        };

        await setDoc(topLevelUnitRef, unitData);

        await logActivity('CREATE_UNIT', {
            entityId: topLevelUnitRef.id, entityType: 'unit', name: data.name, projectId: buildingData.projectId
        });

      toast({ title: 'Επιτυχία', description: 'Το νέο ακίνητο δημιουργήθηκε.' });
      router.push(`/units/${topLevelUnitRef.id}`);

    } catch (error: any) {
      console.error('Error creating new unit: ', error);
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν ήταν δυνατή η δημιουργία του ακινήτου. ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Δημιουργία Νέου Ακινήτου</h1>
            <Button variant="outline" size="sm" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Επιστροφή</Button>
        </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Στοιχεία Ακινήτου</CardTitle>
              <CardDescription>Επιλέξτε την ιεραρχική τοποθεσία και συμπληρώστε τα παρακάτω πεδία.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Collapsible defaultOpen className="space-y-4 rounded-lg border p-4">
                    <CollapsibleTrigger className="font-semibold text-lg w-full text-left">Ιεραρχική Τοποθεσία & Τύπος</CollapsibleTrigger>
                    <CollapsibleContent className="animate-in fade-in-0">
                       <UnitLocationSelector form={form} locationState={locationState} isMultiFloorAllowed={isMultiFloorAllowed} />
                    </CollapsibleContent>
                </Collapsible>
                
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="identifier" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Κωδικός</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input {...field} readOnly placeholder="Δημιουργείται αυτόματα..." /></FormControl>
                            <Button type="button" variant="outline" size="icon" onClick={handleGenerateId} disabled={isGeneratingId || !locationState.selectedFloorIds || locationState.selectedFloorIds.length === 0 || !selectedType} title="Αυτόματη δημιουργία κωδικού"><Wand2 className="h-4 w-4"/></Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Αναγνωριστικό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Κατάσταση</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem><SelectItem value="Προς Ενοικίαση">Προς Ενοικίαση</SelectItem><SelectItem value="Κρατημένο">Κρατημένο</SelectItem><SelectItem value="Πωλημένο">Πωλημένο</SelectItem><SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bedrooms" render={({ field }) => (
                    <FormItem><FormLabel>Υπνοδωμάτια</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε αριθμό..."/></SelectTrigger></FormControl><SelectContent>{[...Array(8).keys()].map(i => (<SelectItem key={i} value={i.toString()}>{i === 0 ? 'Χωρίς υπνοδωμάτιο' : `${i} υπνοδωμάτιο(α)`}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Λουτρά (Περιγραφή)</FormLabel><FormControl><Input placeholder="π.χ. 1 με παράθυρο, 1 WC" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="orientation" render={({ field }) => (<FormItem><FormLabel>Προσανατολισμός</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε προσανατολισμό..."/></SelectTrigger></FormControl><SelectContent>{ORIENTATIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="kitchenLayout" render={({ field }) => (<FormItem><FormLabel>Σαλόνι, Κουζίνα</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}><FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε διαρρύθμιση..."/></SelectTrigger></FormControl><SelectContent>{KITCHEN_LAYOUTS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="isPenthouse" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Ρετιρέ</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
              </div>
              
              <Separator />
              <div>
                <h3 className="text-base font-semibold mb-4">Ανάλυση Εμβαδού (τ.μ.)</h3>
                <AreaInputs control={form.control} />
              </div>

              <Separator />
              <div>
                <h3 className="text-base font-semibold mb-2">Παροχές</h3>
                <AmenitiesChecklist control={form.control} />
              </div>

              <Separator />
              <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Περιγραφή</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <div className="flex justify-end p-6">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Αποθήκευση Ακινήτου
                </Button>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
