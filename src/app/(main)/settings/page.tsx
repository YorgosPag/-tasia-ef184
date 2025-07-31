"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  clearTasiaDataAction,
  seedTasiaDataAction,
} from "@/lib/actions";

export default function SettingsPage() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleSeed = async () => {
    if (!user) return;
    setIsSeeding(true);
    const result = await seedTasiaDataAction(user.uid);
    if (result.success) {
      toast({
        title: "Επιτυχία",
        description: result.message || "Τα δεδομένα δημιουργήθηκαν.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: result.error,
      });
    }
    setIsSeeding(false);
  };

  const handleClear = async () => {
    if (!user) return;
    if (
      !confirm(
        "Είστε απολύτως σίγουροι; Αυτή η ενέργεια θα διαγράψει ΟΛΑ τα δεδομένα της TASIA (Έργα, Επαφές, κλπ.) και ΔΕΝ ΜΠΟΡΕΙ να αναιρεθεί.",
      )
    ) {
      return;
    }
    setIsClearing(true);
    const result = await clearTasiaDataAction(user.uid);
    if (result.success) {
      toast({
        title: "Επιτυχία",
        description: "Η βάση δεδομένων της TASIA εκκαθαρίστηκε.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Σφάλμα",
        description: result.error,
      });
    }
    setIsClearing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ρυθμίσεις</h1>

      <Card>
        <CardHeader>
          <CardTitle>Προφίλ Χρήστη</CardTitle>
          <CardDescription>
            Τα στοιχεία του λογαριασμού σας, όπως φαίνονται από την Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <p>
                <strong>Όνομα:</strong> {user.displayName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>UID:</strong> {user.uid}
              </p>
            </div>
          ) : (
            <p>Φόρτωση χρήστη...</p>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Επικίνδυνες Ενέργειες
            </CardTitle>
            <CardDescription>
              Αυτές οι ενέργειες επηρεάζουν ολόκληρη τη βάση δεδομένων και δεν
              μπορούν να αναιρεθούν.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">TASIA App</h3>
              <div className="flex gap-4 mt-2">
                <Button
                  variant="outline"
                  onClick={handleSeed}
                  disabled={isSeeding || isClearing}
                >
                  {isSeeding && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Seed TASIA Data
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClear}
                  disabled={isSeeding || isClearing}
                >
                  {isClearing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Clear TASIA Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
