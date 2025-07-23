
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { Project } from '@/app/projects/[id]/page';

interface ContractsSectionProps {
    project: Project;
}

export function ContractsSection({ project }: ContractsSectionProps) {
    
    // Placeholder data and state
    const contracts: any[] = [];
    const isLoading = false;
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Συμβόλαια & Συμφωνητικά Έργου</CardTitle>
                    <Button size="sm" onClick={() => alert('New Contract form will open!')}>
                        <PlusCircle className="mr-2" />
                        Νέο Συμβόλαιο
                    </Button>
                </div>
                 <CardDescription>
                    Διαχείριση όλων των συμβατικών εγγράφων που σχετίζονται με το έργο.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : contracts.length > 0 ? (
                    <div>
                        {/* Table or list of contracts will go here */}
                        <p>Contracts list will be displayed here.</p>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="mt-4 text-lg font-medium">Δεν έχουν καταγραφεί συμβόλαια</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Καταχωρήστε το πρώτο συμβόλαιο για να ξεκινήσετε.
                        </p>
                        <div className="mt-6">
                             <Button onClick={() => alert('New Contract form will open!')}>
                                Καταχώρηση Πρώτου Συμβολαίου
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
