
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function SupplierOffersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Προσφορές Προμηθευτών</CardTitle>
                <CardDescription>
                    Αυτή η ενότητα βρίσκεται υπό κατασκευή. Σύντομα θα μπορείτε να διαχειρίζεστε τις προσφορές από τους προμηθευτές σας.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-40 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Η λειτουργικότητα προσφορών προμηθευτών θα είναι διαθέσιμη σύντομα.</p>
                </div>
            </CardContent>
        </Card>
    );
}
