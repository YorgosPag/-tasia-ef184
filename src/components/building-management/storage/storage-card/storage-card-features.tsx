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
  if (feature.includes('ηλεκτρικό') || feature.includes('ρεύμα') || feature.includes('πρίζα') || feature.includes('φόρτιση')) return <Zap className="w-3 h-3" />;
  if (feature.includes('φωτισμός')) return <Lightbulb className="w-3 h-3" />;
  if (feature.includes('ασφάλεια') || feature.includes('προστασία')) return <Shield className="w-3 h-3" />;
  return <Package className="w-3 h-3" />;
};

interface StorageCardFeaturesProps {
  unit: StorageUnit;
}

export function StorageCardFeatures({ unit }: StorageCardFeaturesProps) {
  return (
    <>
      {unit.linkedProperty && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs">
            <LinkIcon className="w-3 h-3 text-blue-500" />
            <span className="text-gray-500">Συνδεδεμένο με:</span>
            <span className="font-medium text-blue-600">{unit.linkedProperty}</span>
          </div>
        </div>
      )}

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
            {unit.features.length > 3 && (
              <div className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-500">
                +{unit.features.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
