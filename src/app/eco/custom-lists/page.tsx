
'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimpleListsTab } from '@/features/custom-lists/components/SimpleListsTab';

export default function CustomListsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Προσαρμοσμένες Λίστες & Κατάλογοι
        </h1>
        <p className="text-muted-foreground">
          Διαχειριστείτε τις λίστες επιλογών και τους καταλόγους σύνθετων
          οντοτήτων που χρησιμοποιούνται σε όλη την εφαρμογή.
        </p>
      </div>

      <Tabs defaultValue="simple-lists" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="simple-lists">Απλές Λίστες</TabsTrigger>
          <TabsTrigger value="complex-entities" disabled>
            Σύνθετες Οντότητες
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple-lists" className="space-y-6 mt-4">
          <SimpleListsTab />
        </TabsContent>

        <TabsContent value="complex-entities">
            <Card>
                <CardHeader>
                    <CardTitle>Σύνθετες Οντότητες</CardTitle>
                    <CardDescription>
                        Η λειτουργία αυτή θα είναι διαθέσιμη σύντομα.
                    </CardDescription>
                </CardHeader>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
