'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  TrendingUp,
  Users,
  Home,
  Eye,
  Edit,
  MoreVertical,
  Star,
  DollarSign,
  Layers,
  Clock,
  Share,
  Download,
  Settings
} from "lucide-react";
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Building = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  totalArea: number;
  builtArea: number;
  floors: number;
  units: number;
  status: 'active' | 'construction' | 'planned' | 'completed';
  startDate?: string;
  completionDate?: string;
  progress: number;
  totalValue: number;
  image?: string;
  company: string;
  project: string;
  category: 'residential' | 'commercial' | 'mixed' | 'industrial';
  features?: string[];
};

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('el-GR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'text-red-500';
    if (progress < 50) return 'text-yellow-500';
    if (progress < 75) return 'text-blue-500';
    return 'text-green-500';
  };

  const getDaysUntilCompletion = () => {
    if (!building.completionDate) return null;
    const today = new Date();
    const completion = new Date(building.completionDate);
    const diffTime = completion.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilCompletion = getDaysUntilCompletion();

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
        {/* Hero Image/Header */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50 dark:from-blue-950 dark:via-purple-950 dark:to-blue-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-8 right-4 w-10 h-10 bg-white/20 rounded-full"></div>
          </div>

          {/* Building Icon/Logo */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">
              {getCategoryIcon(building.category)}
            </div>
          </div>

          {/* Actions Menu */}
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
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Προβολή Λεπτομερειών
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Επεξεργασία
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="w-4 h-4 mr-2" />
                  Κοινοποίηση
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Εξαγωγή Αναφοράς
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsFavorite(!isFavorite)}>
                  <Star className={cn("w-4 h-4 mr-2", isFavorite && "text-yellow-500 fill-yellow-500")} />
                  {isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Ρυθμίσεις
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status and Favorite */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs shadow-sm", getStatusColor(building.status).replace('bg-', 'bg-') + ' text-white')}>
                {getStatusLabel(building.status)}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-white/90 text-gray-700 shadow-sm">
                {getCategoryLabel(building.category)}
              </Badge>
            </div>
            
            {isFavorite && (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 filter drop-shadow-sm" />
            )}
          </div>

          {/* Progress Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className={cn("h-full transition-all duration-500", getStatusColor(building.status).replace('text-', 'bg-'))}
              style={{ width: `${building.progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6 space-y-4">
          {/* Title and Description */}
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

          {/* Location */}
          {building.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="truncate">{building.address}, {building.city}</span>
            </div>
          )}

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Πρόοδος Έργου</span>
              <span className={cn("font-semibold", getProgressColor(building.progress))}>
                {building.progress}%
              </span>
            </div>
            <Progress value={building.progress} className="h-2" />
          </div>

          {/* Key Metrics */}
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

          {/* Timeline Info */}
          {building.completionDate && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Παράδοση:</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatDate(building.completionDate)}</p>
                  {daysUntilCompletion !== null && (
                    <p className={cn(
                      "text-xs",
                      daysUntilCompletion < 0 ? "text-red-500" : 
                      daysUntilCompletion < 30 ? "text-yellow-600" : "text-green-600"
                    )}>
                      {daysUntilCompletion < 0 
                        ? `${Math.abs(daysUntilCompletion)} ημέρες καθυστέρηση`
                        : daysUntilCompletion === 0 
                        ? "Παράδοση σήμερα!"
                        : `${daysUntilCompletion} ημέρες απομένουν`
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features Tags */}
          {building.features && building.features.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {building.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {feature}
                </Badge>
              ))}
              {building.features.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{building.features.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        {/* Hover overlay effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )} />

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
        )}
      </Card>
    </TooltipProvider>
  );
}