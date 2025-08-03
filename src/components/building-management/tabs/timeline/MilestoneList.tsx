'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MilestoneItem } from './MilestoneItem';
import type { Milestone } from '@/types/building';

interface MilestoneListProps {
    milestones: Milestone[];
}

export function MilestoneList({ milestones }: MilestoneListProps) {
    return (
        <Card>
            <CardHeader><CardTitle>Λεπτομερή Milestones</CardTitle></CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                        {milestones.map((milestone) => (
                            <MilestoneItem key={milestone.id} milestone={milestone} />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
