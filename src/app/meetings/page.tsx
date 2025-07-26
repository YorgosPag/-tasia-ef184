
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function MeetingsPage() {
    
    // Placeholder data and state
    const meetings: any[] = [];
    const isLoading = false;
    
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Συσκέψεις</h1>
                 <Button size="sm" onClick={() => alert('New Meeting form will open!')} disabled>
                    <PlusCircle className="mr-2" />
                    Νέα Συνάντηση
                </Button>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Λίστα Συσκέψεων</CardTitle>
                    <CardDescription>
                        Καταγραφή και παρακολούθηση όλων των συναντήσεων που αφορούν τα έργα.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : meetings.length > 0 ? (
                        <div>
                            {/* Table or list of meetings will go here */}
                            <p>Meetings list will be displayed here.</p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="mt-4 text-lg font-medium">Δεν έχουν καταγραφεί συναντήσεις</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Καταγράψτε την πρώτη συνάντηση για να ξεκινήσετε.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
