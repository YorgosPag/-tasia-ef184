
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { ProjectWithWorkStageSummary as Project } from '@/lib/types/project-types';

interface MaterialsSectionProps {
    project: Project;
}

export function MaterialsSection({ project }: MaterialsSectionProps) {
    
    // Placeholder data and state
    const orders: any[] = [];
    const isLoading = false;
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Παραγγελίες & Παραλαβές Υλικών</CardTitle>
                    <Button size="sm" onClick={() => alert('New Order form will open!')}>
                        <PlusCircle className="mr-2" />
                        Νέα Παραγγελία
                    </Button>
                </div>
                 <CardDescription>
                    Διαχείριση όλων των παραγγελιών και παραλαβών υλικών που σχετίζονται με το έργο.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : orders.length > 0 ? (
                    <div>
                        {/* Table or list of orders will go here */}
                        <p>Orders list will be displayed here.</p>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="mt-4 text-lg font-medium">Δεν έχουν καταγραφεί παραγγελίες</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Καταχωρήστε την πρώτη παραγγελία για να ξεκινήσετε.
                        </p>
                        <div className="mt-6">
                             <Button onClick={() => alert('New Order form will open!')}>
                                Καταχώρηση Πρώτης Παραγγελίας
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
