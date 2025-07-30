
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Attachment, Unit } from '@/lib/types/attachments';

interface AttachmentsListTableProps {
  attachments: Attachment[];
  unitsMap: Map<string, Unit>;
  onEdit: (attachment: Attachment) => void;
}

export function AttachmentsListTable({ attachments, unitsMap, onEdit }: AttachmentsListTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Τύπος</TableHead>
          <TableHead>Λεπτομέρειες</TableHead>
          <TableHead>Συνδεδεμένο Ακίνητο</TableHead>
          <TableHead>Κατάσταση</TableHead>
          <TableHead className="text-right">Ενέργειες</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attachments.map((attachment) => {
          const parentUnit = attachment.unitId ? unitsMap.get(attachment.unitId) : null;
          return (
            <TableRow key={attachment.id} className="group">
              <TableCell className="font-medium capitalize">{attachment.type}</TableCell>
              <TableCell>{attachment.details || 'N/A'}</TableCell>
              <TableCell>
                {parentUnit ? (
                  <Link href={`/units/${parentUnit.id}`} className="text-primary hover:underline">
                    {parentUnit.name} ({parentUnit.identifier})
                  </Link>
                ) : (
                  <span className="text-muted-foreground">N/A</span>
                )}
              </TableCell>
               <TableCell>
                {attachment.isStandalone ? (
                    <Badge variant="secondary">Ανεξάρτητο</Badge>
                ) : attachment.isBundle ? (
                    <Badge variant="default">Πακέτο</Badge>
                ) : (
                    <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" title="Επεξεργασία" onClick={() => onEdit(attachment)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Επεξεργασία</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
