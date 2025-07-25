
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function InterventionStagesPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Στάδια Παρεμβάσεων</CardTitle>
                <CardDescription>
                    Αυτή η ενότητα βρίσκεται υπό κατασκευή. Σύντομα θα μπορείτε να ορίζετε τα στάδια για κάθε τύπο παρέμβασης.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Η λειτουργικότητα σταδίων παρεμβάσεων θα είναι διαθέσιμη σύντομα.</p>
                </div>
            </CardContent>
        </Card>
    );
}
