'use client';

import React, { useMemo } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import { getStatusVariant, calculateStageProgress } from './utils';
import type { WorkStageWithSubstages } from '@/tasia/app/projects/[id]/types';

interface WorkStageItemProps {
    stage: WorkStageWithSubstages;
    isSubstage: boolean;
}

// Memoize the component to prevent re-renders if props haven't changed.
export const WorkStageItem = React.memo(function WorkStageItem({ stage, isSubstage }: WorkStageItemProps) {
    const progress = useMemo(() => calculateStageProgress(stage), [stage]);

    return (
        <div className="flex items-center gap-4 flex-1">
            <Badge variant={getStatusVariant(stage.status)}>{stage.status}</Badge>
            <span className="font-bold text-base">{stage.name}</span>
            <div className="flex items-center gap-2 ml-auto w-32">
                <Progress value={progress} className="h-2 flex-1" />
                <span className="text-xs font-mono text-muted-foreground">{Math.round(progress)}%</span>
            </div>
        </div>
    )
});
