
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Ρυθμίσεις
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>Ρυθμίσεις Εφαρμογής</CardTitle>
                    <CardDescription>
                        Διαχειριστείτε τις ρυθμίσεις και τις προτιμήσεις σας.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Αυτή η σελίδα είναι υπό κατασκευή.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
