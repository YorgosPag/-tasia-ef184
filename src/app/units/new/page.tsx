
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp, doc, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/logger';
import { useDataStore } from '@/hooks/use-data-store';

const newUnitSchema = z.object({
  identifier: z.string().min(1, { message: "Ο κωδικός είναι υποχρεωτικός." }),
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  floorId: z.string().min(1, { message: "Ο όροφος είναι υποχρεωτικός." }),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος']),
  area: z.string().optional(),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  orientation: z.string().optional(),
  amenities: z.string().optional(),
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
  const [floors, setFloors] = useState<Floor[]>([]);
  const [isLoadingFloors, setIsLoadingFloors] = useState(true);

  const form = useForm<NewUnitFormValues>({
    resolver: zodResolver(newUnitSchema),
    defaultValues: {
      identifier: '',
      name: '',
      floorId: '',
      type: '',
      status: 'Διαθέσιμο',
      area: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      orientation: '',
      amenities: '',
    },
  });

  useEffect(() => {
    const fetchFloors = async () => {
        setIsLoadingFloors(true);
        const floorsSnapshot = await getDocs(collection(db, 'floors'));
        setFloors(floorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Floor)));
        setIsLoadingFloors(false);
    }
    fetchFloors();
  }, []);

  const onSubmit = async (data: NewUnitFormValues) => {
    setIsSubmitting(true);
    try {
        const floorDoc = await getDoc(doc(db, 'floors', data.floorId));
        if(!floorDoc.exists()) {
            throw new Error("Selected floor does not exist.");
        }
        const floorData = floorDoc.data();
        const buildingDoc = await getDoc(doc(db, 'buildings', floorData.buildingId));
        if(!buildingDoc.exists()) {
            throw new Error("Parent building does not exist.");
        }
        const buildingData = buildingDoc.data();
        
        const topLevelUnitRef = doc(collection(db, 'units'));
        
        const unitData = {
            identifier: data.identifier,
            name: data.name,
            type: data.type || '',
            status: data.status,
            area: data.area ? parseFloat(data.area) : undefined,
            price: data.price ? parseFloat(data.price) : undefined,
            bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : undefined,
            bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : undefined,
            orientation: data.orientation || '',
            amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
            floorIds: [data.floorId],
            buildingId: floorData.buildingId,
            projectId: buildingData.projectId,
            createdAt: serverTimestamp(),
            originalId: topLevelUnitRef.id, // In this case, originalId points to self as it's not nested
        };

        await setDoc(topLevelUnitRef, unitData);

        await logActivity('CREATE_UNIT', {
            entityId: topLevelUnitRef.id,
            entityType: 'unit',
            name: data.name,
            projectId: buildingData.projectId
        });

      toast({
        title: 'Επιτυχία',
        description: 'Το νέο ακίνητο δημιουργήθηκε.',
      });
      router.push(`/units/${topLevelUnitRef.id}`);

    } catch (error) {
      console.error('Error creating new unit: ', error);
      toast({
        variant: 'destructive',
        title: 'Σφάλμα',
        description: 'Δεν ήταν δυνατή η δημιουργία του ακινήτου.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Δημιουργία Νέου Ακινήτου
            </h1>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Επιστροφή
            </Button>
        </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Στοιχεία Ακινήτου</CardTitle>
              <CardDescription>Συμπληρώστε τα παρακάτω πεδία. Το ακίνητο πρέπει να ανήκει σε έναν υπάρχοντα όροφο.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="floorId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Όροφος</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Επιλέξτε τον όροφο στον οποίο ανήκει το ακίνητο..." />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {isLoadingFloors ? (
                                <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin"/></div>
                            ) : (
                                floors.map(floor => <SelectItem key={floor.id} value={floor.id}>{`Κτίριο ${floor.buildingId}, Όροφος ${floor.level}`}</SelectItem>)
                            )}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="identifier" render={({ field }) => (<FormItem><FormLabel>Κωδικός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Αναγνωριστικό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Κατάσταση</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem>
                            <SelectItem value="Κρατημένο">Κρατημένο</SelectItem>
                            <SelectItem value="Πωλημένο">Πωλημένο</SelectItem>
                            <SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
              />
              <FormField control={form.control} name="area" render={({ field }) => (<FormItem><FormLabel>Εμβαδόν (τ.μ.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="bedrooms" render={({ field }) => (<FormItem><FormLabel>Υπνοδωμάτια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Μπάνια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="orientation" render={({ field }) => (<FormItem><FormLabel>Προσανατολισμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="md:col-span-2">
                <FormField control={form.control} name="amenities" render={({ field }) => (<FormItem><FormLabel>Παροχές (με κόμμα)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
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
