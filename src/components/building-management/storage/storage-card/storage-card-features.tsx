'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Link as LinkIcon,
  Zap,
  Lightbulb,
  Shield,
  Package
} from 'lucide-react';
import { StorageUnit } from '@/types/storage';

const getFeatureIcon = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  if (lowerFeature.includes('ηλεκτρικό') || lowerFeature.includes('ρεύμα') || lowerFeature.includes('πρίζα') || lowerFeature.includes('φόρτιση')) return <Zap className="w-3 h-3" />;
  if (lowerFeature.includes('φωτισμός')) return <Lightbulb className="w-3 h-3" />;
  if (lowerFeature.includes('ασφάλεια') || lowerFeature.includes('προστασία')) return <Shield className="w-3 h-3" />;
  return <Package className="w-3 h-3" />;
};


interface StorageCardFeaturesProps {
  unit: StorageUnit;
}

export function StorageCardFeatures({ unit }: StorageCardFeaturesProps) {
  return (
    <>
      {unit.linkedProperty && (
        <div className="pt-2 border-t border-border/10">
          <div className="flex items-center gap-1 text-xs">
            <LinkIcon className="w-3 h-3 text-blue-500" />
            <span className="text-muted-foreground">Συνδεδεμένο με:</span>
            <span className="font-medium text-blue-600">{unit.linkedProperty}</span>
          </div>
        </div>
      )}

      {unit.features && unit.features.length > 0 && (
        <div className="pt-2 border-t border-border/10">
          <div className="text-xs text-muted-foreground mb-2">Χαρακτηριστικά:</div>
          <div className="flex flex-wrap gap-1">
            {unit.features.slice(0, 2).map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs text-foreground"
              >
                {getFeatureIcon(feature)}
                <span className="truncate max-w-[80px]">{feature}</span>
              </div>
            ))}
            {unit.features.length > 2 && (
              <div className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                +{unit.features.length - 2}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
