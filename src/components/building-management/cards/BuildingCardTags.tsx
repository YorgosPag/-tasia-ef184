
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BuildingCardTagsProps {
  features: string[];
}

export function BuildingCardTags({ features }: BuildingCardTagsProps) {
  if (!features || features.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 pt-2">
      {features.slice(0, 3).map((feature, index) => (
        <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
          {feature}
        </Badge>
      ))}
      {features.length > 3 && (
        <Badge variant="outline" className="text-xs px-2 py-0.5">
          +{features.length - 3}
        </Badge>
      )}
    </div>
  );
}
