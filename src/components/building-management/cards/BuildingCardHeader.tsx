
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  Edit, 
  MoreVertical, 
  Star, 
  Share, 
  Download, 
  Settings,
  Home,
  Building2,
  Users
} from "lucide-react";
import { cn } from '@/lib/utils';
import type { Building } from '@/types/building';

interface BuildingCardHeaderProps {
  building: Building;
  isHovered: boolean;
  isFavorite: boolean;
  setIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  getCategoryIcon: (category: string) => React.ReactNode;
  getCategoryLabel: (category: string) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingCardHeader({ 
  building, 
  isHovered, 
  isFavorite, 
  setIsFavorite,
  getCategoryIcon,
  getCategoryLabel,
  getStatusColor,
  getStatusLabel
}: BuildingCardHeaderProps) {
  return (
    <div className="relative h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50 dark:from-blue-950 dark:via-purple-950 dark:to-blue-900 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full"></div>
        <div className="absolute top-8 right-8 w-6 h-6 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/40 rounded-full"></div>
        <div className="absolute bottom-8 right-4 w-10 h-10 bg-white/20 rounded-full"></div>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">
          {getCategoryIcon(building.category)}
        </div>
      </div>

      <div className={cn(
        "absolute top-4 right-4 z-10 transition-opacity duration-200",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Προβολή Λεπτομερειών</DropdownMenuItem>
            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Επεξεργασία</DropdownMenuItem>
            <DropdownMenuItem><Share className="w-4 h-4 mr-2" />Κοινοποίηση</DropdownMenuItem>
            <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Εξαγωγή Αναφοράς</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsFavorite(!isFavorite)}>
              <Star className={cn("w-4 h-4 mr-2", isFavorite && "text-yellow-500 fill-yellow-500")} />
              {isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
            </DropdownMenuItem>
            <DropdownMenuItem><Settings className="w-4 h-4 mr-2" />Ρυθμίσεις</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs shadow-sm", getStatusColor(building.status).replace('bg-', 'bg-') + ' text-white')}>
            {getStatusLabel(building.status)}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-white/90 text-gray-700 shadow-sm">
            {getCategoryLabel(building.category)}
          </Badge>
        </div>
        {isFavorite && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 filter drop-shadow-sm" />}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className={cn("h-full transition-all duration-500", getStatusColor(building.status).replace('text-', 'bg-'))}
          style={{ width: `${building.progress}%` }}
        />
      </div>
    </div>
  );
}
