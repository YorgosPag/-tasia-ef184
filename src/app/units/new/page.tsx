
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
import { useDataStore } from '@/hooks/use-data-store';
import { generateNextUnitIdentifier } from '@/lib/identifier-generator';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { getUnitDataFromForm, AMENITIES_LIST, ORIENTATIONS, KITCHEN_LAYOUTS } from '@/lib/unit-helpers';
import { MultiSelect } from '@/components/ui/multi-select';

const newUnitSchema = z.object({
  floorIds: z.array(z.string()).nonempty({ message: "Πρέπει να επιλέξετε τουλάχιστον έναν όροφο." }),
  identifier: z.string().min(1, { message: "Ο κωδικός είναι υποχρεωτικός. Δημιουργήστε τον αυτόματα." }),
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  type: z.string().min(1, { message: "Ο τύπος είναι υποχρεωτικός." }),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος', 'Προς Ενοικίαση']),
  
  // Area fields
  netArea: z.string().optional(),
  grossArea: z.string().optional(),
  commonArea: z.string().optional(),
  semiOutdoorArea: z.string().optional(),
  architecturalProjectionsArea: z.string().optional(),
  balconiesArea: z.string().optional(),

  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  orientation: z.string().optional(),
  kitchenLayout: z.string().optional(),
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

const MULTI_FLOOR_TYPES = ['Μεζονέτα', 'Κατάστημα'];

export default function NewUnitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [floors, setFloors] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState(false);
  
  const { companies, projects, buildings } = useDataStore();

  const form = useForm<NewUnitFormValues>({
    resolver: zodResolver(newUnitSchema),
    defaultValues: {
      floorIds: [],
      identifier: '',
      name: '',
      type: '',
      status: 'Διαθέσιμο',
      netArea: '',
      grossArea: '',
      commonArea: '',
      semiOutdoorArea: '',
      architecturalProjectionsArea: '',
      balconiesArea: '',
      price: '',
      bedrooms: '1',
      bathrooms: '',
      orientation: '',
      kitchenLayout: '',
      description: '',
      isPenthouse: false,
      amenities: [],
      levelSpan: 1,
    },
  });

  const selectedType = useWatch({ control: form.control, name: 'type' });
  const selectedFloorIds = useWatch({ control: form.control, name: 'floorIds'});
  const levelSpan = useWatch({ control: form.control, name: 'levelSpan' });

  const isMultiFloorAllowed = MULTI_FLOOR_TYPES.includes(selectedType);

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
        const fetchedFloors = floorsSnapshot.docs.map(doc => ({ value: doc.id, label: doc.data().level } as { value: string; label: string }));
        
        // Sort floors client-side
        fetchedFloors.sort((a, b) => {
            const levelA = parseInt(a.label, 10);
            const levelB = parseInt(b.label, 10);
            if (!isNaN(levelA) && !isNaN(levelB)) {
                return levelA - levelB;
            }
            return a.label.localeCompare(b.label, undefined, { numeric: true });
        });

        setFloors(fetchedFloors);
        setIsLoadingFloors(false);
    }
    fetchFloors();
  }, [selectedBuilding]);

  // Reset dependent fields on change
  useEffect(() => { setSelectedProject(''); form.setValue('floorIds', []); }, [selectedCompany, form]);
  useEffect(() => { setSelectedBuilding(''); form.setValue('floorIds', []); }, [selectedProject, form]);
  
  // Reset floor selection when type changes to ensure valid state
  useEffect(() => {
    if (form.getValues('floorIds').length > 0) {
        form.setValue('floorIds', []);
    }
  }, [selectedType, form]);
  
  useEffect(() => {
    form.setValue('levelSpan', selectedFloorIds?.length || 1);
  }, [selectedFloorIds, form]);


  const handleGenerateId = async () => {
      if (!selectedFloorIds || selectedFloorIds.length === 0 || !selectedType) {
          toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Επιλέξτε τύπο και τουλάχιστον έναν όροφο πρώτα.' });
          return;
      }
      setIsGeneratingId(true);
      try {
          const nextId = await generateNextUnitIdentifier(selectedFloorIds[0], selectedType, levelSpan);
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
                    <CollapsibleContent className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-0">
                        <FormItem><FormLabel>Εταιρεία</FormLabel><Select onValueChange={setSelectedCompany} value={selectedCompany}><SelectTrigger><SelectValue placeholder="Επιλέξτε Εταιρεία..."/></SelectTrigger><SelectContent>{companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></FormItem>
                        <FormItem><FormLabel>Έργο</FormLabel><Select onValueChange={setSelectedProject} value={selectedProject} disabled={!selectedCompany || filteredProjects.length === 0}><SelectTrigger><SelectValue placeholder="Επιλέξτε Έργο..."/></SelectTrigger><SelectContent>{filteredProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent></Select></FormItem>
                        <FormItem><FormLabel>Κτίριο</FormLabel><Select onValueChange={setSelectedBuilding} value={selectedBuilding} disabled={!selectedProject || filteredBuildings.length === 0}><SelectTrigger><SelectValue placeholder="Επιλέξτε Κτίριο..."/></SelectTrigger><SelectContent>{filteredBuildings.map(b => <SelectItem key={b.id} value={b.id}>{b.address}</SelectItem>)}</SelectContent></Select></FormItem>
                        <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={!selectedBuilding}><FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε τύπο..."/></SelectTrigger></FormControl><SelectContent><SelectItem value="Διαμέρισμα">Διαμέρισμα</SelectItem><SelectItem value="Στούντιο">Στούντιο</SelectItem><SelectItem value="Γκαρσονιέρα">Γκαρσονιέρα</SelectItem><SelectItem value="Μεζονέτα">Μεζονέτα</SelectItem><SelectItem value="Κατάστημα">Κατάστημα</SelectItem><SelectItem value="Other">Άλλο</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        
                        {isMultiFloorAllowed ? (
                             <FormField control={form.control} name="floorIds" render={({ field }) => (
                                <FormItem><FormLabel>Όροφοι</FormLabel>
                                <MultiSelect
                                    options={floors}
                                    selected={field.value}
                                    onChange={field.onChange}
                                    placeholder="Επιλέξτε ορόφους..."
                                    disabled={!selectedType || floors.length === 0}
                                    isLoading={isLoadingFloors}
                                />
                                <FormMessage/></FormItem>
                             )}/>
                        ) : (
                            <FormField control={form.control} name="floorIds" render={({ field }) => (
                                <FormItem><FormLabel>Όροφος</FormLabel>
                                <Select onValueChange={(value) => field.onChange(value ? [value] : [])} value={field.value?.[0] || ''} disabled={!selectedType || floors.length === 0}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε όροφο..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {isLoadingFloors ? (
                                             <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
                                        ) : (
                                            floors.map(floor => <SelectItem key={floor.value} value={floor.value}>{floor.label}</SelectItem>)
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage /></FormItem>
                             )}/>
                        )}

                        <FormField
                          control={form.control}
                          name="levelSpan"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Πλήθος επιλεγμένων ορόφων</FormLabel>
                              <FormControl>
                                <Input type="number" readOnly value={field.value} className="bg-muted" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </CollapsibleContent>
                </Collapsible>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="identifier" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Κωδικός</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormControl><Input {...field} readOnly placeholder="Δημιουργείται αυτόματα..." /></FormControl>
                            <Button type="button" variant="outline" size="icon" onClick={handleGenerateId} disabled={isGeneratingId || !selectedFloorIds || selectedFloorIds.length === 0 || !selectedType} title="Αυτόματη δημιουργία κωδικού"><Wand2 className="h-4 w-4"/></Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Αναγνωριστικό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Κατάσταση</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem><SelectItem value="Προς Ενοικίαση">Προς Ενοικίαση</SelectItem><SelectItem value="Κρατημένο">Κρατημένο</SelectItem><SelectItem value="Πωλημένο">Πωλημένο</SelectItem><SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Υπνοδωμάτια</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε αριθμό..."/></SelectTrigger></FormControl>
                          <SelectContent>
                              {[...Array(8).keys()].map(i => (
                                  <SelectItem key={i} value={i.toString()}>{i === 0 ? 'Χωρίς υπνοδωμάτιο' : `${i} υπνοδωμάτιο(α)`}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Λουτρά (Περιγραφή)</FormLabel><FormControl><Input placeholder="π.χ. 1 με παράθυρο, 1 WC" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="orientation" render={({ field }) => (
                    <FormItem><FormLabel>Προσανατολισμός</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε προσανατολισμό..."/></SelectTrigger></FormControl>
                            <SelectContent>{ORIENTATIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="kitchenLayout" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Σαλόνι, Κουζίνα</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε διαρρύθμιση..."/></SelectTrigger></FormControl>
                            <SelectContent>{KITCHEN_LAYOUTS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="isPenthouse" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5"><FormLabel>Ρετιρέ</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
              </div>
              
              <Separator />
               <div>
                    <h3 className="text-base font-semibold mb-4">Ανάλυση Εμβαδού (τ.μ.)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="netArea" render={({ field }) => (<FormItem><FormLabel>Καθαρά</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="grossArea" render={({ field }) => (<FormItem><FormLabel>Μικτά</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="commonArea" render={({ field }) => (<FormItem><FormLabel>Κοινόχρηστα</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="semiOutdoorArea" render={({ field }) => (<FormItem><FormLabel>Ημιυπαίθριοι</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="architecturalProjectionsArea" render={({ field }) => (<FormItem><FormLabel>Αρχ. Προεξοχές</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="balconiesArea" render={({ field }) => (<FormItem><FormLabel>Μπαλκόνια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </div>

              <Separator />
               <div>
                  <h3 className="text-base font-semibold mb-2">Παροχές</h3>
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
