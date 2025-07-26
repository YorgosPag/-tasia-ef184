
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/shared/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { contactSchema, ContactFormValues } from '@/shared/lib/validation/contactSchema';
import { logActivity } from '@/shared/lib/logger';
import { useAuth } from '@/shared/hooks/use-auth';

function deepClean(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null && !(obj[key] instanceof Date) && !(obj[key] instanceof Timestamp)) {
      deepClean(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
}


export default function EditContactPage() {
    const router = useRouter();
    const params = useParams();
    const contactId = params.id as string;
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {},
    });

    useEffect(() => {
        if (!contactId) return;

        const fetchContact = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'contacts', contactId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const formData = {
                        ...data,
                        id: docSnap.id,
                        birthDate: data.birthDate instanceof Timestamp ? data.birthDate.toDate() : null,
                        'identity.issueDate': data.identity?.issueDate instanceof Timestamp ? data.identity.issueDate.toDate() : null,
                    };
                    form.reset(formData as ContactFormValues);
                } else {
                    toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Η επαφή δεν βρέθηκε.' });
                    router.push('/contacts');
                }
            } catch (error) {
                console.error("Error fetching contact:", error);
                toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Αποτυχία φόρτωσης δεδομένων.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchContact();
    }, [contactId, router, toast, form]);


    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        
        let newPhotoUrl = data.photoUrl;

        try {
             if (fileToUpload) {
                toast({ title: "Ενημέρωση επαφής", description: "Ανέβασμα νέας φωτογραφίας..." });
                const filePath = `contact-images/${contactId}/${fileToUpload.name}`;
                const storageRef = ref(storage, filePath);
                await uploadBytes(storageRef, fileToUpload);
                newPhotoUrl = await getDownloadURL(storageRef);
            }

            const dataToUpdate: { [key: string]: any } = { ...data, photoUrl: newPhotoUrl };
            
            if (data.birthDate) {
                dataToUpdate.birthDate = Timestamp.fromDate(new Date(data.birthDate));
            } else {
                dataToUpdate.birthDate = null;
            }

            if (data.identity?.issueDate) {
                dataToUpdate.identity.issueDate = Timestamp.fromDate(new Date(data.identity.issueDate));
            } else if (dataToUpdate.identity) {
                dataToUpdate.identity.issueDate = null;
            }

            const cleanedData = deepClean(dataToUpdate);
            delete cleanedData.id;

            const docRef = doc(db, 'contacts', contactId);
            await updateDoc(docRef, cleanedData);

            await logActivity('UPDATE_CONTACT', {
                entityId: contactId,
                entityType: 'contact',
                name: data.name,
                changes: data,
            });
            toast({
                title: "Επιτυχία",
                description: `Οι αλλαγές στην επαφή "${data.name}" αποθηκεύτηκαν.`,
            });
            router.push('/contacts');
        } catch (error: any) {
            console.error("Error updating contact: ", error);
            toast({
                variant: "destructive",
                title: "Σφάλμα",
                description: `Δεν ήταν δυνατή η ενημέρωση της επαφής: ${error.message}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Πίσω στις Επαφές
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Αποθήκευση Αλλαγών
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Επεξεργασία Επαφής</CardTitle>
                        <CardDescription>Ενημερώστε τα παρακάτω πεδία για να επεξεργαστείτε την επαφή.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ContactForm form={form} onFileSelect={setFileToUpload} />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
