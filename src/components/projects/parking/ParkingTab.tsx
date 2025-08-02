'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { columns, parkingSpots } from './data';
import type { ParkingSpot } from './types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Πουλημένο':
            return 'bg-red-200 text-red-800';
        case 'Δεσμευμένο':
            return 'bg-yellow-200 text-yellow-800';
        case 'Διαθέσιμο':
            return 'bg-green-200 text-green-800';
        case 'Οικοπεδούχοι':
             return 'bg-blue-200 text-blue-800';
        default:
            return 'bg-gray-200 text-gray-800';
    }
};

export function ParkingTab({ parkingSpots: initialParkingSpots }: { parkingSpots: ParkingSpot[] }) {
  const [spots, setSpots] = React.useState(initialParkingSpots);

  return (
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key} style={{ minWidth: `${col.defaultWidth * 10}px` }}>
                                {col.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {spots.map((spot) => (
                        <TableRow key={spot.id}>
                            {columns.map((col) => (
                                <TableCell key={col.key} className="py-2 px-3 text-xs">
                                     {col.key === 'status' ? (
                                        <Badge className={cn("font-medium", getStatusClass(spot.status))}>{spot.status}</Badge>
                                    ) : col.format ? (
                                        col.format((spot as any)[col.key])
                                    ) : (
                                        (spot as any)[col.key]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </div>
  );
}