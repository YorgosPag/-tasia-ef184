
'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  MapPin, 
  DollarSign
} from "lucide-react";
import { cn } from '@/lib/utils';
import type { Building } from '@/types/building';

interface BuildingCardBodyProps {
  building: Building;
}

export function BuildingCardBody({ building }: BuildingCardBodyProps) {
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'text-red-500';
    if (progress < 50) return 'text-yellow-500';
    if (progress < 75) return 'text-blue-500';
    return 'text-green-500';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
    
  return (
    <>
      <div>
        <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {building.name}
        </h3>
        {building.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {building.description}
          </p>
        )}
      </div>

      {building.address && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{building.address}, {building.city}</span>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Πρόοδος Έργου</span>
          <span className={cn("font-semibold", getProgressColor(building.progress))}>
            {building.progress}%
          </span>
        </div>
        <Progress value={building.progress} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Επιφάνεια</p>
          <p className="text-sm font-semibold">{building.totalArea.toLocaleString('el-GR')} m²</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Όροφοι</p>
          <p className="text-sm font-semibold">{building.floors}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Μονάδες</p>
          <p className="text-sm font-semibold">{building.units}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Αξία</p>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm font-semibold text-green-600">
                {formatCurrency(building.totalValue)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Συνολική αξία έργου</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
