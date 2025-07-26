
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function StagesPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Στάδια Παρεμβάσεων</h1>
       <Card>
        <CardHeader>
          <CardTitle>Λίστα Σταδίων</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Δεν υπάρχουν καταχωρημένα στάδια.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
