'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Unit } from '@/hooks/use-unit-details';

export const unitSchema = z.object({
  identifier: z.string().min(1, 'Το αναγνωριστικό είναι υποχρεωτικό.'),
  name: z.string().min(1, 'Το όνομα είναι υποχρεωτικό.'),
  type: z.string().min(1, 'Ο τύπος είναι υποχρεωτικός.'),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος', 'Προς Ενοικίαση']),
  polygonPoints: z.string().optional(),
  existingUnitId: z.string().optional(), // For assigning polygon to an existing unit
  area: z.string().optional(),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  orientation: z.string().optional(),
  amenities: z.string().optional(),
});

export type UnitFormValues = z.infer<typeof unitSchema>;

interface UnitDialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<UnitFormValues>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingUnit: Unit | null;
  drawingPolygon: { x: number; y: number }[] | null;
  availableUnits: Unit[];
}

export function UnitDialogForm({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  editingUnit,
  drawingPolygon,
  availableUnits,
}: UnitDialogFormProps) {
  const isAssigningPolygon = drawingPolygon && !editingUnit;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingUnit ? 'Επεξεργασία' : (isAssigningPolygon ? 'Ανάθεση Πολυγώνου' : 'Νέο')} Ακινήτου</DialogTitle>
           {isAssigningPolygon && <DialogDescription>Αναθέστε το σχήμα που σχεδιάσατε σε ένα υπάρχον ακίνητο ή δημιουργήστε ένα νέο.</DialogDescription>}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
             {isAssigningPolygon && (
                <FormField control={form.control} name="existingUnitId" render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="new">-- Δημιουργία Νέου Ακινήτου --</SelectItem>
                                {availableUnits.map(unit => (
                                    <SelectItem key={unit.id} value={unit.id}>{unit.name} ({unit.identifier})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                    </FormItem>
                )}/>
             )}

            {(form.watch('existingUnitId') === 'new' || editingUnit) && (
              <>
                <FormField control={form.control} name="identifier" render={({ field }) => (<FormItem><FormLabel>Αναγνωριστικό</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Τύπος</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Κατάσταση</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Διαθέσιμο">Διαθέσιμο</SelectItem>
                            <SelectItem value="Κρατημένο">Κρατημένο</SelectItem>
                            <SelectItem value="Πωλημένο">Πωλημένο</SelectItem>
                            <SelectItem value="Οικοπεδούχος">Οικοπεδούχος</SelectItem>
                             <SelectItem value="Προς Ενοικίαση">Προς Ενοικίαση</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage/>
                    </FormItem>
                )}/>
              </>
            )}
             <FormField control={form.control} name="polygonPoints" render={({ field }) => (
                <FormItem>
                    <FormLabel>Συντεταγμένες Πολυγώνου</FormLabel>
                    <FormControl>
                        <Textarea {...field} rows={5} />
                    </FormControl>
                    <FormDescription>Συντεταγμένες σε μορφή JSON. Επεξεργαστείτε με προσοχή.</FormDescription>
                    <FormMessage/>
                </FormItem>
             )}/>
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 animate-spin"/>}
                Αποθήκευση
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
