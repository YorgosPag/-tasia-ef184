
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, serverTimestamp, doc, getDoc, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/logger';
import { useDataStore, Company, Project, Building } from '@/hooks/use-data-store';
import { generateNextUnitIdentifier } from '@/lib/identifier-generator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { getUnitDataFromForm, AMENITIES_LIST } from '@/lib/unit-helpers';

const newUnitSchema = z.object({
  floorId: z.string().min(1, { message: "Πρέπει να επιλέξετε όροφο." }),
  identifier: z.string().min(1, { message: "Ο κωδικός είναι υποχρεωτικός. Δημιουργήστε τον αυτόματα." }),
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος']),
  area: z.string().optional(),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  orientation: z.string().optional(),
  description: z.string().optional(),
  isPenthouse: z.boolean().default(false),
  amenities: z.array(z.string()).optional(),
  levelSpan: z.number().int().min(1).default(1),
});

type NewUnitFormValues = z.infer<typeof newUnitSchema>;

interface Floor {
    id: string;
    level: string;
    buildingId: string;
}

export default function NewUnitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState(false);
  
  const { companies, projects, buildings, isLoading: isLoadingDataStore } = useDataStore();

  const form = useForm<NewUnitFormValues>({
    resolver: zodResolver(newUnitSchema),
    defaultValues: {
      floorId: '',
      identifier: '',
      name: '',
      type: '',
      status: 'Διαθέσιμο',
      area: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      orientation: '',
      description: '',
      isPenthouse: false,
      amenities: [],
      levelSpan: 1,
    },
  });

  const selectedType = useWatch({ control: form.control, name: 'type' });
  const selectedFloorSpan = useWatch({ control: form.control, name: 'levelSpan'});
  const selectedFloorId = useWatch({ control: form.control, name: 'floorId'});

  const filteredProjects = projects.filter(p => p.companyId === selectedCompany);
  const filteredBuildings = buildings.filter(b => b.projectId === selectedProject);

  useEffect(() => {
    const fetchFloors = async () => {
        if (!selectedBuilding) {
            setFloors([]);
            return;
        }
        setIsLoadingFloors(true);
        const floorsQuery = query(collection(db, 'floors'), where('buildingId', '==', selectedBuilding));
        const floorsSnapshot = await getDocs(floorsQuery);
        setFloors(floorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Floor)));
        setIsLoadingFloors(false);
    }
    fetchFloors();
  }, [selectedBuilding]);

  useEffect(() => { setSelectedProject(''); form.setValue('floorId', ''); }, [selectedCompany, form]);
  useEffect(() => { setSelectedBuilding(''); form.setValue('floorId', ''); }, [selectedProject, form]);
  useEffect(() => { form.setValue('floorId', ''); }, [selectedBuilding, form]);

  const handleGenerateId = async () => {
      if (!selectedFloorId || !selectedType) {
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Επιλέξτε πλήρη ιεραρχία και τύπο ακινήτου πρώτα.' });
          return;
      }
      setIsGeneratingId(true);
      try {
          const nextId = await generateNextUnitIdentifier(selectedFloorId, selectedType, selectedFloorSpan);
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
        const floorDoc = await getDoc(doc(db, 'floors', data.floorId));
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
          floorIds: [data.floorId],
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
                    <CollapsibleTrigger className="font-semibold text-lg w-full text-left">Ιεραρχική Τοποθεσία</CollapsibleTrigger>
                    <CollapsibleContent className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-0">
                        <FormItem><FormLabel>Εταιρεία</FormLabel><Select onValueChange={setSelectedCompany} value={selectedCompany}><SelectTrigger><SelectValue placeholder="Επιλέξτε Εταιρεία..."/></SelectTrigger><SelectContent>{companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></FormItem>
                        <FormItem><FormLabel>Έργο</FormLabel><Select onValueChange={setSelectedProject} value={selectedProject} disabled={!selectedCompany || filteredProjects.length === 0}><SelectTrigger><SelectValue placeholder="Επιλέξτε Έργο..."/></SelectTrigger><SelectContent>{filteredProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent></Select></FormItem>
                        <FormItem><FormLabel>Κτίριο</FormLabel><Select onValueChange={setSelectedBuilding} value={selectedBuilding} disabled={!selectedProject || filteredBuildings.length === 0}><SelectTrigger><SelectValue placeholder="Επιλέξτε Κτίριο..."/></SelectTrigger><SelectContent>{filteredBuildings.map(b => <SelectItem key={b.id} value={b.id}>{b.address}</SelectItem>)}</SelectContent></Select></FormItem>
                        <FormField control={form.control} name="floorId" render={({ field }) => (
                            <FormItem><FormLabel>Όροφος</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBuilding || floors.length === 0}>
                                <SelectTrigger><SelectValue placeholder="Επιλέξτε Όροφο..."/></SelectTrigger>
                                <SelectContent>{isLoadingFloors ? <div className="p-2"><Loader2 className="h-4 w-4 animate-spin"/></div> : floors.map(f => <SelectItem key={f.id} value={f.id}>{f.level}</SelectItem>)}</SelectContent>
                            </Select><FormMessage/></FormItem>
                         )}/>
                    </CollapsibleContent>
                </Collapsible>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε τύπο..."/></SelectTrigger></FormControl><SelectContent><SelectItem value="Διαμέρισμα">Διαμέρισμα</SelectItem><SelectItem value="Στούντιο">Στούντιο</SelectItem><SelectItem value="Γκαρσονιέρα">Γκαρσονιέρα</SelectItem><SelectItem value="Μεζονέτα">Μεζονέτα</SelectItem><SelectItem value="Κατάστημα">Κατάστημα</SelectItem><SelectItem value="Other">Άλλο</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="levelSpan" render={({ field }) => (<FormItem><FormLabel>Αρ. Ορόφων που καταλαμβάνει</FormLabel><FormControl><Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)}/></FormControl><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="identifier" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Κωδικός</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input {...field} readOnly placeholder="Δημιουργείται αυτόματα..." /></FormControl>
                            <Button type="button" variant="outline" size="icon" onClick={handleGenerateId} disabled={isGeneratingId || !selectedFloorId || !selectedType} title="Αυτόματη δημιουργία κωδικού"><Wand2 className="h-4 w-4"/></Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Αναγνωριστικό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Κατάσταση</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem><SelectItem value="Κρατημένο">Κρατημένο</SelectItem><SelectItem value="Πωλημένο">Πωλημένο</SelectItem><SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="area" render={({ field }) => (<FormItem><FormLabel>Εμβαδόν (τ.μ.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bedrooms" render={({ field }) => (<FormItem><FormLabel>Υπνοδωμάτια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Μπάνια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="orientation" render={({ field }) => (<FormItem><FormLabel>Προσανατολισμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="isPenthouse" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel>Ρετιρέ</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
              </div>
              <Separator />
               <div>
                  <FormLabel className="text-base font-semibold">Παροχές</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {AMENITIES_LIST.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
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
