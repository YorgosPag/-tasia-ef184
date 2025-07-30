
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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const floorSchema = z.object({
  level: z.string().min(1, { message: 'Το επίπεδο είναι υποχρεωτικό.' }),
  description: z.string().optional(),
  floorPlanUrl: z.string().url({ message: "Το URL της κάτοψης δεν είναι έγκυρο." }).or(z.literal('')).optional(),
});

export type FloorFormValues = z.infer<typeof floorSchema>;

interface NewFloorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<FloorFormValues>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function NewFloorDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
}: NewFloorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Προσθήκη Νέου Ορόφου</DialogTitle>
          <DialogDescription>
            Συμπληρώστε τις πληροφορίες για να προσθέσετε έναν νέο όροφο στο κτίριο.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Επίπεδο Ορόφου</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. 1, 0, -1, Ισόγειο" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Περιγραφή (Προαιρετικό)</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. Γραφεία εταιρείας" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floorPlanUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Κάτοψης (Προαιρετικό)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/plan.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Ακύρωση
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Προσθήκη Ορόφου
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
