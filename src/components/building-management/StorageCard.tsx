'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Link,
  MapPin,
  Ruler,
  Euro,
  Building,
  Calendar,
  Star,
  Package,
  Car,
  Zap,
  Shield,
  Lightbulb
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StorageUnit, StorageType, StorageStatus } from '@/types/storage';
import { cn } from '@/lib/utils';

interface StorageCardProps {
  unit: StorageUnit;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getStatusColor: (status: StorageStatus) => string;
  getStatusLabel: (status: StorageStatus) => string;
  getTypeIcon: (type: StorageType) => React.ReactNode;
  getTypeLabel: (type: StorageType) => string;
}

export function StorageCard({ 
  unit, 
  isSelected,
  onSelect,
  onEdit, 
  onDelete,
  getStatusColor,
  getStatusLabel,
  getTypeIcon,
  getTypeLabel
}: StorageCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (area: number) => {
    return `${area.toFixed(2)} m²`;
  };

  const getPricePerSqm = () => {
    return Math.round(unit.price / unit.area);
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('ηλεκτρικό') || feature.includes('ρεύμα')) return <Zap className="w-3 h-3" />;
    if (feature.includes('φωτισμός')) return <Lightbulb className="w-3 h-3" />;
    if (feature.includes('ασφάλεια') || feature.includes('προστασία')) return <Shield className="w-3 h-3" />;
    if (feature.includes('πρίζα') || feature.includes('φόρτιση')) return <Zap className="w-3 h-3" />;
    return <Package className="w-3 h-3" />;
  };

  const getTypeColor = (type: StorageType) => {
    return type === 'storage' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700';
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg group",
        isSelected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md",
        "transform hover:scale-[1.02]"
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with type and status */}
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}>
                <Star className={cn("w-4 h-4 mr-2", isFavorite && "text-yellow-500 fill-yellow-500")} />
                {isFavorite ? 'Αφαίρεση από αγαπημένα' : 'Προσθήκη στα αγαπημένα'}
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

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        {/* Title and Code */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm text-gray-900 truncate">
              {unit.code}
            </h4>
            <Badge variant="outline" className={cn("text-xs", getTypeColor(unit.type))}>
              {getTypeLabel(unit.type)}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {unit.description}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Building className="w-3 h-3" />
              <span>Όροφος</span>
            </div>
            <div className="font-medium text-gray-900">{unit.floor}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Ruler className="w-3 h-3" />
              <span>Επιφάνεια</span>
            </div>
            <div className="font-medium text-gray-900">{formatArea(unit.area)}</div>
          </div>
        </div>

        {/* Price Information */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500">Τιμή</div>
              <div className="font-bold text-green-600">{formatPrice(unit.price)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">€/m²</div>
              <div className="font-medium text-gray-900">{getPricePerSqm().toLocaleString('el-GR')}€</div>
            </div>
          </div>
        </div>

        {/* Linked Property */}
        {unit.linkedProperty && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs">
              <Link className="w-3 h-3 text-blue-500" />
              <span className="text-gray-500">Συνδεδεμένο με:</span>
              <span className="font-medium text-blue-600">{unit.linkedProperty}</span>
            </div>
          </div>
        )}

        {/* Features */}
        {unit.features && unit.features.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">Χαρακτηριστικά:</div>
            <div className="flex flex-wrap gap-1">
              {unit.features.slice(0, 2).map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs"
                >
                  {getFeatureIcon(feature)}
                  <span className="truncate max-w-[80px]">{feature}</span>
                </div>
              ))}
              {unit.features.length > 2 && (
                <div className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-500">
                  +{unit.features.length - 2}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-xs"
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
              >
                <Eye className="w-3 h-3 mr-1" />
                Προβολή
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-xs"
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
              >
                <Edit className="w-3 h-3 mr-1" />
                Επεξεργασία
              </Button>
            </div>
            <div className="text-xs text-gray-400">
              #{unit.id.slice(-3)}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Hover overlay effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-blue-500/3 to-transparent pointer-events-none transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </Card>
  );
}