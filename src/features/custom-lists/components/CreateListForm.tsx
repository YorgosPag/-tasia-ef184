
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useCustomLists, type CreateListData } from '@/hooks/useCustomLists';

const createListSchema = z.object({
  title: z.string().min(2, {
    message: 'Ο τίτλος πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
  }),
  key: z.string().min(2, 'Το κλειδί είναι υποχρεωτικό.').regex(/^[a-z0-9-]+$/, 'Το κλειδί μπορεί να περιέχει μόνο μικρά γράμματα, αριθμούς και παύλες.'),
  description: z.string().optional(),
  hasCode: z.boolean().default(false),
  isProtected: z.boolean().default(false),
});

type CreateListFormValues = z.infer<typeof createListSchema>;

export function CreateListForm() {
    const { createList, isSubmitting } = useCustomLists();
    
    const form = useForm<CreateListFormValues>({
        resolver: zodResolver(createListSchema),
        defaultValues: {
            title: '',
            key: '',
            description: '',
            hasCode: false,
            isProtected: false,
        },
    });

    const onSubmit = async (values: CreateListFormValues) => {
        const success = await createList(values);
        if (success) {
            form.reset();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Δημιουργία Νέας Λίστας</CardTitle>
                <CardDescription>Δημιουργήστε μια νέα λίστα επιλογών για χρήση σε όλη την εφαρμογή.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Τίτλος Λίστας</FormLabel>
                                <FormControl>
                                    <Input placeholder="π.χ. Κατηγορίες Παρεμβάσεων" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="key"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Μοναδικό Κλειδί Λίστας</FormLabel>
                                <FormControl>
                                    <Input placeholder="π.χ. intervention-categories" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Περιγραφή (Προαιρετικό)</FormLabel>
                            <FormControl>
                                <Input placeholder="Μια σύντομη περιγραφή του σκοπού της λίστας." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex flex-wrap gap-8">
                            <FormField
                            control={form.control}
                            name="hasCode"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-w-[250px]">
                                <div className="space-y-0.5">
                                    <FormLabel>Η λίστα περιέχει κωδικό;</FormLabel>
                                    <FormDescription>
                                    Ενεργοποιήστε αν κάθε στοιχείο έχει και έναν μοναδικό κωδικό.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                            />
                             <FormField
                            control={form.control}
                            name="isProtected"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-w-[250px]">
                                <div className="space-y-0.5">
                                    <FormLabel>Προστατευμένη Λίστα;</FormLabel>
                                    <FormDescription>
                                    Εμποδίζει τη διαγραφή της λίστας από το UI.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                            />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            Δημιουργία Λίστας
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
