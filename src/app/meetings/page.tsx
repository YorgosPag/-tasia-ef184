
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function MeetingsPage() {

    // Placeholder data and handlers, to be replaced with real logic
    const meetings: any[] = [];
    const isLoading = true;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Συσκέψεις
                </h1>
                <Button>
                    <PlusCircle className="mr-2" />
                    Νέα Συνάντηση
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Λίστα Όλων των Συναντήσεων</CardTitle>
                    <CardDescription>Συγκεντρωτική προβολή όλων των συναντήσεων από όλα τα έργα.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : meetings.length > 0 ? (
                        <div>
                            {/* Table or list of meetings will go here */}
                            <p>Table with meetings...</p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="mt-4 text-lg font-medium">Δεν βρέθηκαν συναντήσεις</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Δεν έχει καταγραφεί καμία συνάντηση σε κανένα έργο.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
