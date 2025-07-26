

'use client';

import React, { useEffect, useState } from 'react';
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
import { Loader2, Wand2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { generateNextUnitIdentifier } from '@/shared/lib/identifier-generator';
import { useToast } from '@/shared/hooks/use-toast';

export const unitSchema = z.object({
  existingUnitId: z.string().optional(),
  identifier: z.string().min(1, { message: "Ο κωδικός είναι υποχρεωτικός." }),
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  type: z.string().min(1, { message: "Ο τύπος είναι υποχρεωτικός."}),
  status: z.enum(['Διαθέσιμο', 'Κρατημένο', 'Πωλημένο', 'Οικοπεδούχος', 'Προς Ενοικίαση']),
  polygonPoints: z.string().optional(),
  area: z.string().refine(val => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 1 && parseFloat(val) <= 10000), { message: "Το εμβαδόν πρέπει να είναι 1-10000 τ.μ." }).optional(),
  price: z.string().refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Η τιμή πρέπει να είναι αριθμός." }).optional(),
  bedrooms: z.string().refine(val => val === '' || !isNaN(parseInt(val, 10)), { message: "Πρέπει να είναι ακέραιος αριθμός." }).optional(),
  bathrooms: z.string().refine(val => val === '' || !isNaN(parseInt(val, 10)), { message: "Πρέπει να είναι ακέραιος αριθμός." }).optional(),
  orientation: z.string().optional(),
  amenities: z.string().optional(),
  floorSpan: z.number().int().min(1).default(1),
});


export type UnitFormValues = z.infer<typeof unitSchema>;

interface Unit {
  id: string;
  identifier: string;
  name: string;
  floorId: string;
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
  const { toast } = useToast();
  const [isGeneratingId, setIsGeneratingId] = useState(false);

  const isLinkingMode = drawingPolygon && !editingUnit;
  const selectedUnitId = useWatch({
      control: form.control,
      name: "existingUnitId",
  });
  const unitType = useWatch({ control: form.control, name: "type" });
  const floorSpan = useWatch({ control: form.control, name: "floorSpan" });
  
  const isCreatingNew = selectedUnitId === 'new';

  const handleGenerateId = async () => {
    if (!editingUnit && !isCreatingNew) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν μπορεί να δημιουργηθεί κωδικός για υπάρχον ακίνητο.' });
        return;
    }
    const floorId = availableUnits[0]?.floorId; // Assume all available units are on the same floor for now
    if (!floorId) {
        toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Δεν βρέθηκε όροφος για τη δημιουργία κωδικού.' });
        return;
    }
    if (!unitType) {
        toast({ variant: 'destructive', title: 'Ειδοποίηση', description: 'Παρακαλώ επιλέξτε πρώτα τύπο ακινήτου.' });
        return;
    }

    setIsGeneratingId(true);
    try {
        const nextId = await generateNextUnitIdentifier(floorId, unitType, floorSpan);
        form.setValue('identifier', nextId);
        toast({ title: 'Επιτυχία', description: `Προτεινόμενος κωδικός: ${nextId}` });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Σφάλμα Δημιουργίας Κωδικού', description: error.message });
    } finally {
        setIsGeneratingId(false);
    }
  };
  
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || 'new'}>
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
                    <div className="flex items-center gap-2">
                        <FormControl><Input placeholder="π.χ. A1D1" {...field} /></FormControl>
                         <Button type="button" variant="outline" size="icon" onClick={handleGenerateId} disabled={isGeneratingId} title="Αυτόματη δημιουργία κωδικού">
                            {isGeneratingId ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4"/>}
                        </Button>
                    </div>
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
                    <FormLabel>Τύπος</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Επιλέξτε τύπο..."/></SelectTrigger></FormControl>
                       <SelectContent>
                         <SelectItem value="Διαμέρισμα">Διαμέρισμα</SelectItem>
                         <SelectItem value="Στούντιο">Στούντιο</SelectItem>
                         <SelectItem value="Γκαρσονιέρα">Γκαρσονιέρα</SelectItem>
                         <SelectItem value="Μεζονέτα">Μεζονέτα</SelectItem>
                         <SelectItem value="Κατάστημα">Κατάστημα</SelectItem>
                         <SelectItem value="Other">Άλλο</SelectItem>
                       </SelectContent>
                     </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="floorSpan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Αριθμός Ορόφων που καταλαμβάνει</FormLabel>
                      <FormControl><Input type="number" min="1" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)} /></FormControl>
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
                        <SelectItem value="Προς Ενοικίαση">Προς Ενοικίαση</SelectItem>
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
                        <FormLabel>Λουτρά</FormLabel>
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
                    <FormLabel>
                      Συντεταγμένες Πολυγώνου (JSON)
                      <span className="ml-2 text-xs text-muted-foreground">(π.χ. [{"{"}x:10,"y":20{"}"},...])</span>
                    </FormLabel>
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
