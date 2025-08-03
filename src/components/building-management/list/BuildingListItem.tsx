'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Building,
  MapPin, 
  Calendar, 
  DollarSign,
  FileText,
  Users,
  Home,
  Building2,
  Eye,
  Edit,
  MoreVertical,
  Star,
  Clock
} from "lucide-react";
import { cn } from '@/lib/utils';
import type { Building } from '@/types/building';

interface BuildingListItemProps {
  building: Building;
  selectedBuildingId: number | undefined;
  onSelectBuilding?: (building: Building) => void;
  toggleFavorite: (buildingId: number) => void;
  favorites: number[];
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export function BuildingListItem({
    building,
    selectedBuildingId,
    onSelectBuilding,
    toggleFavorite,
    favorites,
    getStatusColor,
    getStatusLabel
}: BuildingListItemProps) {
    const getCategoryIcon = (category: string) => {
        switch (category) {
          case 'residential': return <Home className="w-4 h-4" />;
          case 'commercial': return <Building2 className="w-4 h-4" />;
          case 'mixed': return <Users className="w-4 h-4" />;
          case 'industrial': return <Building2 className="w-4 h-4" />;
          default: return <Building2 className="w-4 h-4" />;
        }
    };
    
    const getCategoryLabel = (category: string) => {
        switch (category) {
          case 'residential': return 'Κατοικίες';
          case 'commercial': return 'Εμπορικό';
          case 'mixed': return 'Μικτή Χρήση';
          case 'industrial': return 'Βιομηχανικό';
          default: return category;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('el-GR', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0
        }).format(amount);
    };
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('el-GR');
    };

    return (
        <Card
            className={cn(
                "relative p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md group",
                selectedBuildingId === building.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-primary/50 bg-card hover:bg-muted/50"
            )}
            onClick={() => onSelectBuilding?.(building)}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(building.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Star
                    className={cn(
                        "w-4 h-4 transition-colors",
                        favorites.includes(building.id)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground hover:text-yellow-500"
                    )}
                />
            </button>
            <div className="mb-3">
                <div className="flex items-start gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getCategoryIcon(building.category)}
                        <h4 className="font-medium text-sm text-foreground leading-tight line-clamp-2">
                            {building.name}
                        </h4>
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <Badge
                        variant="secondary"
                        className={cn("text-xs", getStatusColor(building.status).replace('bg-', 'bg-') + ' text-white')}
                    >
                        {getStatusLabel(building.status)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(building.category)}
                    </Badge>
                </div>
                {building.address && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{building.address}</span>
                    </div>
                )}
            </div>
            <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Πρόοδος</span>
                    <span className="font-medium">{building.progress}%</span>
                </div>
                <Progress value={building.progress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                    <p className="text-muted-foreground">Επιφάνεια</p>
                    <p className="font-medium">{building.totalArea.toLocaleString('el-GR')} m²</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Όροφοι</p>
                    <p className="font-medium">{building.floors}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Μονάδες</p>
                    <p className="font-medium">{building.units}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Αξία</p>
                    <p className="font-medium">{formatCurrency(building.totalValue)}</p>
                </div>
            </div>
            {building.completionDate && (
                <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Παράδοση: {formatDate(building.completionDate)}</span>
                    </div>
                </div>
            )}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
                        <DropdownMenuItem onClick={() => toggleFavorite(building.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            {favorites.includes(building.id) ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {selectedBuildingId === building.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
            )}
        </Card>
    );
}
