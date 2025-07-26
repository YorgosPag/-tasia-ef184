'use client';

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
import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Company } from '@/shared/hooks/use-data-store';


export const companySchema = z.object({
  name: z.string().min(1, { message: "Το όνομα είναι υποχρεωτικό." }),
  logoUrl: z.string().url({ message: "Το URL του λογότυπου δεν είναι έγκυρο." }).or(z.literal('')),
  website: z.string().url({ message: "Το URL του website δεν είναι έγκυρο." }).or(z.literal('')),
  contactInfo: z.object({
      email: z.string().email({ message: "Το email δεν είναι έγκυρο." }).or(z.literal('')),
      phone: z.string().optional(),
      address: z.string().optional(),
      afm: z.string().optional(),
  })
});

export type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: UseFormReturn<CompanyFormValues>;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    editingCompany: Company | null;
}

export function CompanyFormDialog({
    open,
    onOpenChange,
    form,
    onSubmit,
    isSubmitting,
    editingCompany,
}: CompanyFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingCompany ? 'Επεξεργασία' : 'Προσθήκη Νέας'} Εταιρείας</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="grid gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Όνομα Εταιρείας</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="logoUrl" render={({ field }) => (<FormItem><FormLabel>URL Λογοτύπου</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="contactInfo.address" render={({ field }) => (<FormItem><FormLabel>Διεύθυνση</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="contactInfo.afm" render={({ field }) => (<FormItem><FormLabel>ΑΦΜ</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="contactInfo.phone" render={({ field }) => (<FormItem><FormLabel>Τηλέφωνο</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="contactInfo.email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingCompany ? 'Αποθήκευση' : 'Προσθήκη'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
