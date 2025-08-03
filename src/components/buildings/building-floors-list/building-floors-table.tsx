"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, type Floor } from "./building-floors-utils";

interface BuildingFloorsTableProps {
  floors: Floor[];
  onRowClick: (floorId: string) => void;
}

export function BuildingFloorsTable({ floors, onRowClick }: BuildingFloorsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Επίπεδο</TableHead>
          <TableHead>Περιγραφή</TableHead>
          <TableHead>Ημ/νία Δημιουργίας</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {floors.map((floor) => (
          <TableRow
            key={floor.id}
            onClick={() => onRowClick(floor.id)}
            className="cursor-pointer"
          >
            <TableCell className="font-medium">{floor.level}</TableCell>
            <TableCell className="text-muted-foreground">
              {floor.description || "N/A"}
            </TableCell>
            <TableCell>{formatDate(floor.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
