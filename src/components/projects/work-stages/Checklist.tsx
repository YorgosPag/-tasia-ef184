
'use client';

import React, { useState, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { WorkStage } from '@/app/projects/[id]/page';
import { calculateChecklistProgress } from './utils';


interface ChecklistProps {
    stage: WorkStage;
    onToggle: (itemIndex: number, completed: boolean) => void;
    onAdd: (task: string) => void;
}


export function Checklist({ stage, onToggle, onAdd }: ChecklistProps) {
    const [newTask, setNewTask] = useState('');
    
    const progress = useMemo(() => calculateChecklistProgress(stage.checklist), [stage.checklist]);
    
    const handleAddTask = () => {
        if(newTask.trim()) {
            onAdd(newTask.trim());
            setNewTask('');
        }
    }

    return (
        <div className="mt-4 space-y-3">
            <h4 className="font-semibold">Checklist Εργασιών</h4>
             {stage.checklist && stage.checklist.length > 0 && (
                <div>
                    <Progress value={progress} className="w-full h-2"/>
                    <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progress)}% Ολοκληρώθηκε</p>
                </div>
             )}
            <div className="space-y-2">
                {stage.checklist?.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-muted/50 p-2 rounded-md">
                        <Checkbox 
                            id={`task-${stage.id}-${index}`} 
                            checked={item.completed} 
                            onCheckedChange={(checked) => onToggle(index, !!checked)}
                        />
                        <Label htmlFor={`task-${stage.id}-${index}`} className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>{item.task}</Label>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Νέα εργασία..." onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
                <Button size="sm" onClick={handleAddTask}><Plus className="mr-2 h-4 w-4"/>Προσθήκη</Button>
            </div>
        </div>
    )
}
