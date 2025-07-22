
'use client';

import React from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';

const numberFromString = z.string().transform((val, ctx) => {
  const parsed = parseFloat(val);
  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Πρέπει να είναι αριθμός.',
    });
    return z.NEVER;
  }
  return parsed;
});

export const unitSchema = z.object({
  existingUnitId: z.string().optional(),
  identifier: z.string(),
  name: z.string(),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος']),
  polygonPoints: z.string().optional(),
  area: z.string().refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Το εμβαδόν πρέπει να είναι αριθμός." }).optional(),
  price: z.string().refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Η τιμή πρέπει να είναι αριθμός." }).optional(),
  bedrooms: z.string().refine(val => val === '' || !isNaN(parseInt(val, 10)), { message: "Πρέπει να είναι ακέραιος αριθμός." }).optional(),
  bathrooms: z.string().refine(val => val === '' || !isNaN(parseInt(val, 10)), { message: "Πρέπει να είναι ακέραιος αριθμός." }).optional(),
  orientation: z.string().optional(),
  amenities: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.existingUnitId === 'new') {
    if (data.identifier.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ο κωδικός είναι υποχρεωτικός.',
        path: ['identifier'],
      });
    }
    if (data.name.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Το όνομα είναι υποχρεωτικό.',
        path: ['name'],
      });
    }
  }
});


export type UnitFormValues = z.infer<typeof unitSchema>;

interface Unit {
  id: string;
  identifier: string;
  name: string;
}

interface UnitDialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  form: UseFormReturn<UnitFormValues>;
  isSubmitting: boolean;
  editingUnit: Unit | null;
  drawingPolygon: {x:number, y:number}[] | null;
  availableUnits: Unit[];
}

/**
 * A reusable dialog form for creating and editing units.
 * It uses react-hook-form and Zod for validation but delegates the
 * actual submission logic to the parent component via the `onSubmit` callback.
 */
export function UnitDialogForm({
  open,
  onOpenChange,
  onSubmit,
  form,
  isSubmitting,
  editingUnit,
  drawingPolygon,
  availableUnits,
}: UnitDialogFormProps) {
  const isLinkingMode = drawingPolygon && !editingUnit;
  const selectedUnitId = useWatch({
      control: form.control,
      name: "existingUnitId",
  });
  const isCreatingNew = selectedUnitId === 'new';
  
  const getDialogTitle = () => {
    if (editingUnit) return 'Επεξεργασία Ακινήτου';
    if (isLinkingMode) return 'Σύνδεση ή Δημιουργία Ακινήτου';
    return 'Προσθήκη Νέου Ακινήτου';
  }

  const getDialogDescription = () => {
    if (editingUnit) return 'Ενημερώστε τις πληροφορίες του ακινήτου.';
    if (isLinkingMode) return 'Συνδέστε το σχήμα που σχεδιάσατε με ένα υπάρχον ακίνητο ή δημιουργήστε ένα νέο.';
    return 'Συμπληρώστε τις πληροφορίες για το νέο ακίνητο.';
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-6">
            {isLinkingMode && (
              <FormField
                control={form.control}
                name="existingUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ενέργεια</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε ενέργεια..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="new">Δημιουργία Νέου Ακινήτου</SelectItem>
                        {availableUnits.map(unit => (
                          <SelectItem key={unit.id} value={unit.id}>
                            Σύνδεση με: {unit.name} ({unit.identifier})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {(isCreatingNew || editingUnit) && <Separator className="my-2" />}

            {/* --- Fields for creating new or editing existing --- */}
            <div className={`grid gap-4 ${isLinkingMode && !isCreatingNew ? 'hidden' : 'block'}`}>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Κωδικός</FormLabel>
                    <FormControl><Input placeholder="π.χ. A1, B2" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Όνομα/Αναγνωριστικό</FormLabel>
                    <FormControl><Input placeholder="π.χ. Διαμέρισμα, Κατάστημα" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Τύπος (Προαιρετικό)</FormLabel>
                    <FormControl><Input placeholder="π.χ. Γκαρσονιέρα" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Κατάσταση</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε κατάσταση" /></SelectTrigger></FormControl>
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Εμβαδόν (τ.μ.)</FormLabel>
                        <FormControl><Input type="number" placeholder="π.χ. 85.5" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Τιμή (€)</FormLabel>
                        <FormControl><Input type="number" placeholder="π.χ. 250000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Υπνοδωμάτια</FormLabel>
                        <FormControl><Input type="number" placeholder="π.χ. 2" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Μπάνια</FormLabel>
                        <FormControl><Input type="number" placeholder="π.χ. 1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="orientation"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Προσανατολισμός</FormLabel>
                      <FormControl><Input placeholder="π.χ. Νοτιοανατολικός" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Παροχές (με κόμμα)</FormLabel>
                      <FormControl><Textarea placeholder="π.χ. Τζάκι, Κήπος, Μπαλκόνι" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
                  )}
              />
            </div>
            {/* --- Always show polygon points if they exist --- */}
            {(form.getValues('polygonPoints') || drawingPolygon) && (
              <FormField
                control={form.control}
                name="polygonPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Συντεταγμένες Πολυγώνου (JSON)</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Σχεδιάστε στην κάτοψη ή επικολλήστε εδώ: [{"x": 10, "y": 10}, ...]' {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingUnit ? 'Αποθήκευση' : (isLinkingMode && !isCreatingNew) ? 'Σύνδεση Σχήματος' : 'Προσθήκη Ακινήτου'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
