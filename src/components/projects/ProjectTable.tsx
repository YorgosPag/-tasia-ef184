
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
} from '@/components/ui/table';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Copy } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { Project, Company } from '@/hooks/use-data-store';
import {
  formatDate,
  getCompanyName,
  getStatusLabel,
  getStatusVariant,
} from '@/lib/project-helpers';

interface ProjectTableProps {
  projects: Project[];
  companies: Company[];
  isEditor: boolean;
  onEdit: (project: Project) => void;
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Τίτλος</TableHead>
            <TableHead>Εταιρεία</TableHead>
            <TableHead>Τοποθεσία</TableHead>
            <TableHead>Προθεσμία</TableHead>
            <TableHead>Κατάσταση</TableHead>
            {isEditor && <TableHead className="text-right">Ενέργειες</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              onClick={(e) => handleRowClick(e, project.id)}
              className="cursor-pointer group"
            >
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {getCompanyName(project.companyId, companies)}
              </TableCell>
              <TableCell className="text-muted-foreground">{project.location}</TableCell>
              <TableCell>{formatDate(project.deadline)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(project.status)}>
                  {getStatusLabel(project.status)}
                </Badge>
              </TableCell>
              {isEditor && (
                <TableCell className="text-right">
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1"
                    data-action-button
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Αντιγραφή"
                      onClick={() => onDuplicate(project.id)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Αντιγραφή</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Επεξεργασία"
                      onClick={() => onEdit(project)}
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
  );
}
