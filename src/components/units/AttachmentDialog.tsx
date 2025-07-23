
'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';


export const attachmentSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['parking', 'storage'], { required_error: 'Ο τύπος είναι υποχρεωτικός.' }),
  details: z.string().optional(),
  area: z.string().transform(v => v.trim()).refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Το εμβαδόν πρέπει να είναι αριθμός." }).optional(),
  price: z.string().transform(v => v.trim()).refine(val => val === '' || !isNaN(parseFloat(val)), { message: "Η τιμή πρέπει να είναι αριθμός." }).optional(),
  photoUrl: z.string().url({ message: "Το URL της φωτογραφίας δεν είναι έγκυρο." }).or(z.literal('')).optional(),
  sharePercentage: z.string().transform(v => v.trim()).refine(val => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), { message: "Το ποσοστό πρέπει να είναι θετικός αριθμός." }).optional(),
  isBundle: z.boolean().default(false),
  isStandalone: z.boolean().default(false),
}).refine(data => {
    return !(data.isBundle && data.isStandalone);
}, {
    message: "Cannot be both a bundle and standalone.",
    path: ["isStandalone"],
});

export type AttachmentFormValues = z.infer<typeof attachmentSchema>;

interface AttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AttachmentFormValues>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingAttachment: AttachmentFormValues | null;
}

export function AttachmentDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  editingAttachment,
}: AttachmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingAttachment ? 'Επεξεργασία' : 'Νέο'} Παρακολούθημα</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
               <FormField control={form.control} name="type" render={({ field }) => (
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
              <FormField control={form.control} name="details" render={({ field }) => (<FormItem><FormLabel>Λεπτομέρειες</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="area" render={({ field }) => (<FormItem><FormLabel>Εμβαδόν (τ.μ.)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Τιμή (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="sharePercentage" render={({ field }) => (<FormItem><FormLabel>Ποσοστό (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              <FormField control={form.control} name="isBundle" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Πακέτο με το Unit</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) form.setValue('isStandalone', false);
              }} /></FormControl></FormItem>)}/>
              <FormField control={form.control} name="isStandalone" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Ανεξάρτητο</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) form.setValue('isBundle', false);
              }} /></FormControl></FormItem>)}/>

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
