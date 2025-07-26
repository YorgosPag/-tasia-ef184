
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { Project } from '@/tasia/app/projects/[id]/page';

interface MeetingsSectionProps {
    project: Project;
}

export function MeetingsSection({ project }: MeetingsSectionProps) {
    
    // Placeholder data and state
    const meetings: any[] = [];
    const isLoading = false;
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Συσκέψεις Έργου</CardTitle>
                    <Button size="sm" onClick={() => alert('New Meeting form will open!')}>
                        <PlusCircle className="mr-2" />
                        Νέα Συνάντηση
                    </Button>
                </div>
                 <CardDescription>
                    Καταγραφή και παρακολούθηση όλων των συναντήσεων που αφορούν το έργο.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : meetings.length > 0 ? (
                    <div>
                        {/* Accordion or list of meetings will go here */}
                        <p>Meetings list will be displayed here.</p>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="mt-4 text-lg font-medium">Δεν έχουν καταγραφεί συναντήσεις</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Καταγράψτε την πρώτη συνάντηση για να ξεκινήσετε.
                        </p>
                        <div className="mt-6">
                             <Button onClick={() => alert('New Meeting form will open!')}>
                                Καταγραφή Πρώτης Συνάντησης
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
