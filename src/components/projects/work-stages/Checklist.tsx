
'use client';

import React, { useState, useMemo } from 'react';
import { Progress } from '@/shared/components/ui/progress';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { Plus, FileText, MessageSquare, Save } from 'lucide-react';
import type { WorkStage } from '@/shared/types/project-types';
import { calculateChecklistProgress, formatDate } from '@/components/projects/work-stages/utils';


interface ChecklistProps {
    stage: WorkStage;
    onToggle: (itemIndex: number, completed: boolean) => void;
    onAdd: (task: string) => void;
    onNotesChange: (itemIndex: number, notes: string) => void;
}


export function Checklist({ stage, onToggle, onAdd, onNotesChange }: ChecklistProps) {
    const [newTask, setNewTask] = useState('');
    
    const progress = useMemo(() => calculateChecklistProgress(stage.checklist), [stage.checklist]);
    
    const handleAddTask = () => {
        if(newTask.trim()) {
            onAdd(newTask.trim());
            setNewTask('');
        }
    }

    const isDocument = (taskName: string) => {
        return stage.documents?.includes(taskName);
    }

    return (
        <div className="mt-4 space-y-3">
            <h4 className="font-semibold">Checklist Επιθεώρησης & Εγγράφων</h4>
             {stage.checklist && stage.checklist.length > 0 && (
                <div>
                    <Progress value={progress} className="w-full h-2"/>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progress)}% Ολοκληρώθηκε</p>
                </div>
             )}
            <div className="space-y-2">
                {stage.checklist?.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2 bg-muted/50 p-3 rounded-md">
                        <div className="flex items-center gap-3">
                            <Checkbox 
                                id={`task-${stage.id}-${index}`} 
                                checked={item.completed} 
                                onCheckedChange={(checked) => onToggle(index, !!checked)}
                                disabled={isDocument(item.task)}
                            />
                            <Label htmlFor={`task-${stage.id}-${index}`} className={`flex-1 flex items-center gap-2 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {isDocument(item.task) && <FileText className="h-4 w-4 text-muted-foreground" />}
                                {item.task}
                            </Label>
                        </div>
                        {item.completed && item.completedBy && (
                             <p className="text-xs text-muted-foreground pl-8">
                                Ολοκληρώθηκε από {item.completedBy} στις {formatDate(item.completionDate)}
                             </p>
                        )}
                        <div className="pl-8 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Προσθήκη παρατηρήσεων επιθεώρησης..."
                                defaultValue={item.inspectionNotes || ''}
                                onBlur={(e) => onNotesChange(index, e.target.value)}
                                className="h-8 text-xs flex-1"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Νέα εργασία επιθεώρησης..." onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
                <Button size="sm" onClick={handleAddTask}><Plus className="mr-2 h-4 w-4"/>Προσθήκη Εργασίας</Button>
            </div>
        </div>
    )
}
