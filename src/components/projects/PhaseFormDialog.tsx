
'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Loader2, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Company } from '@/hooks/use-data-store';
import type { PhaseFormValues } from './PhasesSection';
import type { Phase } from '@/app/projects/[id]/page';

interface PhaseFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: UseFormReturn<PhaseFormValues>;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    editingPhase: Phase | { parentId: string } | null;
    companies: Company[];
    isLoadingCompanies: boolean;
}

export function PhaseFormDialog({
    open,
    onOpenChange,
    form,
    onSubmit,
    isSubmitting,
    editingPhase,
    companies,
    isLoadingCompanies,
}: PhaseFormDialogProps) {
    const isSubphase = editingPhase && 'parentId' in editingPhase;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingPhase && 'id' in editingPhase ? 'Επεξεργασία' : 'Νέα'} {isSubphase ? 'Υποφάση' : 'Φάση'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="grid max-h-[80vh] gap-4 overflow-y-auto py-4 pr-4">
                        <FormField control={form.control} name="name" render={({field}) => (<FormItem><FormLabel>Όνομα</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="description" render={({field}) => (<FormItem><FormLabel>Περιγραφή</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="status" render={({field}) => (<FormItem><FormLabel>Κατάσταση</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Εκκρεμεί">Εκκρεμεί</SelectItem><SelectItem value="Σε εξέλιξη">Σε εξέλιξη</SelectItem><SelectItem value="Ολοκληρώθηκε">Ολοκληρώθηκε</SelectItem><SelectItem value="Καθυστερεί">Καθυστερεί</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                        <FormField
                            control={form.control}
                            name="assignedTo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ανάθεση σε Εταιρεία/Συνεργείο</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Επιλέξτε..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none"><em>Κανένα</em></SelectItem>
                                            {isLoadingCompanies ? <Loader2 className="animate-spin" /> : companies.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="documents" render={({field}) => (<FormItem><FormLabel>Έγγραφα (URL με κόμμα)</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="notes" render={({field}) => (<FormItem><FormLabel>Σημειώσεις</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <FormField control={form.control} name="startDate" render={({ field }) => (<FormItem><FormLabel>Έναρξη</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, 'P', {locale: el}) : <span>Επιλογή</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="endDate" render={({ field }) => (<FormItem><FormLabel>Λήξη</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, 'P', {locale: el}) : <span>Επιλογή</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="deadline" render={({ field }) => (<FormItem><FormLabel>Προθεσμία</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, 'P', {locale: el}) : <span>Επιλογή</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="outline" disabled={isSubmitting}>Ακύρωση</Button></DialogClose>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Αποθήκευση</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
