'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  MoreVertical,
  Star, 
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StorageUnit } from '@/types/storage';
import { cn } from '@/lib/utils';
import { getTypeIcon, getTypeColor, getStatusColor, getStatusLabel } from './storage-card-utils.tsx';

interface StorageCardHeaderProps {
  unit: StorageUnit;
  isHovered: boolean;
  isFavorite: boolean;
  isSelected: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function StorageCardHeader({
  unit,
  isHovered,
  isFavorite,
  isSelected,
  onEdit,
  onDelete,
  onToggleFavorite,
}: StorageCardHeaderProps) {
  return (
    <div className={cn(
      "h-20 relative overflow-hidden",
      unit.type === 'storage' 
        ? "bg-gradient-to-br from-purple-100 via-blue-50 to-purple-100" 
        : "bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-100"
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full"></div>
        <div className="absolute top-4 right-4 w-4 h-4 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-2 left-6 w-3 h-3 bg-white/40 rounded-full"></div>
        <div className="absolute bottom-3 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
      </div>

      {/* Type Icon */}
      <div className="absolute top-3 left-3 z-10">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 shadow-sm",
          getTypeColor(unit.type)
        )}>
          {getTypeIcon(unit.type)}
        </div>
      </div>

      {/* Actions Menu */}
      <div className={cn(
        "absolute top-3 right-3 z-10 transition-opacity duration-200",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Eye className="w-4 h-4 mr-2" />
              Προβολή
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Edit className="w-4 h-4 mr-2" />
              Επεξεργασία
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}>
              <Star className={cn("w-4 h-4 mr-2", isFavorite && "text-yellow-500 fill-yellow-500")} />
              {isFavorite ? 'Αφαίρεση' : 'Προσθήκη'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Διαγραφή
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status Badge */}
      <div className="absolute bottom-2 left-3 z-10">
        <Badge 
          className={cn(
            "text-xs text-white shadow-sm",
            getStatusColor(unit.status)
          )}
        >
          {getStatusLabel(unit.status)}
        </Badge>
      </div>

      {/* Favorite Star */}
      {isFavorite && (
        <div className="absolute bottom-2 right-3 z-10">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 filter drop-shadow-sm" />
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
      )}
    </div>
  );
}
