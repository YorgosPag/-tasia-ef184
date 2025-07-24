
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

export default function Home() {
  const { toast } = useToast();
  const [isSeedingTasia, setIsSeedingTasia] = useState(false);
  const [isClearingTasia, setIsClearingTasia] = useState(false);
  const [isSeedingEco, setIsSeedingEco] = useState(false);
  const [isClearingEco, setIsClearingEco] = useState(false);

  const handleSeedTasia = async () => {
    setIsSeedingTasia(true);
    const result = await seedTasiaDataAction();
    if (result.success) {
      toast({ title: 'Επιτυχία', description: 'Τα δεδομένα της TASIA αρχικοποιήθηκαν.' });
    } else {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η αρχικοποίηση απέτυχε: ${result.error}` });
    }
    setIsSeedingTasia(false);
  };

  const handleClearTasia = async () => {
    setIsClearingTasia(true);
    const result = await clearTasiaDataAction();
    if (result.success) {
      toast({ title: 'Επιτυχία', description: 'Τα δεδομένα της TASIA καθαρίστηκαν.' });
    } else {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Ο καθαρισμός απέτυχε: ${result.error}` });
    }
    setIsClearingTasia(false);
  };
  
    const handleSeedEco = async () => {
    setIsSeedingEco(true);
    const result = await seedEcoDataAction();
    if (result.success) {
      toast({ title: 'Επιτυχία', description: 'Τα δεδομένα του NESTOR Εξοικονομώ αρχικοποιήθηκαν.' });
    } else {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Η αρχικοποίηση απέτυχε: ${result.error}` });
    }
    setIsSeedingEco(false);
  };

  const handleClearEco = async () => {
    setIsClearingEco(true);
    const result = await clearEcoDataAction();
    if (result.success) {
      toast({ title: 'Επιτυχία', description: 'Τα δεδομένα του NESTOR Εξοικονομώ καθαρίστηκαν.' });
    } else {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: `Ο καθαρισμός απέτυχε: ${result.error}` });
    }
    setIsClearingEco(false);
  };


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
              <Button onClick={handleSeedTasia} disabled={isSeedingTasia || isClearingTasia} className="flex-1">
                {isSeedingTasia ? <Loader2 className="mr-2 animate-spin" /> : <Database className="mr-2" />}
                Seed TASIA Data
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isSeedingTasia || isClearingTasia} className="flex-1">
                    {isClearingTasia ? <Loader2 className="mr-2 animate-spin" /> : <Trash2 className="mr-2" />}
                    Clear TASIA Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Είστε βέβαιοι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει ΟΛΑ τα δεδομένα της TASIA (Έργα, Κτίρια, Ακίνητα κλπ). Τα δεδομένα του Εξοικονομώ θα παραμείνουν.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={handleClearTasia} className="bg-destructive hover:bg-destructive/90">Ναι, διαγραφή</AlertDialogAction></AlertDialogFooter>
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
              <Button onClick={handleSeedEco} disabled={isSeedingEco || isClearingEco} className="flex-1">
                {isSeedingEco ? <Loader2 className="mr-2 animate-spin" /> : <Database className="mr-2" />}
                Seed Eco Data
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isSeedingEco || isClearingEco} className="flex-1">
                    {isClearingEco ? <Loader2 className="mr-2 animate-spin" /> : <Trash2 className="mr-2" />}
                    Clear Eco Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Είστε βέβαιοι;</AlertDialogTitle><AlertDialogDescription>Αυτή η ενέργεια θα διαγράψει ΟΛΑ τα δεδομένα του Εξοικονομώ (Λίστες, Επαφές κλπ). Τα δεδομένα της TASIA θα παραμείνουν.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter><AlertDialogCancel>Ακύρωση</AlertDialogCancel><AlertDialogAction onClick={handleClearEco} className="bg-destructive hover:bg-destructive/90">Ναι, διαγραφή</AlertDialogAction></AlertDialogFooter>
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
