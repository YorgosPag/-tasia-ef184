"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

export function PropertyVideosTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Βίντεο
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 rounded-lg p-8 text-center text-muted-foreground">
          Δεν υπάρχουν βίντεο
        </div>
      </CardContent>
    </Card>
  );
}
