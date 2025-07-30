
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default function MeetingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Συσκέψεις</h1>
        <Button onClick={() => alert('New Meeting form!')}>
          <PlusCircle className="mr-2" />
          Νέα Συνάντηση
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Λίστα Συναντήσεων</CardTitle>
          <CardDescription>
            Διαχείριση όλων των συναντήσεων που αφορούν τα έργα.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h3 className="mt-4 text-lg font-medium">Δεν έχουν καταγραφεί συναντήσεις</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Καταχωρήστε την πρώτη συνάντηση για να ξεκινήσετε.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
