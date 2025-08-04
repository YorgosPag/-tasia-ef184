"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import type { StorageUnit } from '@/types/property';
import { STORAGE_TYPE_LABELS } from '@/types/property';

interface PropertyStorageTableProps {
  storageUnits?: StorageUnit[];
}

export function PropertyStorageTable({ storageUnits = [] }: PropertyStorageTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Παρακολουθήματα - Αποθήκες Γενείου
        </CardTitle>
      </CardHeader>
      <CardContent>
        {storageUnits.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Είδος</TableHead>
                <TableHead>Κωδικός</TableHead>
                <TableHead>Τύπος</TableHead>
                <TableHead>Επιφάνεια</TableHead>
                <TableHead>Τιμή</TableHead>
                <TableHead>Αντ.Αξία</TableHead>
                <TableHead>Διαδρομή</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storageUnits.map((storage) => (
                <TableRow key={storage.id}>
                  <TableCell>
                    <Badge variant="outline" className="bg-orange-100 text-orange-800">
                      {STORAGE_TYPE_LABELS[storage.type as keyof typeof STORAGE_TYPE_LABELS]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{storage.code}</TableCell>
                  <TableCell>Σκεπαστή</TableCell>
                  <TableCell>{storage.area} τ.μ.</TableCell>
                  <TableCell>{storage.price}</TableCell>
                  <TableCell>1004.4</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    \\\\Server\\shared\\6. erga\\Palaiologou\\Paleol_...
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-4">Δεν υπάρχουν συνδεδεμένες αποθήκες.</p>
        )}
      </CardContent>
    </Card>
  );
}
