'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Search, UploadCloud } from 'lucide-react';
import { useComplexEntities } from '@/hooks/useComplexEntities';
import { DataTable } from './DataTable';
import { columns } from './columns';


export function ComplexEntitiesTab() {
    const {
        entities,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        nextPage,
        prevPage,
        canGoNext,
        canGoPrev
    } = useComplexEntities('policeStation'); // Example type

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Εισαγωγή Σύνθετης Λίστας</CardTitle>
                    <CardDescription>
                        Ανεβάστε ένα αρχείο .xlsx ή .csv για μαζική εισαγωγή δεδομένων. Η πρώτη γραμμή πρέπει να περιέχει τις επικεφαλίδες.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Input placeholder="Όνομα Νέας Λίστας..." className="max-w-xs" />
                    <Input type="file" className="max-w-xs" disabled />
                    <Button disabled>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Έναρξη Εισαγωγής (Σύντομα)
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Κατάλογος Οντοτήτων</CardTitle>
                     <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Αναζήτηση σε όνομα, διεύθυνση, περιοχή..."
                            className="pl-10 w-full md:w-1/2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading && <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}
                    {error && <p className="text-destructive text-center">{error}</p>}
                    {!isLoading && !error && (
                         <DataTable
                            columns={columns}
                            data={entities}
                            onNextPage={nextPage}
                            onPrevPage={prevPage}
                            canGoNext={canGoNext}
                            canGoPrev={canGoPrev}
                         />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
