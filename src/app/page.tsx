
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { seedDatabase } from "@/lib/seed";
import { clearDatabase } from "@/lib/clear";
import { Loader2, Database, Trash2, FileUp, Home as HomeIcon, Link as LinkIcon, Link2Off, Wallet, CheckCircle, Clock, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { processImportFile } from "@/lib/importer";
import { useAuth } from "@/hooks/use-auth";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import Link from 'next/link';

// --- Interfaces ---
interface Unit {
  id: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
}
interface Attachment {
  id: string;
  unitId?: string;
}

// --- Data Fetching ---
async function fetchDashboardData(): Promise<{ units: Unit[], attachments: Attachment[] }> {
    const unitsSnapshot = await getDocs(query(collection(db, 'units')));
    const units = unitsSnapshot.docs.map(doc => doc.data() as Unit);

    const attachmentsSnapshot = await getDocs(query(collection(db, 'attachments')));
    const attachments = attachmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Attachment));

    return { units, attachments };
}

export default function Home() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  const { data: dashboardData, isLoading, isError } = useQuery({
      queryKey: ['dashboardStats'],
      queryFn: fetchDashboardData,
  });

  const stats = useMemo(() => {
    if (!dashboardData) {
        return {
            units: { 'Διαθέσιμο': 0, 'Κρατημένο': 0, 'Πωλημένο': 0, 'Οικοπεδούχος': 0, total: 0 },
            attachments: { linked: 0, unlinked: 0, total: 0 }
        };
    }
    const unitStats = dashboardData.units.reduce((acc, unit) => {
        acc[unit.status] = (acc[unit.status] || 0) + 1;
        return acc;
    }, {} as Record<Unit['status'], number>);
    
    const attachmentStats = dashboardData.attachments.reduce((acc, attachment) => {
        if (attachment.unitId) acc.linked++;
        else acc.unlinked++;
        return acc;
    }, { linked: 0, unlinked: 0 });

    return {
        units: { 
            'Διαθέσιμο': unitStats['Διαθέσιμο'] || 0,
            'Κρατημένο': unitStats['Κρατημένο'] || 0,
            'Πωλημένο': unitStats['Πωλημένο'] || 0,
            'Οικοπεδούχος': unitStats['Οικοπεδούχος'] || 0,
            total: dashboardData.units.length,
        },
        attachments: { 
            ...attachmentStats,
            total: dashboardData.attachments.length,
        }
    }

  }, [dashboardData]);


  const handleSeedAndClear = async () => {
    if (!confirm("Είστε σίγουροι; Αυτή η ενέργεια θα διαγράψει ΟΛΑ τα υπάρχοντα δεδομένα και θα τα αντικαταστήσει με νέα δείγματα.")) {
      return;
    }
    setIsClearing(true);
    try {
      await clearDatabase();
      toast({
        title: "Επιτυχής Καθαρισμός",
        description: "Η βάση δεδομένων έχει καθαριστεί.",
      });
      await seedDatabase();
      toast({
        title: "Επιτυχία",
        description: "Η βάση δεδομένων γέμισε με νέα δείγματα δεδομένων.",
      });
    } catch (error) {
      console.error("Failed to clear and seed database:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Η διαδικασία απέτυχε. Ελέγξτε την κονσόλα.",
      });
    } finally {
      setIsClearing(false);
    }
  };
  
  const handleAppendSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      toast({
        title: "Επιτυχία",
        description: "Προστέθηκαν νέα δείγματα δεδομένων στη βάση.",
      });
    } catch (error) {
      console.error("Failed to seed database:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η προσθήκη των δεδομένων.",
      });
    } finally {
      setIsSeeding(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    } else {
      setImportFile(null);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast({ variant: 'destructive', title: 'Σφάλμα', description: 'Παρακαλώ επιλέξτε ένα αρχείο.' });
      return;
    }
    setIsImporting(true);
    try {
      const result = await processImportFile(importFile);
      toast({
        title: 'Η Εισαγωγή Ολοκληρώθηκε',
        description: (
          <div className="text-sm">
            <p>Επεξεργάστηκαν {result.totalRows} γραμμές.</p>
            <p>✅ {result.buildingsCreated} νέα κτίρια</p>
            <p>✅ {result.floorsCreated} νέοι όροφοι</p>
            <p>✅ {result.unitsCreated} νέα ακίνητα</p>
            {result.errors.length > 0 && <p className="font-bold text-destructive">❌ {result.errors.length} σφάλματα (δείτε την κονσόλα)</p>}
          </div>
        ),
        duration: 9000,
      });
      if (result.errors.length > 0) {
        console.error("Import Errors:", result.errors);
      }
    } catch (error: any) {
      console.error("Import failed:", error);
      toast({ variant: 'destructive', title: 'Η Εισαγωγή Απέτυχε', description: error.message });
    } finally {
      setIsImporting(false);
      setImportFile(null);
      // Reset the file input
      const fileInput = document.getElementById('import-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Welcome to TASIA
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your premier real estate index. Navigate properties with ease.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <p className="text-center text-destructive py-8">Σφάλμα κατά τη φόρτωση των στατιστικών.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Διαθέσιμα Ακίνητα</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.units['Διαθέσιμο']}</div>
                    <Link href="/units?status=available" className="text-xs text-muted-foreground hover:underline">
                        Προβολή λίστας
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Κρατημένα Ακίνητα</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.units['Κρατημένο']}</div>
                     <Link href="/units?status=reserved" className="text-xs text-muted-foreground hover:underline">
                        Προβολή λίστας
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Πωλημένα Ακίνητα</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.units['Πωλημένο']}</div>
                    <Link href="/units?status=sold" className="text-xs text-muted-foreground hover:underline">
                        Προβολή λίστας
                    </Link>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Παρακολουθήματα</CardTitle>
                    <HomeIcon className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.attachments.total}</div>
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-green-600">{stats.attachments.linked}</span> συνδεδεμένα, <span className="font-semibold text-orange-600">{stats.attachments.unlinked}</span> ανεξάρτητα
                    </p>
                </CardContent>
            </Card>
        </div>
      )}


      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <Card>
            <CardHeader>
              <CardTitle>Διαχείριση Δειγμάτων</CardTitle>
              <CardDescription>Χρησιμοποιήστε τα παρακάτω κουμπιά για να διαχειριστείτε τα δεδομένα της βάσης.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div>
                    <Button onClick={handleSeedAndClear} disabled={isClearing || isSeeding || isImporting} variant="destructive">
                        {isClearing ? <Loader2 className="mr-2 animate-spin" /> : <Trash2 className="mr-2" />}
                        {isClearing ? 'Διαγραφή & Γέμισμα...' : 'Καθαρισμός & Γέμισμα Βάσης'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        ΠΡΟΣΟΧΗ: Διαγράφει τα πάντα και εισάγει νέα δείγματα.
                    </p>
                </div>
                  <div>
                    <Button onClick={handleAppendSeed} disabled={isSeeding || isClearing || isImporting}>
                        {isSeeding ? <Loader2 className="mr-2 animate-spin" /> : <Database className="mr-2" />}
                        {isSeeding ? 'Προσθήκη...' : 'Προσθήκη Δειγμάτων'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                        Προσθέτει δείγματα στα υπάρχοντα δεδομένα.
                    </p>
                  </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Μαζική Εισαγωγή</CardTitle>
              <CardDescription>Ανεβάστε ένα αρχείο Excel (.xlsx) ή CSV για μαζική εισαγωγή δεδομένων.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  id="import-file-input"
                  type="file" 
                  accept=".xlsx, .csv"
                  onChange={handleFileChange}
                  disabled={isImporting}
                />
                <p className="text-xs text-muted-foreground">
                  Απαιτούμενες στήλες: `projectTitle`, `buildingAddress`, `floorLevel`, `unitIdentifier`.
                </p>
              </div>
              <Button onClick={handleImport} disabled={!importFile || isImporting}>
                  {isImporting ? <Loader2 className="mr-2 animate-spin" /> : <FileUp className="mr-2" />}
                  {isImporting ? 'Γίνεται Εισαγωγή...' : 'Έναρξη Εισαγωγής'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
