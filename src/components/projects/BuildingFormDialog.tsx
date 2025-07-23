
'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
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
import type { BuildingFormValues } from './BuildingsSection';
import type { Building } from '@/app/projects/[id]/page';

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
