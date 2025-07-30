
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
    FormDescription,
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
import { WorkStageFormValues } from './workStageSchema';
import type { WorkStage } from '@/lib/types/project-types';

interface WorkStageFormDialogProps {
    open: boolean;
    onOpenChange: () => void;
    form: UseFormReturn<WorkStageFormValues>;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    editingWorkStage: WorkStage | { parentId: string } | null;
    companies: Company[];
    isLoadingCompanies: boolean;
}

export function WorkStageFormDialog({
    open,
    onOpenChange,
    form,
    onSubmit,
    isSubmitting,
    editingWorkStage,
    companies,
    isLoadingCompanies,
}: WorkStageFormDialogProps) {
    const isSubstage = editingWorkStage && 'parentId' in editingWorkStage;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingWorkStage && 'id' in editingWorkStage ? 'Επεξεργασία' : 'Νέο'} {isSubstage ? 'Υποστάδιο Εργασίας' : 'Στάδιο Εργασίας'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="grid max-h-[80vh] gap-4 overflow-y-auto py-4 pr-4">
                        <FormField control={form.control} name="name" render={({field}) => (<FormItem><FormLabel>Όνομα</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="description" render={({field}) => (<FormItem><FormLabel>Περιγραφή</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <FormField control={form.control} name="status" render={({field}) => (<FormItem><FormLabel>Κατάσταση</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Εκκρεμεί">Εκκρεμεί</SelectItem><SelectItem value="Σε εξέλιξη">Σε εξέλιξη</SelectItem><SelectItem value="Ολοκληρώθηκε">Ολοκληρώθηκε</SelectItem><SelectItem value="Καθυστερεί">Καθυστερεί</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField control={form.control} name="budgetedCost" render={({ field }) => (<FormItem><FormLabel>Προϋπολογισμένο Κόστος (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="actualCost" render={({ field }) => (<FormItem><FormLabel>Πραγματικό Κόστος (€)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField
                            control={form.control}
                            name="assignedTo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ανάθεση σε</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Επιλέξτε υπεύθυνο..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="">
                                                <em>Κανένας</em>
                                            </SelectItem>
                                            {isLoadingCompanies ? (
                                                <div className="flex items-center justify-center p-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                </div>
                                            ) : (
                                                companies.map(company => (
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
                            name="relatedEntityIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Αφορά (IDs κτιρίων/ορόφων/ακινήτων με κόμμα)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="π.χ. ID κτιρίου, ID ακινήτου..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="dependsOn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Εξαρτάται από (IDs σταδίων με κόμμα)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="π.χ. ID σταδίου, ID υποσταδίου..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={form.control} 
                            name="documents" 
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Απαιτούμενα Έγγραφα</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="π.χ. Σχέδια, Άδεια Δόμησης..." rows={3} />
                                    </FormControl>
                                    <FormDescription>Καταχωρήστε ένα όνομα εγγράφου ανά γραμμή.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
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
