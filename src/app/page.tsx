
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Database, Trash2, Loader2, Building, HomeIcon } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { seedTasiaDataAction, clearTasiaDataAction, seedEcoDataAction, clearEcoDataAction } from '@/lib/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSeedingTasia, setIsSeedingTasia] = useState(false);
  const [isClearingTasia, setIsClearingTasia] = useState(false);
  const [isSeedingEco, setIsSeedingEco] = useState(false);
  const [isClearingEco, setIsClearingEco] = useState(false);

  const handleAction = async (
    actionFn: (userId: string) => Promise<{ success: boolean; error?: string }>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    successMessage: string,
    failureMessage: string
  ) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Πρέπει να είστε συνδεδεμένος για αυτή την ενέργεια.' });
      return;
    }
    setIsLoading(true);
    const result = await actionFn(user.uid);
    if (result.success) {
      toast({ title: 'Επιτυχία', description: successMessage });
    } else {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `${failureMessage}: ${result.error}` });
    }
    setIsLoading(false);
  };

  const isAnyActionLoading = isSeedingTasia || isClearingTasia || isSeedingEco || isClearingEco;

  return (
    <div className="flex flex-col items-center gap-12 py-10 px-4">
      {/* Admin Controls */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <CardTitle>Διαχείριση Δεδομένων TASIA</CardTitle>
              </div>
              <CardDescription>Εισαγωγή ή διαγραφή δεδομένων για την εφαρμογή Real Estate.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => handleAction(seedTasiaDataAction, setIsSeedingTasia, 'Τα δεδομένα της TASIA αρχικοποιήθηκαν.', 'Η αρχικοποίηση απέτυχε')} disabled={isAnyActionLoading} className="flex-1">
                {isSeedingTasia ? <Loader2 className="mr-2 animate-spin" /> : <Database className="mr-2" />}
                Seed TASIA Data
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isAnyActionLoading} className="flex-1">
                    {isClearingTasia ? <Loader2 className="mr-2 animate-spin" /> : <Trash2 className="mr-2" />}
                    Clear TASIA Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Είστε βέβαιοι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει ΟΛΑ τα δεδομένα της TASIA (Έργα, Κτίρια, Ακίνητα κλπ). Τα δεδομένα του Εξοικονομώ θα παραμείνουν.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleAction(clearTasiaDataAction, setIsClearingTasia, 'Τα δεδομένα της TASIA καθαρίστηκαν.', 'Ο καθαρισμός απέτυχε')} className="bg-destructive hover:bg-destructive/90">Ναι, διαγραφή</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
           <Card className="w-full">
            <CardHeader>
               <div className="flex items-center gap-3">
                <HomeIcon className="h-6 w-6 text-primary" />
                <CardTitle>Διαχείριση NESTOR Εξοικονομώ</CardTitle>
              </div>
              <CardDescription>Εισαγωγή ή διαγραφή δεδομένων για την εφαρμογή Εξοικονομώ.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => handleAction(seedEcoDataAction, setIsSeedingEco, 'Τα δεδομένα του NESTOR Εξοικονομώ αρχικοποιήθηκαν.', 'Η αρχικοποίηση απέτυχε')} disabled={isAnyActionLoading} className="flex-1">
                {isSeedingEco ? <Loader2 className="mr-2 animate-spin" /> : <Database className="mr-2" />}
                Seed Eco Data
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isAnyActionLoading} className="flex-1">
                    {isClearingEco ? <Loader2 className="mr-2 animate-spin" /> : <Trash2 className="mr-2" />}
                    Clear Eco Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Είστε βέβαιοι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει ΟΛΑ τα δεδομένα του Εξοικονομώ (Λίστες, Επαφές κλπ). Τα δεδομένα της TASIA θα παραμείνουν.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={() => handleAction(clearEcoDataAction, setIsClearingEco, 'Τα δεδομένα του NESTOR Εξοικονομώ καθαρίστηκαν.', 'Ο καθαρισμός απέτυχε')} className="bg-destructive hover:bg-destructive/90">Ναι, διαγραφή</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
      </div>
      
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-4 text-center max-w-3xl pt-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
           Τα έργα μας – τα σπίτια του αύριο σήμερα
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Ανακαλύψτε μοναδικά ακίνητα στα πιο σύγχρονα έργα μας. Βρείτε τον χώρο που σας ταιριάζει με ευκολία και ακρίβεια.
        </p>
        <div className="mt-4 w-full max-w-md">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Τι ψάχνετε;"
                className="pl-12 h-12 text-base"
              />
           </div>
           <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button asChild size="lg" className="flex-1">
                    <Link href="/units">
                        Βρες το σπίτι σου
                        <ArrowRight className="ml-2" />
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="flex-1">
                    <Link href="/projects">
                        Δες τα έργα μας
                    </Link>
                </Button>
           </div>
        </div>
      </div>
        <footer className="w-full max-w-6xl mt-12 border-t pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} NestorConstruct. All rights reserved.</p>
            <p className="text-sm mt-2">Τηλέφωνο: 210-1234567 | Email: info@nestorconstruct.gr</p>
        </footer>
    </div>
  );
}
