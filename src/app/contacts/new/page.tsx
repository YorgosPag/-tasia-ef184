'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { contactSchema, ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { logActivity } from '@/shared/lib/logger';
import { useAuth } from '@/shared/hooks/use-auth';

export default function NewContactPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            entityType: 'Φυσικό Πρόσωπο',
            photoUrl: '',
            identity: { type: 'Ταυτότητα', number: '', issuingAuthority: '' },
            contactInfo: { email: '', phone: '', landline: ''},
            socials: { website: '', linkedin: '', facebook: ''},
            address: { street: '', number: '', city: '', postalCode: ''},
            job: { role: '', specialty: ''},
            notes: ''
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        try {
            const docRef = await addDoc(collection(db, 'contacts'), {
                ...data,
                birthDate: data.birthDate || null,
                'identity.issueDate': data.identity?.issueDate || null,
                createdAt: serverTimestamp(),
                createdBy: user?.uid,
            });
            await logActivity('CREATE_CONTACT', {
                entityId: docRef.id,
                entityType: 'contact',
                name: data.name
            });
            toast({
                title: "Επιτυχία",
                description: `Η επαφή "${data.name}" δημιουργήθηκε.`,
            });
            router.push('/contacts');
        } catch (error) {
            console.error("Error adding contact: ", error);
            toast({
                variant: "destructive",
                title: "Σφάλμα",
                description: "Δεν ήταν δυνατή η δημιουργία της επαφής.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω στις Επαφές
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Αποθήκευση Επαφής
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Δημιουργία Νέας Επαφής</CardTitle>
                        <CardDescription>Συμπληρώστε τα παρακάτω πεδία για να δημιουργήσετε μια νέα επαφή.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ContactForm form={form} />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
