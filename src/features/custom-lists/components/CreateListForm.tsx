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
import { useCustomLists, CreateListData } from '@/hooks/useCustomLists';
import { useEffect, useState, useCallback } from 'react';

// Helper to create a URL-friendly slug from a string
function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // separate accent from letter
    .replace(/[\u0300-\u036f]/g, '') // remove all separated accents
    .replace(/\s+/g, '_') //- replace spaces with _
    .replace(/[^\w-]+/g, '') // remove all non-word chars
    .replace(/--+/g, '_') // replace multiple _ with single _
    .replace(/^-+/, '') // trim _ from start of text
    .replace(/-+$/, ''); // trim _ from end of text
}


const createListSchema = z.object({
  title: z.string().min(2, {
    message: 'Ο τίτλος πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
  }),
  key: z.string().min(2, { message: 'Το κλειδί πρέπει να έχει τουλάχιστον 2 χαρακτήρες.'})
    .regex(/^[a-z0-9_]+$/, 'Το κλειδί πρέπει να περιέχει μόνο μικρούς λατινικούς χαρακτήρες, αριθμούς και κάτω παύλες (_).'),
  description: z.string().optional(),
  hasCode: z.boolean().default(false),
  isProtected: z.boolean().default(false),
});

type CreateListFormValues = z.infer<typeof createListSchema>;

export function CreateListForm() {
    const { createList, isSubmitting, lists } = useCustomLists();
    const [errorMsg, setErrorMsg] = useState('');

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

    const titleValue = form.watch('title');
    const keyIsManuallyEdited = useRef(false);

    useEffect(() => {
        if (!keyIsManuallyEdited.current && titleValue) {
            form.setValue('key', generateSlug(titleValue), { shouldValidate: true });
        }
    }, [titleValue, form]);

    const onSubmit = async (values: CreateListFormValues) => {
        setErrorMsg('');
        if (lists && lists.some(l => l.key === values.key)) {
            setErrorMsg(`Το κλειδί "${values.key}" υπάρχει ήδη. Παρακαλώ επιλέξτε ένα διαφορετικό.`);
            form.setError('key', { type: 'manual', message: 'Αυτό το κλειδί υπάρχει ήδη.' });
            return;
        }

        const result = await createList(values);
        if (result.success) {
            form.reset({
                title: '',
                key: '',
                description: '',
                hasCode: false,
                isProtected: false
            });
            keyIsManuallyEdited.current = false;
        } else {
            setErrorMsg(result.error || 'Απέτυχε η δημιουργία λίστας.');
            if (result.error?.includes('duplicate key')) {
                 form.setError('key', { type: 'manual', message: 'Αυτό το κλειδί υπάρχει ήδη.' });
            }
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
                                            <Input placeholder="π.χ. Τύποι Διευθύνσεων" {...field} />
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
                                        <FormLabel>Μοναδικό Κλειδί</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="π.χ. address_types"
                                                {...field}
                                                onChange={(e) => {
                                                    keyIsManuallyEdited.current = true;
                                                    field.onChange(e);
                                                }}
                                             />
                                        </FormControl>
                                        <FormDescription>
                                            Σταθερό κλειδί για χρήση στον κώδικα (π.χ. "address_types").
                                        </FormDescription>
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
                        {errorMsg && !form.formState.errors.key && (
                          <div className="text-destructive text-sm">{errorMsg}</div>
                        )}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            Δημιουργία Λίστας
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
