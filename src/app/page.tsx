
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { seedDatabase, clearDatabase } from "@/lib/seed";
import { Loader2, Database, Trash2 } from "lucide-react";

export default function Home() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

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
      <Card>
        <CardHeader>
          <CardTitle>Getting Started & Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use the sidebar on the left to navigate through the property listings. You can manage sample data using the buttons below.
          </p>
          <div className="flex flex-wrap gap-4">
             <div>
                <Button onClick={handleSeedAndClear} disabled={isClearing || isSeeding} variant="destructive">
                    {isClearing ? <Loader2 className="mr-2 animate-spin" /> : <Trash2 className="mr-2" />}
                    {isClearing ? 'Διαγραφή & Γέμισμα...' : 'Καθαρισμός & Γέμισμα Βάσης'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                    ΠΡΟΣΟΧΗ: Διαγράφει τα πάντα και εισάγει νέα δείγματα.
                </p>
             </div>
              <div>
                <Button onClick={handleAppendSeed} disabled={isSeeding || isClearing}>
                    {isSeeding ? <Loader2 className="mr-2 animate-spin" /> : <Database className="mr-2" />}
                    {isSeeding ? 'Προσθήκη...' : 'Προσθήκη Δειγμάτων (Append)'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                    Προσθέτει δείγματα στα υπάρχοντα δεδομένα. Μπορεί να δημιουργήσει διπλότυπα.
                </p>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
