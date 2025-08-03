'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building } from 'lucide-react';

export function StorageListEmptyState() {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Δεν βρέθηκαν αποθήκες
        </h3>
        <p className="text-gray-500">
          Δεν υπάρχουν αποθήκες ή θέσεις στάθμευσης που να ταιριάζουν με τα
          κριτήρια αναζήτησης.
        </p>
      </CardContent>
    </Card>
  );
}
