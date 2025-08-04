'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Ruler
} from 'lucide-react';
import { StorageUnit } from '@/lib/types/storage';
import { formatPrice, formatArea, getPricePerSqm, getTypeLabel } from './storage-card-utils';

interface StorageCardContentProps {
  unit: StorageUnit;
}

export function StorageCardContent({ unit }: StorageCardContentProps) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-sm text-foreground truncate">
            {unit.code}
          </h4>
          <Badge variant="outline" className="text-xs">
            {getTypeLabel(unit.type)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {unit.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Building className="w-3 h-3" />
            <span>Όροφος</span>
          </div>
          <div className="font-medium text-foreground">{unit.floor}</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Ruler className="w-3 h-3" />
            <span>Επιφάνεια</span>
          </div>
          <div className="font-medium text-foreground">{formatArea(unit.area)}</div>
        </div>
      </div>

      <div className="pt-2 border-t border-border/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Τιμή</div>
            <div className="font-bold text-green-600">{formatPrice(unit.price)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">€/m²</div>
            <div className="font-medium text-foreground">{getPricePerSqm(unit).toLocaleString('el-GR')}€</div>
          </div>
        </div>
      </div>
    </>
  );
}
