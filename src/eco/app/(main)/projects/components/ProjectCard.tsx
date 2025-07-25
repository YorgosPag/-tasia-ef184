
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, AlertTriangle, Calendar, ExternalLink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Project } from '../hooks/useEcoProjects';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(value);
};

const formatDate = (date?: Date) => {
    if (!date) return '-';
    return format(date, 'dd/MM/yyyy');
};

const statusStyles: Record<Project['derivedStatus'], { badge: string, progress: string }> = {
    "Εντός Χρονοδιαγράμματος": { badge: "bg-blue-100 text-blue-800 border-blue-200", progress: "bg-blue-500" },
    "Σε Καθυστέρηση": { badge: "bg-amber-100 text-amber-800 border-amber-200", progress: "bg-amber-500" },
    "Ολοκληρωμένο": { badge: "bg-green-100 text-green-800 border-green-200", progress: "bg-green-500" },
    "Προσφορά": { badge: "bg-yellow-100 text-yellow-800 border-yellow-200", progress: "bg-yellow-500" },
    "Ακυρωμένο": { badge: "bg-gray-100 text-gray-800 border-gray-200", progress: "bg-gray-500" },
}

export function ProjectCard({ project }: { project: Project }) {
  const { 
    id, 
    ownerName, 
    applicationId, 
    title, 
    derivedStatus, 
    notifications, 
    progress, 
    deadline, 
    totalBudget 
  } = project;

  const styles = statusStyles[derivedStatus];

  return (
    <Card className="flex flex-col group transition-all duration-200 hover:border-primary/50 hover:shadow-md">
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-semibold text-card-foreground">{ownerName}</p>
                    <p className="text-xs text-muted-foreground">Αρ. Αίτησης: {applicationId}</p>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1">
                        <Button variant="ghost" className="w-full justify-start text-sm" onClick={() => alert('Edit')}>Επεξεργασία</Button>
                        <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive" onClick={() => alert('Delete')}>Διαγραφή</Button>
                    </PopoverContent>
                </Popover>
            </div>
            
            <h3 className="text-base font-bold text-foreground mt-2 flex-grow">{title}</h3>

            <div className="flex items-center gap-2 mt-4">
                <Badge variant="outline" className={cn("font-medium", styles.badge)}>{derivedStatus}</Badge>
                {notifications > 0 && (
                     <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {notifications} Ειδοποίηση
                    </Badge>
                )}
            </div>

            <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Πρόοδος</span>
                    <span className="font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className={cn("h-1.5", styles.progress)} />
            </div>

            <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Calendar className="h-3 w-3 mr-1.5"/>
                Προθεσμία: {formatDate(deadline)}
            </div>
        </div>
        <div className="bg-muted/50 p-4 border-t flex justify-between items-center">
            <p className="text-lg font-bold text-foreground">{formatCurrency(totalBudget)}</p>
            <Button variant="link" className="p-0 h-auto text-primary">
                Προβολή Έργου
                <ExternalLink className="h-4 w-4 ml-1.5" />
            </Button>
        </div>
    </Card>
  );
}
