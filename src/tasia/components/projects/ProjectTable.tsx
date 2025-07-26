
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Edit, Trash2, Copy } from 'lucide-react';
import { Company } from '@/shared/hooks/use-data-store';
import {
  formatDate,
  getCompanyName,
} from '@/shared/lib/project-helpers';
import type { ProjectWithWorkStageSummary } from '@/shared/types/project-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { Progress } from '@/shared/components/ui/progress';


interface WorkStageStatusBadgeProps {
    summary: ProjectWithWorkStageSummary['workStageSummary'];
    deadline: ProjectWithWorkStageSummary['deadline'];
}

function WorkStageStatusBadge({ summary, deadline }: WorkStageStatusBadgeProps) {
    if (!summary) {
        return <Badge variant="outline">Δεν έχει οριστεί</Badge>
    }

    let variant: "default" | "secondary" | "destructive" | "outline" = 'outline';
    let label = 'Προπώληση';

    switch(summary.overallStatus) {
        case 'Σε εξέλιξη': variant = 'secondary'; label = 'Σε κατασκευή'; break;
        case 'Καθυστερεί': variant = 'destructive'; label = 'Σε καθυστέρηση'; break;
        case 'Ολοκληρώθηκε': variant = 'default'; label = 'Ολοκληρωμένο'; break;
        default: variant = 'outline'; label = 'Προπώληση'; break;
    }
    
    const tooltipText = `Τρέχον στάδιο: ${summary.currentWorkStageName || 'N/A'}. Εκτιμ. ολοκλήρωση: ${formatDate(deadline)}`;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex flex-col gap-1.5 w-40">
                    <div className="flex justify-between items-center">
                        <Badge variant={variant} className="whitespace-nowrap">{label}</Badge>
                        <span className="text-xs font-medium text-muted-foreground">{Math.round(summary.progress)}%</span>
                    </div>
                    <Progress value={summary.progress} className="h-1.5" />
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    )
}

interface ProjectTableProps {
  projects: ProjectWithWorkStageSummary[];
  companies: Company[];
  isEditor: boolean;
  onEdit: (project: ProjectWithWorkStageSummary) => void;
  onDuplicate: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectTable({
  projects,
  companies,
  isEditor,
  onEdit,
  onDuplicate,
  onDelete,
}: ProjectTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'index';

  const handleRowClick = (e: React.MouseEvent, projectId: string) => {
    // Prevent navigation if a button inside the row was clicked
    if ((e.target as HTMLElement).closest('[data-action-button]')) {
      return;
    }
    router.push(`/projects/${projectId}?view=${view}`);
  };

  return (
    <TooltipProvider>
        <div className="overflow-x-auto">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Τίτλος</TableHead>
                <TableHead>Εταιρεία</TableHead>
                <TableHead>Τοποθεσία</TableHead>
                <TableHead>Πρόοδος Κατασκευής</TableHead>
                {isEditor && <TableHead className="text-right">Ενέργειες</TableHead>}
            </TableRow>
            </TableHeader>
            <TableBody>
            {projects.map((project) => (
                <TableRow
                key={project.id}
                onClick={(e) => handleRowClick(e, project.id)}
                className="group cursor-pointer"
                >
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell className="text-muted-foreground">
                    {getCompanyName(project.companyId, companies)}
                </TableCell>
                <TableCell className="text-muted-foreground">{project.location}</TableCell>
                <TableCell>
                   <WorkStageStatusBadge
                        summary={project.workStageSummary}
                        deadline={project.deadline}
                    />
                </TableCell>
                {isEditor && (
                    <TableCell className="text-right">
                    <div
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1"
                        data-action-button="true"
                    >
                        <Button
                        variant="ghost"
                        size="icon"
                        title="Αντιγραφή"
                        onClick={(e) => { e.stopPropagation(); onDuplicate(project.id)}}
                        >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Αντιγραφή</span>
                        </Button>
                        <Button
                        variant="ghost"
                        size="icon"
                        title="Επεξεργασία"
                         onClick={(e) => { e.stopPropagation(); onEdit(project)}}
                        >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Επεξεργασία</span>
                        </Button>
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                            variant="ghost"
                            size="icon"
                            title="Διαγραφή"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => e.stopPropagation()}
                            >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Διαγραφή</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                            <AlertDialogDescription>
                                Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το
                                έργο "{project.title}".
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete(project.id)}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Διαγραφή
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    </TableCell>
                )}
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    </TooltipProvider>
  );
}
