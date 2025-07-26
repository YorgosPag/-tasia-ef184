
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, storage } from '@/shared/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/tasia/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, PlusCircle, Trash2, Upload, Eye } from 'lucide-react';
import { Unit } from '@/tasia/hooks/use-unit-details';
import { Contact } from '@/tasia/app/contacts/page';


const contractStageSchema = z.object({
  contractNumber: z.string().optional(),
  contractDate: z.date().optional().nullable(),
  contractFileUrl: z.string().url().or(z.literal('')).optional(),
  notary: z.string().optional(),
  lawyer: z.string().optional(),
});

const unitContractSchema = z.object({
  id: z.string().optional(),
  clientName: z.string().min(1, 'Το όνομα πελάτη είναι υποχρεωτικό.'),
  status: z.string().optional(),
  preliminary: contractStageSchema.optional(),
  final: contractStageSchema.optional(),
  settlement: contractStageSchema.optional(),
  registeredBy: z.string().optional(),
});

export type UnitContract = z.infer<typeof unitContractSchema>;

const formSchema = z.object({
  contracts: z.array(unitContractSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface UnitContractsTabProps {
  unit: Unit;
}

const ContractStageForm = ({ control, name, title, contacts, onFileUpload }: { control: any, name: string, title: string, contacts: Contact[], onFileUpload: (field: string, file: File) => void }) => {
    const [isUploading, setIsUploading] = useState(false);
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            await onFileUpload(`${name}.contractFileUrl`, file);
            setIsUploading(false);
        }
    }
    
    const fileUrl = control.getValues(`${name}.contractFileUrl`);
    
    return (
        <div className="space-y-4 rounded-md border p-4">
            <h4 className="font-semibold">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={control} name={`${name}.contractNumber`} render={({ field }) => (<FormItem><FormLabel>Αριθμός Συμβολαίου</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={control} name={`${name}.contractDate`} render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Ημερ. Συμβολαίου</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Επιλογή ημερομηνίας</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                
                <FormField control={control} name={`${name}.notary`} render={({ field }) => (<FormItem><FormLabel>Συμβολαιογράφος</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε επαφή..."/></SelectTrigger></FormControl><SelectContent>{contacts.filter(c => c.type === 'Notary').map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={control} name={`${name}.lawyer`} render={({ field }) => (<FormItem><FormLabel>Δικηγόρος</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε επαφή..."/></SelectTrigger></FormControl><SelectContent>{contacts.filter(c => c.type === 'Lawyer').map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                
                <FormItem className="col-span-full">
                    <FormLabel>Αρχείο Συμβολαίου (PDF)</FormLabel>
                    <div className="flex items-center gap-2">
                         <Input type="file" accept=".pdf" className="text-xs h-9" onChange={handleFileChange} disabled={isUploading}/>
                         {fileUrl && <Button type="button" variant="ghost" size="icon" onClick={() => window.open(fileUrl, '_blank')}><Eye className="h-4 w-4" /></Button>}
                         {isUploading && <Loader2 className="h-4 w-4 animate-spin"/>}
                    </div>
                </FormItem>
            </div>
        </div>
    );
};


export function UnitContractsTab({ unit }: UnitContractsTabProps) {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
        // Querying for both types at once would require a composite index.
        // It's better to make two separate queries.
        const notaryQuery = query(collection(db, 'contacts'), where('type', '==', 'Notary'), orderBy('name'));
        const lawyerQuery = query(collection(db, 'contacts'), where('type', '==', 'Lawyer'), orderBy('name'));
        
        const [notarySnapshot, lawyerSnapshot] = await Promise.all([getDocs(notaryQuery), getDocs(lawyerQuery)]);
        
        const notaries = notarySnapshot.docs.map(d => ({id: d.id, ...d.data()} as Contact));
        const lawyers = lawyerSnapshot.docs.map(d => ({id: d.id, ...d.data()} as Contact));

        setContacts([...notaries, ...lawyers]);
    }
    fetchContacts();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contracts: unit.contracts || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contracts',
    keyName: 'fieldId',
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const unitRef = doc(db, 'units', unit.id);
      await updateDoc(unitRef, { contracts: data.contracts });
      toast({ title: 'Επιτυχία', description: 'Τα συμβόλαια αποθηκεύτηκαν.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η αποθήκευση απέτυχε: ${error.message}` });
    }
  };

  const handleFileUpload = async (field: string, file: File) => {
    const storageRef = ref(storage, `unit_contracts/${unit.id}/${file.name}`);
    try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        form.setValue(field as any, downloadURL, { shouldDirty: true });
        toast({ title: 'Επιτυχία', description: 'Το αρχείο ανέβηκε.' });
    } catch(error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: `Το ανέβασμα απέτυχε: ${error.message}` });
    }
  }

  const addNewContract = () => {
    append({
        id: doc(collection(db, 'dummy')).id,
        clientName: '',
        status: 'Προσύμφωνο',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
             <CardTitle>Συμβόλαια Ακινήτου</CardTitle>
             <Button type="button" size="sm" onClick={addNewContract}>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Νέο Συμβόλαιο
            </Button>
        </div>
        <CardDescription>
          Διαχειριστείτε τα συμβόλαια που σχετίζονται με την πώληση αυτού του ακινήτου.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fields.length > 0 ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Accordion type="multiple" defaultValue={fields.map(f => f.id || '')}>
                {fields.map((field, index) => (
                  <AccordionItem key={field.fieldId} value={field.id || `contract-${index}`}>
                     <div className="flex w-full items-center">
                        <AccordionTrigger className="flex-1">
                            <span>Πελάτης: {form.watch(`contracts.${index}.clientName`) || '(Χωρίς όνομα)'}</span>
                        </AccordionTrigger>
                        <Button variant="ghost" size="icon" className="hover:bg-destructive/10 shrink-0" onClick={(e) => { e.stopPropagation(); remove(index); }}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    </div>
                    <AccordionContent className="space-y-4 p-2">
                        <FormField control={form.control} name={`contracts.${index}.clientName`} render={({ field }) => (<FormItem><FormLabel>Πελάτης</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        
                        <ContractStageForm control={form.control} name={`contracts.${index}.preliminary`} title="Προσύμφωνο" contacts={contacts} onFileUpload={handleFileUpload} />
                        <ContractStageForm control={form.control} name={`contracts.${index}.final`} title="Οριστικό Συμβόλαιο" contacts={contacts} onFileUpload={handleFileUpload} />
                        <ContractStageForm control={form.control} name={`contracts.${index}.settlement`} title="Εξοφλητικό Συμβόλαιο" contacts={contacts} onFileUpload={handleFileUpload} />
                        
                        <FormField control={form.control} name={`contracts.${index}.registeredBy`} render={({ field }) => (<FormItem><FormLabel>Καταχωρήθηκε από</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
               <div className="flex justify-end pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Αποθήκευση Συμβολαίων
                </Button>
              </div>

            </form>
          </Form>
        ) : (
            <div className="text-center py-12 text-muted-foreground">
                <p>Δεν υπάρχουν συμβόλαια για αυτό το ακίνητο.</p>
                <Button variant="secondary" className="mt-4" onClick={addNewContract}>Προσθήκη Πρώτου Συμβολαίου</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
