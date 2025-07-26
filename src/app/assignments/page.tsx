
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function AssignmentsPage() {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Οι Αναθέσεις μου</h1>
             <Card>
                <CardHeader>
                    <CardTitle>My Assignments</CardTitle>
                    <CardDescription>
                        This page will list all tasks and work stages assigned to you.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <h3 className="mt-4 text-lg font-medium">Assignments page is under construction</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                           Check back later to see your assigned tasks.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
