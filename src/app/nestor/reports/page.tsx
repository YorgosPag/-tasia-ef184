
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Αναφορές</h1>
       <Card>
        <CardHeader>
          <CardTitle>Διαθέσιμες Αναφορές</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Η λειτουργία αναφορών θα είναι σύντομα διαθέσιμη.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
