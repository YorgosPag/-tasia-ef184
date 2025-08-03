'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock } from "lucide-react";
import { cn } from '@/lib/utils';
import type { Milestone } from '@/types/building';

interface MilestoneItemProps {
    milestone: Milestone;
}

export function MilestoneItem({ milestone }: MilestoneItemProps) {
    const getStatusColor = (status: Milestone['status']) => {
        switch (status) {
            case 'completed': return 'bg-green-500 border-green-500';
            case 'in-progress': return 'bg-blue-500 border-blue-500';
            case 'pending': return 'bg-gray-300 border-gray-300';
            case 'delayed': return 'bg-red-500 border-red-500';
            default: return 'bg-gray-300 border-gray-300';
        }
    };

    const getStatusText = (status: Milestone['status']) => {
        switch (status) {
            case 'completed': return 'Ολοκληρώθηκε';
            case 'in-progress': return 'Σε εξέλιξη';
            case 'pending': return 'Εκκρεμεί';
            case 'delayed': return 'Καθυστέρηση';
            default: return 'Άγνωστο';
        }
    };

    const getTypeIcon = (type: Milestone['type']) => {
        switch (type) {
            case 'start': return '🚀';
            case 'construction': return '🏗️';
            case 'systems': return '⚡';
            case 'finishing': return '🎨';
            case 'delivery': return '🎯';
            default: return '📋';
        }
    };
    
    return (
        <div className="relative flex items-start gap-4">
            <div className={cn("relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 shadow-sm", getStatusColor(milestone.status), milestone.status === 'completed' ? 'text-white' : 'text-gray-600')}>
                <span className="text-lg">{getTypeIcon(milestone.type)}</span>
            </div>
            <div className="flex-1 min-w-0 pb-6">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{milestone.title}</h4>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className={cn("text-xs", milestone.status === 'completed' ? 'bg-green-50 text-green-700 border-green-300' : milestone.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-gray-50 text-gray-700 border-gray-300')}>{getStatusText(milestone.status)}</Badge>
                        <span className="text-sm text-muted-foreground">{new Date(milestone.date).toLocaleDateString('el-GR')}</span>
                    </div>
                </div>
                <p className="text-muted-foreground mb-3">{milestone.description}</p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm"><span>Πρόοδος milestone</span><span className="font-medium">{milestone.progress}%</span></div>
                    <Progress value={milestone.progress} className="h-2" />
                </div>
                {milestone.status === 'in-progress' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"><div className="flex items-center gap-2 text-sm text-blue-800"><Clock className="w-4 h-4" /><span className="font-medium">Επόμενα βήματα:</span></div><ul className="mt-2 text-sm text-blue-700 space-y-1"><li>• Ολοκλήρωση κεντρικού θερμικού συστήματος</li><li>• Εγκατάσταση ανελκυστήρων</li><li>• Τελικός έλεγχος ηλεκτρολογικών</li></ul></div>
                )}
                {milestone.status === 'completed' && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-green-600"><CheckCircle className="w-4 h-4" /><span>Ολοκληρώθηκε στις {new Date(milestone.date).toLocaleDateString('el-GR')}</span></div>
                )}
            </div>
        </div>
    );
}
