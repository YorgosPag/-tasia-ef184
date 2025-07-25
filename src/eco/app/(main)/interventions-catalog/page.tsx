
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function InterventionsCatalogPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Κατάλογος Παρεμβάσεων</CardTitle>
                <CardDescription>
                    Αυτή η ενότητα βρίσκεται υπό κατασκευή. Σύντομα θα μπορείτε να διαχειρίζεστε τον κατάλογο των διαθέσιμων παρεμβάσεων.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Η λειτουργικότητα καταλόγου παρεμβάσεων θα είναι διαθέσιμη σύντομα.</p>
                </div>
            </CardContent>
        </Card>
    );
}
