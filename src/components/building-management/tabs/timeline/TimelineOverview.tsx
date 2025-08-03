'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Building, Milestone } from '@/types/building';

interface TimelineOverviewProps {
    building: Building;
    milestones: Milestone[];
    daysUntilCompletion: number | null;
}

export function TimelineOverview({ building, milestones, daysUntilCompletion }: TimelineOverviewProps) {
    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Χρονοδιάγραμμα Έργου</h3>
                    <p className="text-sm text-muted-foreground">Παρακολούθηση προόδου και milestones</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">{milestones.filter(m => m.status === 'completed').length} / {milestones.length} ολοκληρώθηκαν</Badge>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Συνολική Πρόοδος</span>
                        <span className="text-2xl font-bold text-blue-600">{building.progress}%</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={building.progress} className="h-4 mb-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center"><div className="text-2xl font-bold text-green-600">{milestones.filter(m => m.status === 'completed').length}</div><div className="text-muted-foreground">Ολοκληρωμένα</div></div>
                        <div className="text-center"><div className="text-2xl font-bold text-blue-600">{milestones.filter(m => m.status === 'in-progress').length}</div><div className="text-muted-foreground">Σε εξέλιξη</div></div>
                        <div className="text-center"><div className="text-2xl font-bold text-gray-600">{milestones.filter(m => m.status === 'pending').length}</div><div className="text-muted-foreground">Εκκρεμεί</div></div>
                        <div className="text-center"><div className="text-2xl font-bold text-purple-600">{daysUntilCompletion ?? '-'}</div><div className="text-muted-foreground">Ημέρες απομένουν</div></div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
