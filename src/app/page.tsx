
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { seedDatabase } from "@/lib/seed";
import { Loader2, Database } from "lucide-react";

export default function Home() {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      toast({
        title: "Επιτυχία",
        description: "Η βάση δεδομένων γέμισε με δείγματα δεδομένων.",
      });
    } catch (error) {
      console.error("Failed to seed database:", error);
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: "Δεν ήταν δυνατή η εισαγωγή των δεδομένων.",
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
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use the sidebar on the left to navigate through the property listings. The "Ευρετήριο Ακινήτων" section contains all available properties. More features coming soon!
          </p>
          <div>
             <Button onClick={handleSeed} disabled={isSeeding}>
                {isSeeding ? <Loader2 className="mr-2 animate-spin" /> : <Database className="mr-2" />}
                {isSeeding ? 'Γεμίζει η Βάση...' : 'Γέμισμα Βάσης με Δείγματα'}
             </Button>
             <p className="text-xs text-muted-foreground mt-2">
                Πατήστε για να εισάγετε δείγματα δεδομένων (εταιρείες, έργα, κτίρια, κλπ.).
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
