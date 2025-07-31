
'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Building, BuildingFormValues } from '@/lib/types/project-types';


// Schema for the building form
export const buildingSchema = z.object({
  id: z.string().optional(), // Hidden field to know if we are editing
  address: z.string().min(1, { message: 'Η διεύθυνση είναι υποχρεωτική.' }),
  type: z.string().min(1, { message: 'Ο τύπος είναι υποχρεωτικός.' }),
  description: z.string().optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')),
  floorsCount: z.coerce.number().int().positive().optional(),
  constructionYear: z.coerce.number().int().min(1900).max(new Date().getFullYear() + 5).optional(),
  tags: z.string().optional(),
  identifier: z.string().min(1, 'Ο κωδικός κτιρίου είναι υποχρεωτικός.'),
});



interface BuildingFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: UseFormReturn<BuildingFormValues>;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    editingBuilding: Building | null;
}

export function BuildingFormDialog({
    open,
    onOpenChange,
    form,
    onSubmit,
    isSubmitting,
    editingBuilding,
}: BuildingFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingBuilding ? 'Επεξεργασία' : 'Προσθήκη Νέου'} Κτιρίου</DialogTitle>
                    <DialogDescription>Συμπληρώστε τις πληροφορίες για το κτίριο του έργου.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="grid max-h-[80vh] gap-4 overflow-y-auto py-4 pr-4">
                        <FormField control={form.control} name="identifier" render={({ field }) => (<FormItem><FormLabel>Κωδικός Κτιρίου</FormLabel><FormControl><Input placeholder="π.χ. Α, Β, W1" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Διεύθυνση</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="floorsCount" render={({ field }) => (<FormItem><FormLabel>Αρ. Ορόφων</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}/></FormControl><FormMessage/></FormItem>)}/>
                            <FormField control={form.control} name="constructionYear" render={({ field }) => (<FormItem><FormLabel>Έτος Κατασκευής</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}/></FormControl><FormMessage/></FormItem>)}/>
                        </div>
                        <FormField control={form.control} name="photoUrl" render={({ field }) => (<FormItem><FormLabel>URL Φωτογραφίας</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="tags" render={({ field }) => (<FormItem><FormLabel>Tags (με κόμμα)</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Περιγραφή</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}{editingBuilding ? 'Αποθήκευση' : 'Προσθήκη'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
