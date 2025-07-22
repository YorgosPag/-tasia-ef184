
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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { getStatusClass } from '@/components/floor-plan/utils';
import type { Unit as IUnit } from '@/components/floor-plan/FloorPlanViewer';

interface Unit {
  id: string;
  identifier: string;
  name: string;
  type?: string;
  status: 'Διαθέσιμο' | 'Κρατημένο' | 'Πωλημένο' | 'Οικοπεδούχος';
  createdAt: any;
}

interface UnitsListTableProps {
  units: Unit[];
  isLoading: boolean;
  statusColors: Record<IUnit['status'], string>;
  onAddNewUnit: () => void;
  onEditUnit: (unitId: string) => void;
  onDeleteUnit: (unitId: string) => void;
  onViewUnit: (unitId: string) => void;
}

const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'dd/MM/yyyy');
};

/**
 * A presentation component that displays a list of units in a table.
 * It receives data and callbacks as props and does not manage its own state.
 */
export function UnitsListTable({
  units,
  isLoading,
  statusColors,
  onAddNewUnit,
  onEditUnit,
  onDeleteUnit,
  onViewUnit,
}: UnitsListTableProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Ακίνητα του Ορόφου</h2>
        <Button onClick={onAddNewUnit}>
          <PlusCircle className="mr-2" />
          Νέο Ακίνητο
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : units.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Κωδικός</TableHead>
                  <TableHead>Όνομα/ID</TableHead>
                  <TableHead>Τύπος</TableHead>
                  <TableHead>Κατάσταση</TableHead>
                  <TableHead>Ημ/νία Δημιουργίας</TableHead>
                  <TableHead className="text-right">Ενέργειες</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.map((unit) => {
                  const color = statusColors[unit.status] ?? '#6b7280';
                  return (
                    <TableRow key={unit.id} className="group">
                      <TableCell className="font-medium">{unit.identifier}</TableCell>
                      <TableCell className="font-medium">{unit.name}</TableCell>
                      <TableCell className="text-muted-foreground">{unit.type || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="default" 
                          style={{ backgroundColor: color }}
                          className={getStatusClass(color)}
                        >
                          {unit.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(unit.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => onEditUnit(unit.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Επεξεργασία</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Διαγραφή</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Είστε σίγουροι;</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγραφεί οριστικά το ακίνητο
                                  "{unit.name} ({unit.identifier})".
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
                          <Button variant="outline" size="sm" onClick={() => onViewUnit(unit.id)}>
                            Προβολή
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">Δεν βρέθηκαν ακίνητα για αυτόν τον όροφο.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
