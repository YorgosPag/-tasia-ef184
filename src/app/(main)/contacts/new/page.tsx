
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, serverTimestamp, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { contactSchema, ContactFormValues } from '@/lib/validation/contactSchema';
import { logActivity } from '@/lib/logger';
import { useAuth } from '@/hooks/use-auth';

function deepClean(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepClean(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
}

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
            photoUrls: {},
            identity: { type: 'Ταυτότητα', number: '', issuingAuthority: '' },
            emails: [],
            phones: [],
            socials: [],
            addresses: [],
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
        
        if (data.addresses) {
            dataToSave.addresses = data.addresses;
        }

        const cleanedData = deepClean(dataToSave);


        try {
            const docRef = await addDoc(collection(db, 'contacts'), {
                ...cleanedData,
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
