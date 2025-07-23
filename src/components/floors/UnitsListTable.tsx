
'use client';

import React from 'react';
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
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, Edit, Trash2, Copy } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { getStatusClass } from '@/components/floor-plan/utils';
import type { Unit as IUnit } from '@/components/floor-plan/FloorPlanViewer';
import type { AttachmentFormValues } from '@/components/units/AttachmentDialog';
import { cn } from '@/lib/utils';

interface Unit {
  id: string;
  identifier?: string; // Optional for attachments
  name?: string; // Optional for attachments
  type: string;
  status?: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
  createdAt?: any;
  details?: string;
  area?: number | string;
  price?: number | string;
  sharePercentage?: number | string;
  isStandalone?: boolean;
}

interface UnitsListTableProps {
  units: (Unit | AttachmentFormValues)[];
  isLoading?: boolean;
  statusColors?: Record<IUnit['status'], string>;
  highlightedUnitId?: string | null;
  onAddNewUnit?: () => void;
  onEditUnit: (unit: any) => void;
  onDeleteUnit: (unitId: string) => void;
  onViewUnit?: (unitId: string) => void;
  onDuplicateUnit?: (unitId: string) => void;
  setHighlightedUnitId?: (id: string | null) => void;
}

const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
};

/**
 * A presentation component that displays a list of units or attachments in a table.
 * It receives data and callbacks as props and does not manage its own state.
 */
export function UnitsListTable({
  units,
  isLoading,
  statusColors,
  highlightedUnitId,
  onAddNewUnit,
  onEditUnit,
  onDeleteUnit,
  onViewUnit,
  onDuplicateUnit,
  setHighlightedUnitId,
}: UnitsListTableProps) {
  
  const isAttachmentList = units.length > 0 && units[0].hasOwnProperty('details');
  
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  if (units.length === 0) {
      return (
        <div className="text-center py-8">
            <p className="text-muted-foreground">Δεν βρέθηκαν εγγραφές.</p>
            {onAddNewUnit && <Button onClick={onAddNewUnit} className="mt-4"><PlusCircle className="mr-2"/>Προσθήκη</Button>}
        </div>
      )
  }

  return (
    <div className="w-full overflow-x-auto border rounded-lg">
        <Table>
        <TableHeader>
            <TableRow>
            {isAttachmentList ? (
                <>
                    <TableHead>Τύπος</TableHead>
                    <TableHead>Λεπτομέρειες</TableHead>
                    <TableHead>Εμβαδόν</TableHead>
                    <TableHead>Τιμή</TableHead>
                    <TableHead>%</TableHead>
                    <TableHead>Ανεξάρτητο</TableHead>
                </>
            ) : (
                <>
                    <TableHead>Κωδικός</TableHead>
                    <TableHead>Όνομα/ID</TableHead>
                    <TableHead>Τύπος</TableHead>
                    <TableHead>Κατάσταση</TableHead>
                    <TableHead>Ημ/νία Δημιουργίας</TableHead>
                </>
            )}
            <TableHead className="text-right">
                {onAddNewUnit && !isAttachmentList && (
                    <Button variant="ghost" size="sm" onClick={onAddNewUnit}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Νέο Ακίνητο
                    </Button>
                )}
            </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {units.map((item) => {
            const unit = item as Unit;
            const attachment = item as AttachmentFormValues;
            const color = unit.status && statusColors ? statusColors[unit.status] ?? '#6b7280' : '#6b7280';
            const isHighlighted = highlightedUnitId === unit.id;

            return (
                <TableRow 
                  key={unit.id}
                  className={cn("group transition-colors", isHighlighted && "bg-primary/10")}
                  onMouseEnter={() => setHighlightedUnitId?.(unit.id)}
                  onMouseLeave={() => setHighlightedUnitId?.(null)}
                >
                {isAttachmentList ? (
                    <>
                        <TableCell className="font-medium capitalize">{attachment.type}</TableCell>
                        <TableCell>{attachment.details || 'N/A'}</TableCell>
                        <TableCell>{attachment.area ? `${attachment.area} τ.μ.` : 'N/A'}</TableCell>
                        <TableCell>{attachment.price ? `€${attachment.price}`: 'N/A'}</TableCell>
                        <TableCell>{attachment.sharePercentage ? `${attachment.sharePercentage}%` : 'N/A'}</TableCell>
                        <TableCell>{attachment.isStandalone ? 'Ναι' : 'Όχι'}</TableCell>
                    </>
                ) : (
                    <>
                        <TableCell className="font-medium">{unit.identifier}</TableCell>
                        <TableCell className="font-medium">{unit.name}</TableCell>
                        <TableCell className="text-muted-foreground">{unit.type || 'N/A'}</TableCell>
                        <TableCell>
                            {unit.status && (
                                <Badge 
                                    variant="default" 
                                    style={{ backgroundColor: color }}
                                    className={getStatusClass(color)}
                                >
                                    {unit.status}
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell>{formatDate(unit.createdAt)}</TableCell>
                    </>
                )}
                <TableCell className="text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-1">
                    {onDuplicateUnit && !isAttachmentList && (
                            <Button variant="ghost" size="icon" title="Αντιγραφή" onClick={() => onDuplicateUnit(unit.id)}>
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Αντιγραφή</span>
                            </Button>
                    )}
                    <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={() => onEditUnit(item)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Επεξεργασία</span>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Διαγραφή" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Διαγραφή</span>
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                            <AlertDialogDescription>
                            Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Ακύρωση</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteUnit(unit.id)} className="bg-destructive hover:bg-destructive/90">
                            Διαγραφή
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    {onViewUnit && !isAttachmentList && (
                        <Button variant="outline" size="sm" onClick={() => onViewUnit(unit.id)}>
                            Προβολή
                        </Button>
                    )}
                    </div>
                </TableCell>
                </TableRow>
            )
            })}
        </TableBody>
        </Table>
    </div>
  );
}
