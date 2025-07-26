
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function GuidesPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Οδηγίες</h1>
      <Card>
        <CardHeader>
          <CardTitle>Οδηγίες Χρήσης NESTOR</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Το περιεχόμενο για τις οδηγίες θα είναι σύντομα διαθέσιμο.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
