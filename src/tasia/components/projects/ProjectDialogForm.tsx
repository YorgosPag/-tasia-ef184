
'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { Loader2, CalendarIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Company } from '@/shared/hooks/use-data-store';
import type { ProjectWithWorkStageSummary, ProjectFormValues } from '@/shared/types/project-types';

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'Ο τίτλος είναι υποχρεωτικός.' }),
  companyId: z.string().min(1, { message: 'Η εταιρεία είναι υποχρεωτική.' }),
  location: z.string().min(1, { message: 'Η τοποθεσία είναι υποχρεωτική.' }),
  description: z.string().optional(),
  deadline: z.date({
    required_error: 'Η προθεσμία είναι υποχρεωτική.',
  }),
  status: z.enum(['Ενεργό', 'Σε εξέλιξη', 'Ολοκληρωμένο']),
  photoUrl: z.string().url({ message: 'Το URL δεν είναι έγκυρο.' }).or(z.literal('')).optional(),
  tags: z.string().optional(),
});


interface ProjectDialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<any>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isLoading: boolean;
  editingProject: ProjectWithWorkStageSummary | null;
  companies: Company[];
}

export function ProjectDialogForm({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  isLoading,
  editingProject,
  companies,
}: ProjectDialogFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingProject ? 'Επεξεργασία' : 'Δημιουργία Νέου'} Έργου</DialogTitle>
          <DialogDescription>
            {editingProject ? 'Ενημερώστε τις πληροφορίες του έργου.' : 'Συμπληρώστε τις παρακάτω πληροφορίες για να δημιουργήσετε ένα νέο έργο.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto pr-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τίτλος Έργου</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. Ανακαίνιση Κτιρίου" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Εταιρεία</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε εταιρεία..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
                      ) : (
                        companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Τοποθεσία</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. Αμπελόκηποι, Αθήνα" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Φωτογραφίας (Προαιρετικό)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/project.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (χωρισμένα με κόμμα)</FormLabel>
                  <FormControl>
                    <Input placeholder="π.χ. residential, luxury" {...field} />
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
                    <Textarea placeholder="Σύντομη περιγραφή του έργου..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Προθεσμία</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: el })
                          ) : (
                            <span>Επιλέξτε ημερομηνία</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Κατάσταση (Εμπορική)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Επιλέξτε κατάσταση" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ενεργό">Ενεργό</SelectItem>
                      <SelectItem value="Σε εξέλιξη">Σε εξέλιξη</SelectItem>
                      <SelectItem value="Ολοκληρωμένο">Ολοκληρωμένο</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProject ? 'Αποθήκευση' : 'Δημιουργία'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
