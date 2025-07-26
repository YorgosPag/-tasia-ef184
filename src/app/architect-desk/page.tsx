
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function ArchitectDeskPage() {
    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Architect's Desk</h1>
             <Card>
                <CardHeader>
                    <CardTitle>Architect's Dashboard</CardTitle>
                    <CardDescription>
                        This is a dedicated space for architects to manage their tasks and designs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12">
                        <h3 className="mt-4 text-lg font-medium">Architect's Desk is under construction</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This page will soon contain tools and information relevant to architects.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
