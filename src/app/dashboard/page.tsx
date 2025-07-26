

'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAuth } from '@/shared/hooks/use-auth';
import { Loader2, Trash2, Database } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { seedTasiaDataAction, clearTasiaDataAction, seedNestorDataAction, clearNestorDataAction } from '@/shared/lib/actions';

export default function DashboardPage() {
    const { user, isAdmin } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (action: () => Promise<{ success: boolean; error?: string; message?: string }>, successMessage: string) => {
        if (!user) return;
        setIsLoading(true);
        const result = await action();
        if (result.success) {
            toast({
                title: "Επιτυχία",
                description: result.message || successMessage,
            });
        } else {
            toast({
                title: "Σφάλμα",
                description: result.error || "Η ενέργεια απέτυχε.",
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight">Τα έργα μας – τα σπίτια του αύριο σήμερα</h1>
            <p className="text-muted-foreground -mt-4">
                Ανακαλύψτε μοναδικά ακίνητα στα πιο σύγχρονα έργα μας. Βρείτε τον χώρο που σας ταιριάζει με ευκολία και ακρίβεια.
            </p>

            {isAdmin && (
                 <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Database/>Διαχείριση Δεδομένων TASIA</CardTitle>
                            <CardDescription>Εισαγωγή ή διαγραφή δεδομένων για την εφαρμογή Real Estate.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Button onClick={() => handleAction(() => seedTasiaDataAction(user!.uid), "Τα δεδομένα για το TASIA φορτώθηκαν.")} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Seed TASIA Data
                            </Button>
                             <Button variant="destructive" onClick={() => handleAction(() => clearTasiaDataAction(user!.uid), "Τα δεδομένα του TASIA διαγράφηκαν.")} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Clear TASIA Data
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Database/>Διαχείριση NESTOR Εξοικονομώ</CardTitle>
                            <CardDescription>Εισαγωγή ή διαγραφή δεδομένων για την εφαρμογή Εξοικονομώ.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                           <Button onClick={() => handleAction(() => seedNestorDataAction(user!.uid), "Τα δεδομένα για το NESTOR φορτώθηκαν.")} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Seed Eco Data
                            </Button>
                            <Button variant="destructive" onClick={() => handleAction(() => clearNestorDataAction(user!.uid), "Τα δεδομένα του NESTOR διαγράφηκαν.")} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Clear Eco Data
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
