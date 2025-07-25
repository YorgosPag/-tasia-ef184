

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectInterventionsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Παρεμβάσεις Έργων</CardTitle>
                <CardDescription>
                    Αυτή η ενότητα βρίσκεται υπό κατασκευή. Σύντομα θα μπορείτε να παρακολουθείτε τις παρεμβάσεις για κάθε έργο.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Η λειτουργικότητα παρεμβάσεων έργων θα είναι διαθέσιμη σύντομα.</p>
                </div>
            </CardContent>
        </Card>
    );
}
