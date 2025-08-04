"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';

export function PropertyPhotosTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Φωτογραφίες
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
          Δεν υπάρχουν φωτογραφίες
        </div>
      </CardContent>
    </Card>
  );
}
