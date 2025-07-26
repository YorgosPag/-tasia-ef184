
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, serverTimestamp, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/shared/lib/firebase';
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
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            entityType: 'Φυσικό Πρόσωπο',
            photoUrl: '',
            identity: { type: 'Ταυτότητα', number: '', issuingAuthority: '' },
            emails: [],
            phones: [],
            socials: [],
            address: { street: '', number: '', city: '', postalCode: ''},
            job: { role: '', specialty: ''},
            notes: ''
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        
        const dataToSave: { [key: string]: any } = { ...data };

        if (data.birthDate) dataToSave.birthDate = Timestamp.fromDate(new Date(data.birthDate));
        else dataToSave.birthDate = null;
        if (data.identity?.issueDate) dataToSave.identity.issueDate = Timestamp.fromDate(new Date(data.identity.issueDate));
        else if (dataToSave.identity) dataToSave.identity.issueDate = null;

        // Clean up undefined values before sending to Firestore
        Object.keys(dataToSave).forEach(key => {
            if (dataToSave[key] === undefined) delete dataToSave[key];
        });
        // Deep clean for nested objects
        if (dataToSave.identity) {
            Object.keys(dataToSave.identity).forEach(key => {
                if (dataToSave.identity[key] === undefined) {
                    delete dataToSave.identity[key];
                }
            });
        }


        try {
            const docRef = await addDoc(collection(db, 'contacts'), {
                ...dataToSave,
                createdAt: serverTimestamp(),
                createdBy: user?.uid,
            });
            
            await logActivity('CREATE_CONTACT', { entityId: docRef.id, entityType: 'contact', name: data.name });

            if (fileToUpload) {
                toast({ title: "Η επαφή αποθηκεύτηκε", description: "Ανέβασμα φωτογραφίας..." });
                const filePath = `contact-images/${docRef.id}/${fileToUpload.name}`;
                const storageRef = ref(storage, filePath);
                await uploadBytes(storageRef, fileToUpload);
                const downloadURL = await getDownloadURL(storageRef);

                await updateDoc(docRef, { photoUrl: downloadURL });
                await logActivity('UPDATE_CONTACT', { entityId: docRef.id, entityType: 'contact', changes: { photoUrl: downloadURL } });
            }

            toast({ title: "Επιτυχία", description: `Η επαφή "${data.name}" δημιουργήθηκε.` });
            router.push('/contacts');

        } catch (error: any) {
            console.error("Error adding contact: ", error);
            toast({ variant: "destructive", title: "Σφάλμα", description: `Δεν ήταν δυνατή η δημιουργία της επαφής: ${error.message}` });
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
                         <ContactForm form={form} onFileSelect={setFileToUpload} />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
