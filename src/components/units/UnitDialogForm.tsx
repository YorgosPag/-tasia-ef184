
'use client';

import React from 'react';
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

const unitSchema = z.object({
  identifier: z.string().min(1, { message: 'Ο κωδικός είναι υποχρεωτικός.' }),
  name: z.string().min(1, { message: 'Το όνομα είναι υποχρεωτικό.' }),
  type: z.string().optional(),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος']),
  polygonPoints: z.string().optional(),
});

export type UnitFormValues = z.infer<typeof unitSchema>;

interface Unit {
  id: string;
  // include other unit properties if needed for display in the form
}

interface UnitDialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UnitFormValues) => void;
  form: UseFormReturn<UnitFormValues>;
  isSubmitting: boolean;
  editingUnit: Unit | null;
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
}: UnitDialogFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingUnit ? 'Επεξεργασία Ακινήτου' : 'Προσθήκη Νέου Ακινήτου'}</DialogTitle>
          <DialogDescription>
            {editingUnit ? 'Ενημερώστε τις πληροφορίες του ακινήτου.' : 'Συμπληρώστε τις πληροφορίες για το νέο ακίνητο.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4 py-4">
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
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingUnit ? 'Αποθήκευση Αλλαγών' : 'Προσθήκη Ακινήτου'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
