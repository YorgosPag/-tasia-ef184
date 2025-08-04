'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TooltipProvider } from "@/components/ui/tooltip";
import { BuildingCardHeader } from './cards/BuildingCardHeader';
import { BuildingCardBody } from './cards/BuildingCardBody';
import { BuildingCardFooter } from './cards/BuildingCardFooter';
import { BuildingCardTags } from './cards/BuildingCardTags';
import type { Building } from '@/types/building';
import { Home, Building2, Users } from 'lucide-react';

interface BuildingCardProps {
  building: Building;
  isSelected: boolean;
  onClick: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingCard({ 
  building, 
  isSelected, 
  onClick,
  getStatusColor,
  getStatusLabel 
}: BuildingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const getCategoryIcon = (category: string) => {
    const icons = {
      residential: <Home className="w-4 h-4" />,
      commercial: <Building2 className="w-4 h-4" />,
      mixed: <Users className="w-4 h-4" />,
      industrial: <Building2 className="w-4 h-4" />,
    };
    return icons[category as keyof typeof icons] || <Building2 className="w-4 h-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      residential: 'Κατοικίες',
      commercial: 'Εμπορικό',
      mixed: 'Μικτή Χρήση',
      industrial: 'Βιομηχανικό',
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <TooltipProvider>
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group border-2",
          isSelected 
            ? "border-blue-500 shadow-lg ring-2 ring-blue-200 dark:ring-blue-800" 
            : "border-border hover:border-blue-300 hover:shadow-lg",
          "transform hover:scale-[1.02]"
        )}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BuildingCardHeader
            building={building}
            isHovered={isHovered}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
            getCategoryIcon={getCategoryIcon}
            getCategoryLabel={getCategoryLabel}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
        />

        <CardContent className="p-6 space-y-4">
          <BuildingCardBody building={building} />
          <BuildingCardFooter building={building} />
          <BuildingCardTags features={building.features || []} />
        </CardContent>

        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        {isSelected && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
      </Card>
    </TooltipProvider>
  );
}
