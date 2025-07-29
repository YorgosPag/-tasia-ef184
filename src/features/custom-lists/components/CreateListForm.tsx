
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useCustomListActions } from '@/hooks/customList/useCustomListActions';
import type { CreateListData } from '@/lib/customListService';
import { BooleanSwitchField } from './form/BooleanSwitchField';

const createListSchema = z.object({
  title: z.string().min(2, {
    message: 'Ο τίτλος πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
  }),
  description: z.string().optional(),
  hasCode: z.boolean().default(false),
  isProtected: z.boolean().default(false),
});

type CreateListFormValues = z.infer<typeof createListSchema>;

export function CreateListForm({ fetchAllLists }: { fetchAllLists: () => Promise<void>}) {
    const { createList, isSubmitting } = useCustomListActions(fetchAllLists);

    const form = useForm<CreateListFormValues>({
        resolver: zodResolver(createListSchema),
        defaultValues: {
            title: '',
            description: '',
            hasCode: false,
            isProtected: false,
        },
    });

    const onSubmit = async (values: CreateListFormValues) => {
        const listData: CreateListData = {
            title: values.title,
            description: values.description,
            hasCode: values.hasCode,
            isProtected: values.isProtected,
        }
        const result = await createList(listData);
        if (result) {
            form.reset({
                title: '',
                description: '',
                hasCode: false,
                isProtected: false
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Δημιουργία Νέας Λίστας</CardTitle>
                <CardDescription>Δημιουργήστε μια νέα λίστα επιλογών για χρήση σε όλη την εφαρμογή. Το ID της λίστας θα παραχθεί αυτόματα.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <div className="flex flex-wrap gap-4">
                           <BooleanSwitchField
                              control={form.control}
                              name="hasCode"
                              label="Η λίστα περιέχει κωδικό;"
                              description="Ενεργοποιήστε αν κάθε στοιχείο έχει και έναν μοναδικό κωδικό."
                            />
                            <BooleanSwitchField
                              control={form.control}
                              name="isProtected"
                              label="Προστατευμένη Λίστα;"
                              description="Εμποδίζει τη διαγραφή της λίστας από το UI (εκτός admin)."
                            />
                        </div>
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
