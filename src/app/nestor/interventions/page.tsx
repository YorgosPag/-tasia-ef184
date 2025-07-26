
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function InterventionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Παρεμβάσεις Έργων</h1>
      <Card>
        <CardHeader>
          <CardTitle>Λίστα Παρεμβάσεων</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Δεν υπάρχουν καταχωρημένες παρεμβάσεις.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
