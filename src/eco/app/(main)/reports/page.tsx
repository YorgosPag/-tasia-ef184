
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Αναφορές</CardTitle>
                <CardDescription>
                    Αυτή η ενότητα βρίσκεται υπό κατασκευή. Σύντομα θα μπορείτε να εξάγετε προσαρμοσμένες αναφορές για τα έργα σας.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Η λειτουργικότητα αναφορών θα είναι διαθέσιμη σύντομα.</p>
                </div>
            </CardContent>
        </Card>
    );
}
