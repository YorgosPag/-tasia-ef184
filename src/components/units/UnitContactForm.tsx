
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';
import { sendEmail } from '@/ai/flows/send-email-flow';
import { useToast } from '@/hooks/use-toast';

interface UnitContactFormProps {
  unitName: string;
}

export function UnitContactForm({ unitName }: UnitContactFormProps) {
  const params = useParams();
  const unitId = params.id as string;
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
        setError('Τα πεδία "Όνομα" και "Email" είναι υποχρεωτικά.');
        return;
    }
    setError('');
    setIsSubmitting(true);

    try {
        await addDoc(collection(db, 'leads'), {
            name,
            email,
            message,
            unitId,
            unitName,
            createdAt: serverTimestamp(),
            status: 'New'
        });

        const notificationEmail = process***REMOVED***.NEXT_PUBLIC_LEAD_NOTIFICATION_EMAIL;
        if (!notificationEmail) {
            console.warn("Lead notification email address is not set in environment variables (NEXT_PUBLIC_LEAD_NOTIFICATION_EMAIL). Skipping email notification.");
        } else {
            // Send notification email
            const emailResult = await sendEmail({
                to: notificationEmail,
                subject: `New Lead for ${unitName}`,
                text: `You have a new lead for the unit: ${unitName}.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
                html: `<p>You have a new lead for the unit: <strong>${unitName}</strong>.</p>
                       <p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Message:</strong></p>
                       <p>${message}</p>`,
            });

            if (!emailResult.success) {
                console.warn("Could not send lead notification email:", emailResult.message);
                // We don't block the user for this, just log it.
            }
        }

        setIsSubmitted(true);
    } catch (err) {
        console.error("Failed to submit lead:", err);
        setError("Η υποβολή απέτυχε. Παρακαλώ δοκιμάστε ξανά.");
        toast({
            variant: 'destructive',
            title: 'Σφάλμα',
            description: 'Η υποβολή του αιτήματος απέτυχε. Παρακαλώ προσπαθήστε ξανά.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ευχαριστούμε για το ενδιαφέρον σας!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                    Το αίτημά σας για το ακίνητο "{unitName}" έχει καταχωρηθεί. Ένας εκπρόσωπός μας θα επικοινωνήσει μαζί σας σύντομα.
                </p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Εκδήλωση Ενδιαφέροντος</CardTitle>
            <CardDescription>Συμπληρώστε τη φόρμα για να επικοινωνήσουμε μαζί σας για το ακίνητο "{unitName}".</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact-name">Όνομα</Label>
                        <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="contact-message">Μήνυμα (Προαιρετικό)</Label>
                    <Textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="π.χ. θα ήθελα να κανονίσω μια επίσκεψη..." />
                </div>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                    Ενδιαφέρομαι
                </Button>
            </form>
        </CardContent>
    </Card>
  );
}
