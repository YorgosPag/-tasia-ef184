
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function OffersPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Προσφορές Προμηθευτών</h1>
       <Card>
        <CardHeader>
          <CardTitle>Λίστα Προσφορών</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Δεν υπάρχουν καταχωρημένες προσφορές.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
