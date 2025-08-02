
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ParkingSpot } from './types';

interface ParkingTableMobileProps {
  parkingSpots: ParkingSpot[];
  selectedSpot: ParkingSpot;
  onSelectSpot: (spot: ParkingSpot) => void;
}

export function ParkingTableMobile({ parkingSpots, selectedSpot, onSelectSpot }: ParkingTableMobileProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 p-2">
        {parkingSpots.map((spot) => (
          <Card
            key={spot.id}
            onClick={() => onSelectSpot(spot)}
            className={cn('cursor-pointer', selectedSpot?.id === spot.id && 'border-primary')}
          >
            <CardContent className="p-3 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <p>{spot.code}</p>
                <p>{spot.tm.toFixed(2)} τ.μ.</p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div><span className="font-medium text-muted-foreground">Τύπος:</span> {spot.type}</div>
                <div><span className="font-medium text-muted-foreground">Επίπεδο:</span> {spot.level}</div>
                <div><span className="font-medium text-muted-foreground">Κατάσταση:</span> {spot.status}</div>
                <div><span className="font-medium text-muted-foreground">Ιδιοκτήτης:</span> {spot.owner}</div>
                <div className="col-span-2"><span className="font-medium text-muted-foreground">Από:</span> {spot.registeredBy}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
