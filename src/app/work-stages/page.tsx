
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function WorkStagesPage() {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Στάδια Εργασιών</h1>
             <Card>
                <CardHeader>
                    <CardTitle>All Work Stages</CardTitle>
                    <CardDescription>
                        This page will provide an overview of all work stages across all projects.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <h3 className="mt-4 text-lg font-medium">Work Stages page is under construction</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                           Check back later to see a global view of all project work stages.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
