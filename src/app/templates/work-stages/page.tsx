
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function WorkStageTemplatesPage() {

    // Placeholder data and handlers, to be replaced with real logic
    const templates: any[] = [];
    const isLoading = true;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Πρότυπα Σταδίων Εργασίας
                </h1>
                <Button>
                    <PlusCircle className="mr-2" />
                    Νέο Πρότυπο
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Λίστα Προτύπων</CardTitle>
                    <CardDescription>Δημιουργήστε και διαχειριστείτε πρότυπα για να επιταχύνετε τη δημιουργία νέων έργων.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : templates.length > 0 ? (
                        <div>
                            {/* Table or list of templates will go here */}
                            <p>Table with templates...</p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="mt-4 text-lg font-medium">Δεν βρέθηκαν πρότυπα</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Δημιουργήστε το πρώτο σας πρότυπο για να ξεκινήσετε.
                            </p>
                            <div className="mt-6">
                                <Button>
                                    Δημιουργία Πρώτου Προτύπου
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
