
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  Timestamp,
  writeBatch,
  query,
  where,
  deleteDoc,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Home, BedDouble, Bath, Compass, Tag, Euro, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { logActivity } from '@/lib/logger';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const attachmentSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['parking', 'storage'], { required_error: 'Ο τύπος είναι υποχρεωτικός.' }),
  details: z.string().optional(),
  area: z.string().transform(v => v.trim()).refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Το εμβαδόν πρέπει να είναι αριθμός." }).optional(),
  price: z.string().transform(v => v.trim()).refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Η τιμή πρέπει να είναι αριθμός." }).optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')).optional(),
  sharePercentage: z.string().transform(v => v.trim()).refine(val => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), { message: "Το ποσοστό πρέπει να είναι θετικός αριθμός." }).optional(),
  isBundle: z.boolean().default(false),
  isStandalone: z.boolean().default(false),
});

const unitSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  name: z.string().min(1, "Name is required"),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος']),
  area: z.string().optional(),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  orientation: z.string().optional(),
  amenities: z.string().optional(),
  attachments: z.array(attachmentSchema).optional(),
});

type UnitFormValues = z.infer<typeof unitSchema>;
type AttachmentFormValues = z.infer<typeof attachmentSchema>;

interface Unit {
  id: string;
  identifier: string;
  name: string;
  type?: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
  buildingId: string;
  floorIds: string[];
  levelSpan?: string;
  originalId: string;
  createdAt: Timestamp;
  area?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  orientation?: string;
  amenities?: string[];
}

export default function UnitDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params.id as string;
  const { toast } = useToast();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      identifier: '',
      name: '',
      attachments: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "attachments",
  });
  
  const attachments = useWatch({
      control: form.control,
      name: 'attachments'
  });

  // Fetch unit details and attachments
  useEffect(() => {
    if (!unitId) return;
    
    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const unitDocRef = doc(db, 'units', unitId);
            const unitDocSnap = await getDoc(unitDocRef);

            if (!unitDocSnap.exists()) {
              toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Το ακίνητο δεν βρέθηκε.' });
              router.push('/units');
              return;
            }

            const unitData = { id: unitDocSnap.id, ...unitDocSnap.data() } as Unit;
            setUnit(unitData);

            const attachmentsQuery = query(collection(db, 'attachments'), where('unitId', '==', unitId));
            const attachmentsSnapshot = await getDocs(attachmentsQuery);
            const attachmentsData = attachmentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AttachmentFormValues));

            form.reset({
              identifier: unitData.identifier,
              name: unitData.name,
              type: unitData.type || '',
              status: unitData.status,
              area: unitData.area?.toString() || '',
              price: unitData.price?.toString() || '',
              bedrooms: unitData.bedrooms?.toString() || '',
              bathrooms: unitData.bathrooms?.toString() || '',
              orientation: unitData.orientation || '',
              amenities: unitData.amenities?.join(', ') || '',
              attachments: attachmentsData,
            });

        } catch (error) {
            console.error("Error fetching unit details:", error);
            toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Failed to load unit data.' });
        } finally {
            setIsLoading(false);
        }
    };
    fetchAllData();
  }, [unitId, router, toast, form]);

  const onSubmit = async (data: UnitFormValues) => {
    if (!unit) return;
    setIsSubmitting(true);
    const batch = writeBatch(db);
    
    // --- 1. Update Unit ---
    const unitDocRef = doc(db, 'units', unit.id);
    const unitDataToUpdate = {
        ...getUnitDataFromForm(data),
    };
    batch.update(unitDocRef, unitDataToUpdate);
    
    // --- 2. Handle Attachments ---
    // First, find attachments that were removed in the form
    const formAttachmentIds = new Set(data.attachments?.map(a => a.id).filter(Boolean));
    const initialAttachments = (form.formState.defaultValues.attachments || []);
    for (const initialAtt of initialAttachments) {
        if (initialAtt.id && !formAttachmentIds.has(initialAtt.id)) {
            // This attachment was removed, delete it
            batch.delete(doc(db, 'attachments', initialAtt.id));
        }
    }

    // Then, iterate through form attachments to add or update
    data.attachments?.forEach(formData => {
        const finalAttData: any = {
            ...getAttachmentDataFromForm(formData),
            unitId: unit.id, // Ensure it's linked
            bundleUnitId: formData.isBundle ? unit.id : undefined,
        };
        Object.keys(finalAttData).forEach(key => finalAttData[key] === undefined && delete finalAttData[key]);

        if(formData.id) {
            // Update existing attachment
            batch.update(doc(db, 'attachments', formData.id), finalAttData);
        } else {
            // Create new attachment
            const newAttRef = doc(collection(db, 'attachments'));
            batch.set(newAttRef, {...finalAttData, createdAt: serverTimestamp()});
        }
    });

    try {
        await batch.commit();
        toast({ title: 'Επιτυχία', description: 'Οι αλλαγές στο ακίνητο αποθηκεύτηκαν.' });
        await logActivity('UPDATE_UNIT', {
          entityId: unit.id,
          entityType: 'unit',
          changes: data,
        });
    } catch (error) {
        console.error("Failed to save unit and attachments:", error);
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η αποθήκευση απέτυχε.' });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const getUnitDataFromForm = (data: UnitFormValues) => {
    return {
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
    };
  };

  const getAttachmentDataFromForm = (data: AttachmentFormValues) => {
      return {
         type: data.type,
         details: data.details,
         area: data.area ? parseFloat(data.area) : undefined,
         price: data.price ? parseFloat(data.price) : undefined,
         sharePercentage: data.sharePercentage ? parseFloat(data.sharePercentage) : undefined,
         isBundle: data.isBundle,
         isStandalone: data.isStandalone,
         photoUrl: data.photoUrl?.trim() || undefined,
     };
  };

  const getStatusClass = (status: Unit['status'] | undefined) => {
      switch(status) {
          case 'Πωλημένο': return 'bg-red-500 hover:bg-red-600 text-white';
          case 'Κρατημένο': return 'bg-blue-500 hover:bg-blue-600 text-white';
          case 'Διαθέσιμο': return 'bg-green-500 hover:bg-green-600 text-white';
          case 'Οικοπεδούχος': return 'bg-orange-500 hover:bg-orange-600 text-white';
          default: return 'bg-gray-500 hover:bg-gray-600 text-white';
      }
  }

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'N/A';
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(price);
  }

  const UnitStat = ({ icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined}) => {
    if (value === undefined || value === null || value === '') return null;
    const IconComponent = icon;
    return (
        <div className="flex items-center gap-2 text-sm">
            <IconComponent className="h-5 w-5 text-muted-foreground" />
            <div>
                <p className="font-semibold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
  };
  
  if (isLoading || !unit) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-16 w-16 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                 <Button variant="outline" size="sm" className="w-fit" type="button" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" />Επιστροφή</Button>
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Αποθήκευση Αλλαγών
                 </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Επεξεργασία Ακινήτου: {unit.name} ({unit.identifier})</CardTitle>
                            <CardDescription>
                                Τύπος: {unit.type || 'N/A'} | 
                                {unit.levelSpan ? ` Όροφοι: ${unit.levelSpan}` : ` ID Ορόφου: ${unit.floorIds?.join(', ')}`}
                            </CardDescription>
                        </div>
                         <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={`w-[180px] ${getStatusClass(field.value)}`}>
                                                <SelectValue placeholder="Επιλέξτε κατάσταση" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem>
                                            <SelectItem value="Κρατημένο">Κρατημένο</SelectItem>
                                            <SelectItem value="Πωλημένο">Πωλημένο</SelectItem>
                                            <SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                         />
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="identifier" render={({ field }) => (<FormItem><FormLabel>Κωδικός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα/Αναγνωριστικό</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="orientation" render={({ field }) => (<FormItem><FormLabel>Προσανατολισμός</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="area" render={({ field }) => (<FormItem><FormLabel>Εμβαδόν (τ.μ.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (<FormItem><FormLabel>Υπνοδωμάτια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="bathrooms" render={({ field }) => (<FormItem><FormLabel>Μπάνια</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <div className="md:col-span-2">
                        <FormField control={form.control} name="amenities" render={({ field }) => (<FormItem><FormLabel>Παροχές (με κόμμα)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                     </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Παρακολουθήματα</CardTitle>
                        <Button type="button" size="sm" variant="outline" onClick={() => append({ type: 'parking', details: '', area: '', price: '', photoUrl: '', sharePercentage: '', isBundle: true, isStandalone: false })}>
                            <PlusCircle className="mr-2" />
                            Προσθήκη
                        </Button>
                    </div>
                    <CardDescription>Διαχειριστείτε τις θέσεις στάθμευσης, αποθήκες κ.λπ. που συνδέονται με αυτό το ακίνητο.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name={`attachments.${index}.type`} render={({ field }) => (
                                    <FormItem><FormLabel>Τύπος</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="parking">Θέση Στάθμευσης</SelectItem>
                                            <SelectItem value="storage">Αποθήκη</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={form.control} name={`attachments.${index}.details`} render={({ field }) => (<FormItem><FormLabel>Λεπτομέρειες</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name={`attachments.${index}.area`} render={({ field }) => (<FormItem><FormLabel>Εμβαδόν (τ.μ.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name={`attachments.${index}.price`} render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name={`attachments.${index}.sharePercentage`} render={({ field }) => (<FormItem><FormLabel>Ποσοστό (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </div>
                             <div className="flex items-center space-x-4 rounded-md border p-4">
                                <FormField control={form.control} name={`attachments.${index}.isBundle`} render={({ field }) => (<FormItem className="flex flex-row items-center justify-between w-full"><div className="space-y-0.5"><FormLabel>Πακέτο με το Unit</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
                                <FormField control={form.control} name={`attachments.${index}.isStandalone`} render={({ field }) => (<FormItem className="flex flex-row items-center justify-between w-full"><div className="space-y-0.5"><FormLabel>Ανεξάρτητο</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
                             </div>
                        </div>
                    ))}
                    {fields.length === 0 && (
                        <p className="text-sm text-center text-muted-foreground py-8">Δεν υπάρχουν παρακολουθήματα για αυτό το ακίνητο.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </form>
    </Form>
  );
}

    