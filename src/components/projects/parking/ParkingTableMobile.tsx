'use client';

import React from 'react';
import type { ParkingSpot } from './types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trash2, Edit } from 'lucide-react';

interface ParkingTableMobileProps {
  parkingSpots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  onSelectSpot: (spot: ParkingSpot) => void;
}

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'Διαθέσιμο': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
        case 'Πουλημένο': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
        case 'Δεσμευμένο': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
        case 'Οικοπεδούχοι': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
};

const formatCurrency = (value: number) => {
    return `€${value.toLocaleString('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


export function ParkingTableMobile({
  parkingSpots,
  selectedSpot,
  onSelectSpot
}: ParkingTableMobileProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {parkingSpots.map((spot) => (
          <Card 
            key={spot.id} 
            className={cn(
              "cursor-pointer transition-all", 
              selectedSpot?.id === spot.id && 'border-primary ring-2 ring-primary/50'
            )}
            onClick={() => onSelectSpot(spot)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="text-lg">{spot.code} - {spot.type}</CardTitle>
                      <CardDescription>{spot.property} - {spot.level}</CardDescription>
                  </div>
                  <Badge variant="outline" className={cn("text-xs", getStatusBadgeClass(spot.status))}>
                    {spot.status}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
                <p><strong>Τ.Μ.:</strong> {spot.tm.toFixed(2)}</p>
                <p><strong>Τιμή:</strong> {formatCurrency(spot.price)}</p>
                <p><strong>Αντ. Αξία:</strong> {formatCurrency(spot.valueWithVat)}</p>
                <p><strong>Ιδιοκτήτης:</strong> {spot.owner}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4"/>
                </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4"/>
                </Button>
                <Button variant="outline" size="sm">
                    Λεπτομέρειες <ArrowRight className="w-4 h-4 ml-2"/>
                </Button>
            </CardFooter>
          </Card>
        ))}
         {parkingSpots.length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            <p>Δεν βρέθηκαν αποτελέσματα.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
