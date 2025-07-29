

'use client';

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '@/shared/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/shared/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { Loader2 } from 'lucide-react';
import { ContactForm } from '@/components/contacts/ContactForm';
import { contactSchema, ContactFormValues, ALL_ACCORDION_SECTIONS, EntityType } from '@/shared/lib/validation/contactSchema';
import { logActivity } from '@/shared/lib/logger';
import { useAuth } from '@/shared/hooks/use-auth';
import { ContactEditHeader } from '@/components/contacts/ContactEditHeader';


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

function EditContactPageContent() {
    const router = useRouter();
    const params = useParams();
    const contactId = params.id as string;
    const viewParam = params.view as EntityType;
    const { toast } = useToast();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [openSections, setOpenSections] = useState<string[]>(ALL_ACCORDION_SECTIONS);
    const [contactName, setContactName] = useState('');
    const hasReset = useRef(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {},
    });
    
    const entityType = form.watch('entityType');
    const isLegalEntity = entityType === 'Νομικό Πρόσωπο' || entityType === 'Δημ. Υπηρεσία';
    const prevEntityTypeRef = useRef<string | undefined>();

    const mapEntityTypeToTab = (type: ContactFormValues['entityType']): EntityType => {
        switch(type) {
            case 'Φυσικό Πρόσωπο': return 'individual';
            case 'Νομικό Πρόσωπο': return 'legal';
            case 'Δημ. Υπηρεσία': return 'public';
            default: return 'individual';
        }
    }

    const mapTabToEntityType = (tab: EntityType | string | null): ContactFormValues['entityType'] => {
        switch(tab) {
            case 'individual': return 'Φυσικό Πρόσωπο';
            case 'legal': return 'Νομικό Πρόσωπο';
            case 'public': return 'Δημ. Υπηρεσία';
            default: return 'Φυσικό Πρόσωπο';
        }
    }
    
    useEffect(() => {
        const newTab = mapEntityTypeToTab(entityType);
        
        if (prevEntityTypeRef.current === entityType) return;
        prevEntityTypeRef.current = entityType;

        if (newTab && newTab !== viewParam && !form.formState.isDirty) {
            const newPath = `/contacts/${contactId}/edit/${newTab}`;
            router.replace(newPath, { scroll: false });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityType, viewParam, router, contactId]);
    

    useEffect(() => {
        if (!contactId) return;

        const fetchContact = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, 'contacts', contactId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && !hasReset.current) {
                    const data = docSnap.data();
                    setContactName(data.name || '');
                    
                    const initialEntityType = mapTabToEntityType(viewParam);
                   
                    const formData: ContactFormValues = {
                        ...data,
                        entityType: initialEntityType,
                        id: docSnap.id,
                        birthDate: data.birthDate instanceof Timestamp ? data.birthDate.toDate() : null,
                        identity: {
                            ...data.identity,
                            issueDate: data.identity?.issueDate instanceof Timestamp ? data.identity.issueDate.toDate() : null,
                        },
                        addresses: data.addresses || [],
                    };
                    form.reset(formData, { keepDirty: false });
                    hasReset.current = true;
                } else if (!docSnap.exists()) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactId, viewParam]);


    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);
        
        let photoUrls = data.photoUrls || {};
        const viewParamForPhoto = mapEntityTypeToTab(data.entityType);

        try {
             if (fileToUpload) {
                toast({ title: "Ενημέρωση επαφής", description: "Ανέβασμα νέας φωτογραφίας..." });
                const filePath = `contact-images/${viewParamForPhoto}/${contactId}/${fileToUpload.name}`;
                const storageRef = ref(storage, filePath);
                await uploadBytes(storageRef, fileToUpload);
                const newPhotoUrl = await getDownloadURL(storageRef);
                photoUrls[viewParamForPhoto] = newPhotoUrl;
            }

            const dataToUpdate: { [key: string]: any } = { ...data, photoUrls };
            
            // Handle dates safely
            dataToUpdate.birthDate = data.birthDate ? Timestamp.fromDate(new Date(data.birthDate)) : null;

            if (dataToUpdate.identity) {
                dataToUpdate.identity.issueDate = data.identity?.issueDate ? Timestamp.fromDate(new Date(data.identity.issueDate)) : null;
            }
            
            if (data.addresses) {
                dataToUpdate.addresses = data.addresses;
            }

            const cleanedData = deepClean(dataToUpdate);
            delete cleanedData.id;

            const docRef = doc(db, 'contacts', contactId);
            await updateDoc(docRef, cleanedData);
            
            setContactName(data.name); // Update displayed name
            form.reset({ ...data, photoUrls }, { keepDirty: false });
            setFileToUpload(null);

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
            <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ContactEditHeader
                    contactName={contactName}
                    isSubmitting={isSubmitting}
                    isDirty={form.formState.isDirty}
                    onBack={() => router.back()}
                    form={form}
                    onFileSelect={setFileToUpload}
                />
                
                <Card>
                    <CardHeader>
                       <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Επεξεργασία Επαφής</CardTitle>
                                <CardDescription>Ενημερώστε τα παρακάτω πεδία για να επεξεργαστείτε την επαφή.</CardDescription>
                            </div>
                       </div>
                    </CardHeader>
                    <CardContent>
                         <ContactForm form={form} onFileSelect={setFileToUpload} openSections={openSections} onOpenChange={setOpenSections} />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}

export default function EditContactPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin" /></div>}>
            <EditContactPageContent />
        </Suspense>
    )
}
