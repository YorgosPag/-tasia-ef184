
'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc, arrayUnion, arrayRemove, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Unit } from '@/hooks/use-unit-details';

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

const ContractStageForm = ({ control, name, title }: { control: any, name: string, title: string }) => (
    <div className="space-y-4 rounded-md border p-4">
        <h4 className="font-semibold">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={control} name={`${name}.contractNumber`} render={({ field }) => (<FormItem><FormLabel>Αριθμός Συμβολαίου</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name={`${name}.contractDate`} render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Ημερ. Συμβολαίου</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Επιλογή ημερομηνίας</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
            <FormField control={control} name={`${name}.contractFileUrl`} render={({ field }) => (<FormItem><FormLabel>Αρχείο Συμβολαίου (URL)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name={`${name}.notary`} render={({ field }) => (<FormItem><FormLabel>Συμβολαιογράφος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={control} name={`${name}.lawyer`} render={({ field }) => (<FormItem><FormLabel>Δικηγόρος</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
    </div>
);


export function UnitContractsTab({ unit }: UnitContractsTabProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contracts: unit.contracts || [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
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

  const addNewContract = () => {
    append({
        id: doc(collection(db, 'dummy')).id, // Generate a unique ID client-side
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
                    <AccordionTrigger>
                        <div className="flex justify-between w-full items-center pr-4">
                            <span>Πελάτης: {form.watch(`contracts.${index}.clientName`) || '(Χωρίς όνομα)'}</span>
                            <Button variant="ghost" size="icon" className="hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); remove(index); }}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-2">
                        <FormField control={form.control} name={`contracts.${index}.clientName`} render={({ field }) => (<FormItem><FormLabel>Πελάτης</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        
                        <ContractStageForm control={form.control} name={`contracts.${index}.preliminary`} title="Προσύμφωνο" />
                        <ContractStageForm control={form.control} name={`contracts.${index}.final`} title="Οριστικό Συμβόλαιο" />
                        <ContractStageForm control={form.control} name={`contracts.${index}.settlement`} title="Εξοφλητικό Συμβόλαιο" />
                        
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
