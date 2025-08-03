'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  MapPin, 
  Building, 
  Calendar, 
  Euro, 
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';

interface ProjectListItemProps {
  project: Project;
  selectedProjectId?: number;
  onSelectProject?: (project: Project) => void;
  toggleFavorite: (projectId: number) => void;
  favorites: number[];
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function ProjectListItem({
  project,
  selectedProjectId,
  onSelectProject,
  toggleFavorite,
  favorites,
  getStatusColor,
  getStatusLabel
}: ProjectListItemProps) {
  const isFavorite = favorites.includes(project.id);
  const isSelected = selectedProjectId === project.id;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR');
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'residential': return 'Κατοικίες';
      case 'commercial': return 'Εμπορικά';
      case 'mixed': return 'Μικτή Χρήση';
      case 'industrial': return 'Βιομηχανικά';
      case 'public': return 'Δημόσια';
      default: return category;
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md w-full max-w-full",
        isSelected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={() => onSelectProject?.(project)}
    >
      <CardContent className="p-3 overflow-hidden">
        <div className="space-y-2">
          {/* Header με όνομα και actions */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="font-semibold text-sm truncate">{project.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{project.title}</p>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(project.id);
                }}
              >
                <Heart 
                  className={cn(
                    "w-3 h-3",
                    isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )} 
                />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="w-4 h-4 mr-2" />
                    Προβολή
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="w-4 h-4 mr-2" />
                    Επεξεργασία
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Διαγραφή
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status και Category */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
              <span className="text-xs text-muted-foreground">{getStatusLabel(project.status)}</span>
            </div>
            <Badge variant="outline" className="text-xs py-0 px-1 h-5">
              {getCategoryLabel(project.category)}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{project.address}</span>
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Πρόοδος</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-1" />
          </div>

          {/* Stats - Compact */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Building className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Κτίρια:</span>
              <span className="font-medium">{project.buildingCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Μονάδες:</span>
              <span className="font-medium">{project.unitCount}</span>
            </div>
          </div>

          {/* Value and Date - Compact */}
          <div className="flex items-center justify-between text-xs pt-1 border-t">
            <div className="flex items-center gap-1">
              <Euro className="w-3 h-3 text-green-600" />
              <span className="font-medium text-green-600 text-xs">{formatCurrency(project.totalValue)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{formatDate(project.startDate)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
